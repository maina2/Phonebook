import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/UserController.js";
import {
  getUsersGroups,
  getUserGroup,
  createUserGroups,
  updateUserGroups,
  deleteUserGroups,
} from "../controllers/GroupsController.js";
import {
  getGroupsWithPhonebook,
  getGroupWithPhonebook,
} from "../controllers/GroupUsersController.js";
import {
  getUserGroups,
  addUserToGroup,
  removeUserFromGroup,
} from "../controllers/UserGroupControllers.js";
import { requireLogin } from "../controllers/authControllers.js";

const PhoneBookRoutes = (app) => {
  app.route("/user").get(requireLogin, getUsers).post(requireLogin, createUser);
  app
    .route("/user/:id")
    .put(requireLogin, updateUser)
    .get(requireLogin, getUser)
    .delete(requireLogin, deleteUser);

  app
    .route("/group")
    .get(requireLogin, getUsersGroups)
    .post(requireLogin, createUserGroups);
  app
    .route("/group/:id")
    .put(requireLogin, updateUserGroups)
    .get(requireLogin, getUserGroup)
    .delete(requireLogin, deleteUserGroups);

  app.route("/group-user").get(requireLogin, getGroupsWithPhonebook);
  app.route("/group/:id/user").get(requireLogin, getGroupWithPhonebook);

  app.route("/user/:id/group").get(requireLogin, getUserGroups);

  app
    .route("/user/:id/group")
    .post(requireLogin, addUserToGroup)
    .delete(requireLogin, removeUserFromGroup);
};

export default PhoneBookRoutes;
