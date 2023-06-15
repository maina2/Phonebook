import express from "express";
import bodyParser from "body-parser";
import config from "./src/db/config.js";
import PhoneBookRoutes from "./src/routes/PhoneRoutes.js";
import auth from "./src/routes/auth.js";

import userAuthorized from "./src/middleware/auth.js";

const app = express();
//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//jwt middleware
app.use(userAuthorized);

app.use(bodyParser.json());

// my-routes
app.use(express.json());
PhoneBookRoutes(app);
auth(app);

app.get("/", (req, res) => {
  res.send("Hello😁 Welcome PhoneBook API!");
});

app.listen(config.port, () => {
  console.log(`Server is running on ${config.url}`);
});
