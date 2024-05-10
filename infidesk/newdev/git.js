$.git = (db) => {
  let $ = { db }; with ($) {
    let fstr = (n, f) => `git/files/${n}/` + (f ?? "")

    $.version_lock = true
    $.read = (...a) => rawread(...a).then(v => v.content)
    $.rawread = async (node, path) => {
      let [a, b] = path.split("/"), f = await db.get(fstr(node, a))
      if (!f) { panic(`path "${node}:${a}" not exist`) }
      if (f.mode === "file") {
        const content = await db.get(`git/hashobj/${f.content}`)
        if (!content) { panic(`hashobj ${f.content} not exist`) }
        return { node, path, content }
      }
      if (f.mode === "ref" && b) { return rawread(f.content, b) }
      else { return { node, path, ...f } }
    }
    $.dir = async (node) => {
      let k = fstr(node), a = await db.getpath(k)
      return a.map(([path, o]) => ({ node, path, ...o }))
    }
    $.versioncheck = async node => {
      if (!await db.get(`git/nodes/${node}`)) { panic(`node:"${node}" not exist`) }
      if (!version_lock) { return }
      const a = await db.getpath(`git/node_to/${node}`)
      if (a.length > 0) { panic(`node:"${node}" is not a leaf node`) }
    }
    $.write = async (node, name, content, mode = "file") => {
      await versioncheck(node); const k = fstr(node, name)
      if (await db.get(k)) { panic(`path "${node}/${name}" has been occupied`) }
      if (mode === 'file') {
        const h = await sha256(content), hk = `git/hashobj/${h}`
        let ho = await db.get(hk), a = []
        if (!ho) { a.push(db.set(hk, content)) }
        a.push(db.set(`git/hashref/${h}/${node}/${name}`, true))
        a.push(db.set(k, { mode, content: h }))
        await Promise.all(a)
      } else { await db.set(k, { mode, content }) }
    }
    $.remove = async (node, name) => {
      await versioncheck(node)
      const k = fstr(node, name), r = await db.get(k)
      if (!r) { panic(`path "${node}/${name}" not exist`) }
      if (r.mode === 'file') {
        await db.del(`git/hashref/${r.content}/${node}/${name}`)
        const a = await db.getpath(`git/hashref/${r.content}`)
        if (a.length <= 0) { await db.del(`git/hashobj/${r.content}`) }
      } await db.del(k)
    }
    $.rename = async (node, oldname, newname) => {
      const { content: v, mode: m } = await rawread(node, oldname)
      await remove(node, oldname); await write(node, newname, v, m)
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

    // TODO
    $.merge = async (a, b) => {
      // check version existence
      // check version in same repo
      // find most recent common ancestor
      // diff a b with ancester
      // diff the diff result in a and b, find conflict
      // call the conflict solve procedure
      // apply the solve, create a new version
      // merge finish
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