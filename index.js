var fs = require("fs")
var Handlebars = require("handlebars")
module.exports = function(app){
  app.use(function(req, res, next){
    res.status(404).send(render("404",{
      path: req.path,
      method: req.method.toLowerCase()
    }))
  })
  return function(err, req, res, next){
    var inFile = info(err.stack)
    if(fs.existsSync(inFile.file)){
      fiveHundred(inFile, err, res, app)
    } else {
      missingView(err, res,app)
    }
  }
}

function fiveHundred(inFile, err, res, app){
  var erroredFile = fs.readFileSync(inFile.file,'utf8')
  .split("\n")
  .map(function(e, i){
    if(i+1 === inFile.line){
      return "<div lineno='"+(1+i)+" ' class='err'>" + e + "</div>"
    }
    return "<div lineno='"+(1+i)+" '>" + e + "</div>"
  })
  .filter(function(e,i){
    return Math.abs(i+1 - inFile.line ) < 3
  })
  .join("")
  res.send(render("error",{
    error: err,
    stack: err.stack,
    file: erroredFile,
    filename: inFile.file,
    line: inFile.line,
    column: inFile.column
  }))
}

function missingView(err, res, app){
  var errs = err.stack.split("\n") 
  if(errs[0].match(/No default engine/)){
    return res.send(render('render-engine-missing',{
      error: errs[0]
    }))
  }
  if(errs[0].match(/Failed to lookup view/)){
    console.log(app.get("views"))
    return res.send(render('render-template-missing',{
      error: errs[0],
      filename: errs[0].match(/"([^\s]+)"/)[1] + "."+ app.get("view engine"),
      directory: app.get("views")
    }))
  }
}

function info(stack){
  try{
  var info = stack.split("\n")[1]
    .replace(/^\s+at\s/,'').split(":")
    return {
      file: info[0],
      line: parseInt(info[1]),
      column: info[2]
    }
  }catch(e){
    return false
  }
}

function render(template, context){
  var source = fs.readFileSync(__dirname + "/" + template + ".hbs", "utf8")
  var tpl = Handlebars.compile(source);
  var html = fs.readFileSync(__dirname + "/header.hbs", "utf8")
  html += tpl(context)
  html += fs.readFileSync(__dirname + "/footer.hbs", "utf8")
  return html
}