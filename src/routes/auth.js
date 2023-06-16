import { authLogin, authRegister } from "../controllers/authControllers.js";

const auth = (app) => {
  app.post("/api/auth/login", authLogin);

  app.post("/api/auth/register", authRegister);
};
export default auth;
