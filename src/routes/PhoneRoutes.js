import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/UserController.js";

const todoRoutes = (app) => {
  app.route("/phone").get(getUsers).post(createUser);

  app.route("/phone/:id").put(updateUser).get(getUser).delete(deleteUser);
};

export default todoRoutes;
