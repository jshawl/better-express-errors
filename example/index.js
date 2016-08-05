var app = require("express")()
var bee = require("../index")

app.get("/", function(req, res){
  console.log(o)
})

app.use(bee(app))
app.listen(3000)