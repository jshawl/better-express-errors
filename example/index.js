var app = require("express")()
var bee = require("../index")

app.get("/", function(req, res){
  console.log(o)
})

app.get("/render-error", function(req, res){
  res.render("fake-view")
})

app.use(bee(app))
app.listen(3000)