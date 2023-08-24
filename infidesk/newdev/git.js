$.git = (db) => {
  let $ = { db, stack: [] }; with ($) {
    let fstr = (n, f) => `git/files/${n}/` + (f ?? "")

    $.version_lock = false
    $.read_relative = async (path, node, f) => {
      if (node) { $.stack = [] } else { [node] = stack.slice(-1) }
      await f(await read(node, path)), stack.pop()
    }
    $.read = (...a) => _read(...a).then(v => v.content)
    $._read = async (node, path) => {
      let [a, b] = path.split("/"), f = await db.get(fstr(node, a))
      if (!f) { panic(`path "${node}:${a}" not exist`) }
      if (f.mode === "file") { $.stack.push(node); return f }
      if (f.mode === "ref" && b) { return _read(f.content, b) }
      else { return f }
    }
    $.dir = async (node) => {
      let k = fstr(node), a = await db.getpath(k)
      return a.map(([p, o]) => (o.path = p, o))
    }
    $.writecheck = async node => {
      if (!await db.get(`git/nodes/${node}`)) { panic(`node:"${node}" not exist`) }
      if (!version_lock) { return }
      const a = await db.getpath(`git/node_to/${node}`)
      if (a.length > 0) { panic(`node:"${node}" is not a leaf node`) }
    }
    $.write = async (node, name, content, mode = "file", force = false) => {
      await writecheck(node); const k = fstr(node, name) // 检查路径是否被占用
      if (!force && await db.get(k)) { panic(`path "${node}/${name}" has been occupied`) }
      await db.set(k, { mode, content })
    }
    $.remove = async (node, name) => (
      await writecheck(node), await db.del(fstr(node, name)))
    $.rename = async (node, oldname, newname) => {
      const { content: v, mode: m } = await read(node, oldname)
      await remove(node, oldname)
      await write(node, newname, v, m)
    }

    $.newgraph = name => (graphs[name] = {}, roots[name] = newnode(name))
    $.newnode = prev => {
      let name, id = uuid(); if (!nodes[prev]) {
        if (graphs[prev]) { name = prev, prev = null }
        else { panic(`previous node: "${prev}" not exist`) }
      } else { name = nodes[prev].graph }
      const n = { to: {}, from: {}, files: {}, graph: name, time: new Date }
      graphs[name][id] = nodes[id] = n; if (prev) {
        n.files = deepcopy(nodes[prev].files)
        n.from[prev] = nodes[prev].to[id] = 1
      } return id
    }
    $.newrepo = async (name) => {
      if (await db.get(`git/name_repo/${name}`)) {
        panic(`repo "${name}" already exists`)
      }
      let id = uuid(), repo = uuid()
      await Promise.all([
        db.set(`git/repo_name/${repo}`, name),
        db.set(`git/name_repo/${name}`, repo),
        db.set(`git/nodes/${id}`, repo),
        db.set(`git/repo_node/${repo}/${id}`, true),
      ])
      return id
    }
    $.newnode = async (prev) => {
      let repo = await db.get(`git/nodes/${prev}`)
      if (!repo) { panic(`previous node "${prev}" not exist`) }
      let id = uuid(), a = await db.getpath(fstr(prev))
      await Promise.all([
        db.set(`git/nodes/${id}`, repo),
        db.set(`git/repo_node/${repo}/${id}`, true),
        db.set(`git/node_to/${prev}/${id}`, true),
        db.set(`git/node_from/${id}/${prev}`, true),
        ...a.map(([p, o]) => db.set(fstr(id, p), o))])
      return id
    }

    $.getnoderepo = async node => {
      const repo = await db.get(`git/nodes/${node}`)
      if (!repo) { panic(`node ${node} is not exist`) }
      const name = await db.get(`git/repo_name/${repo}`)
      if (!name) { panic(`repo ${repo} is not exist`) }
      return name
    }
    $.getrepoid = async name => {
      const id = await db.get(`git/name_repo/${name}`)
      if (!id) { panic(`repo "${name}" not exist`) }
      return id
    }
    $.write_node_description = async node => { }
    $.read_node_description = async node => { }
    $.readrepos = () => db.getpath("git/name_repo/")
    $.readnodes = async repo => {
      const a = await db.getpath(`git/repo_node/${repo}`)
      if (a.length === 0) { panic(`repo: "${name}" has no nodes`) }
      return a.map(([v]) => v)
    }
    $.renamerepo = async (oldn, newn) => { }
  } return $
}