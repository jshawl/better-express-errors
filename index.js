var fs = require("fs")
module.exports = function(app){
  app.set("view engine","hbs")
  app.set('views', __dirname)
  app.use(function(req, res, next){
    res.status(404).render("404",{
      path: req.path,
      method: req.method.toLowerCase()
    })
  })
  return function(err, req, res, next){
    var inFile = info(err.stack)
    if(fs.existsSync(inFile.file)){
      fiveHundred(inFile, err, res)
    } else {
      missingView(err, res)
    }
  }
}

function fiveHundred(inFile, err, res){
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
  res.render("error",{
    error: err,
    stack: err.stack,
    file: erroredFile,
    filename: inFile.file,
    line: inFile.line,
    column: inFile.column
  })
}

function missingView(err, res){
  console.log(err)
  var errs = err.stack.split("\n") 
  res.render('render-error',{ 
    error: errs[0],
    filename: err.view.name + err.view.ext,
    directory: err.view.root
  })
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