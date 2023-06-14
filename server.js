import express from "express";
import bodyParser from "body-parser";
import config from "./src/db/config.js";
import PhoneRoutes from "./src/routes/PhoneRoutes.js";

const app = express();
//
app.use(bodyParser.json());

// my-routes
PhoneRoutes(app);

app.get("/", (req, res) => {
  res.send("Hello😁 Welcome PhoneBook API!");
});

app.listen(config.port, () => {
  console.log(`Server is running on ${config.url}`);
});
