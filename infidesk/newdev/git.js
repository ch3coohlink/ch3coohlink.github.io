$.git = (db) => {
  let $ = { db }; with ($) {
    $.read = async (node, path) => {
      let file
      let [a, b = ""] = path.split("/")
      if (file = await db.get(`git/nodes/${node}/file/${a}`)) {
        return file
      }
      else if (file = await db.get(`git/nodes/${node}/ref/${a}`)) {
        return read(file, b)
      }
      else throw "file not exist"
    }
    $.dir = async (node) => {
      const a = await db.getpath(`git/nodes/${node}/`)
      return a
      // [["git/nodes/fjdkajdkfsajki/ref/abc", "cvjxcizwn2nm"],
      // ["git/nodes/fjdkajdkfsajki/somefile.js", "一些代码"]]
    }
    // write("fjdkajdkfsajki", "abc", "cvjxcizwn2nm", "ref")
    // read("fjdkajdkfsajki", "abc/def.js")
    // read("cvjxcizwn2nm", "def.js")
    $.write = async (node, name, content, mode) => {
      if (await db.get(`git/nodes/${node}/file/${name}`)) { throw `path "${name}" has been occupied` }
      await db.set(`git/nodes/${node}/${mode}/${name}`, content)
    }
    $.remove = async (node, name) => {
      await db.del(`git/nodes/${node}/file/${name}`)
      await db.del(`git/nodes/${node}/ref/${name}`)
    }
    $.rename = async (node, oldname, newname) => {
      let check, file
      if (file = await db.get(`git/nodes/${node}/file/${name}`)) check = "file"
      else if (file = await db.get(`git/nodes/${node}/ref/${name}`)) check = "ref"
      else throw "file not exist"
      await db.set(`git/nodes/${node}/${check}/${newname}`, file)
      await db.del(`git/nodes/${node}/${check}/${oldname}`)
    }
    $.newrepo = (name) => {

    }
    $.newver = (name, parent) => { }
  } return $
}

$.git = (db) => {
  let $ = { db, stack: [] }; with ($) {
    let fstr = (n, f) => `git/files/${n}/` + f ?? ""

    $.read = async (node, path) => {
      let [a, b] = path.split("/"), f = await db.get(fstr(node, a))
      if (!f) { throw `path "${node}:${a}" not exist` }
      if (f.mode === "file") { $.stack.push(a); return f.content }
      if (f.mode === "ref" && b) { return read(f.content, b) }
      else { throw `try to read a ref "${a}"` }
    }
    $.dir = async (node) => {
      let k = fstr(node), a = await db.getpath(k)
      return a.map(([p, o]) => (o.path = p, o))
    }
    $.write = async (node, name, content, mode = "file") => {
      const k = fstr(node, name) // 检查路径是否被占用
      if (await db.get(k)) { throw `path "${node}:${name}" has been occupied` }
      await db.set(k, { mode, content })
    }
    $.remove = (node, name) => db.del(fstr(node, name))
    $.rename = (node, oldname, newname) => read(node, oldname).then(v =>
      Promise.all([write(node, newname, v), remove(node, oldname)]))

    $.newgraph = name => (graphs[name] = {}, roots[name] = newnode(name))
    $.newnode = prev => {
      let name, id = uuid(); if (!nodes[prev]) {
        if (graphs[prev]) { name = prev, prev = null }
        else throw `previous node: "${prev}" not exist`
      } else { name = nodes[prev].graph }
      const n = { to: {}, from: {}, files: {}, graph: name, time: new Date }
      graphs[name][id] = nodes[id] = n; if (prev) {
        n.files = deepcopy(nodes[prev].files)
        n.from[prev] = nodes[prev].to[id] = 1
      } return id
    }
    $.newrepo = async (repo) => {
      if (await db.get(`git/repos/${repo}`))
        throw `repo "${repo}" already exists`
      let id = uuid()
      await Promise.all([
        db.set(`git/repos/${repo}`, true),
        db.set(`git/nodes/${id}`, repo),
        db.set(`git/repo_node/${repo}/${id}`, true),
      ])
      return id
    }
    $.newnode = async (prev) => {
      let repo = await db.get(`git/repos/${prev}`)
      if (!repo) throw `previous node "${prev}" not exist`
      let id = uuid(), a = await db.getpath(fstr(prev))
      await Promise.all([
        db.set(`git/nodes/${id}`, repo),
        db.set(`git/repo_node/${repo}/${id}`, true),
        db.set(`git/node_to/${prev}/${id}`, true),
        db.set(`git/node_from/${id}/${prev}`, true),
        ...a.map(([p, o]) => db.set(fstr(id, p), o))])
      return id
    }
  } return $
}