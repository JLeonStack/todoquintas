let express = require("express");

let app = express();

app.use(express.static("./dist/todoquintas"));

app.get("/*", function (req, res) {
  res.sendFile("index.html", { root: "dist/todoquintas" });
});

app.listen(process.env.PORT || 8080, () => {
  console.log("Funciono");
});
