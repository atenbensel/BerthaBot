function parse_query_string(query) {
    var vars = query.split("&");
    var query_string = {};
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      // If first entry with this name
      if (typeof query_string[pair[0]] === "undefined") {
        query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
      } else if (typeof query_string[pair[0]] === "string") {
        var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
        query_string[pair[0]] = arr;
        // If third or later entry with this name
      } else {
        query_string[pair[0]].push(decodeURIComponent(pair[1]));
      }
    }
    return query_string;
  }
  
  var get_json = function(url, cb){
    var xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var res = JSON.parse(this.responseText)
        cb(res)}}
    xmlhttp.open("GET", url, true)
    xmlhttp.send()}
  
  var get_text = function(url, cb){
    var xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status == 200) {
          cb(this.responseText)
        } else if (this.status == 404) {
          cb('NOT_FOUND')
        }
      }
  }
    xmlhttp.open("GET", url, true)
    xmlhttp.send()}
  
  var authorized_get = function(url, token, cb){
    var xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var res = JSON.parse(this.responseText)
        cb(res)}}
    xmlhttp.open("GET", url, true)
    xmlhttp.setRequestHeader("Authorization", "Bearer "+token)
    xmlhttp.send()}
  
  var get_ajax = function(url, cb){
    var xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var res = this.response
        cb(res)}}
    xmlhttp.addEventListener("progress", function(e){
      if (e.lengthComputable) {
        var n = e.loaded / e.total;
      }
    })
    xmlhttp.open("GET", url, true)
    xmlhttp.responseType = "arraybuffer";
    xmlhttp.send()}
  
  var post_json = function(url, o, cb, err){
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
      if (this.readyState == 4) {
        var res = JSON.parse(this.responseText)
        if (this.status == 200) {
          cb(res)
        } else {
          err(res) 
        }}}
    xhr.open("POST", url, true)
    xhr.setRequestHeader('Content-Type', "application/json;charset=UTF-8")
    xhr.send(JSON.stringify(o))}
  
  var add_word = function(e){
    var el = e.target
    window.textarea.value += " " + el.innerText
    query()
  }
  
  var query = function(){
    var res = {corpuses:[]}
    var xs = document.getElementsByClassName("corpus active")
    for (var i = 0; i < xs.length; i++) {
      var el = xs[i]
      var id = el.corpus.id
      var weight = el.corpus.weight || 1.0
      res.corpuses.push({id: id, weight: weight})
    }
    res.input = textarea.value
    post_json("./query", res, show_words)
  }
  
  
  var post_file = function(url, file, cb, err){
    var form = new FormData()
    form.append("file", file)
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
      if (this.readyState == 4) {  
        var res = this.responseText
        if (this.status == 200) {
          if (cb) {cb(res)}
        } else {
          if (err) {err(res)}
        }}}
    xhr.upload.onprogress = function(e){
      if (e.lengthComputable) {
        var n = e.loaded / e.total
        console.log(n)
      }
    }
    xhr.open("POST", url, true)
    xhr.send(form)
  }
  