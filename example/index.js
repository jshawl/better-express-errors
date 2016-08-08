var app = require("express")()
var bee = require("../index")

app.get("/", function(req, res){
  res.send([
    "render engine error",
    "render template error",
    "reference error",
    "type error",
    "404"
  ].map(function(e){
    var href = "/" + e.replace(/\s/g,"-")
    return "<a href='"+href+"'>"+e+"</a>"
  }).join("<br>"))
})

app.get("/render-engine-error", function(req, res){
  res.render("fake-view")
})
app.get("/render-template-error", function(req, res){
  app.set("view engine","hbs")
  res.render("fake-view")
})
app.get("/reference-error", function(req, res){
  res.send(o)
})
app.get("/type-error", function(req, res){
  res.send(null.flooglehorn())
})

app.use(bee(app))
app.listen(3000)