const express = require("express");
const app = express();
const authRoutes = require("./Routes/routes");
const bodyParser = require("body-parser");

const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(authRoutes);
app.listen(port, () => console.log("server up !"));
