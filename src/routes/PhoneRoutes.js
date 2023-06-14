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

const todoRoutes = (app) => {
  app.route("/user").get(getUsers).post(createUser);
  app.route("/user/:id").put(updateUser).get(getUser).delete(deleteUser);

  app.route("/group").get(getUsersGroups).post(createUserGroups);
  app
    .route("/group/:id")
    .put(updateUserGroups)
    .get(getUserGroup)
    .delete(deleteUserGroups);

  app.route("/group/user").get(getGroupsWithPhonebook);
  app.route("/group/user/:id").get(getGroupWithPhonebook);

  app
    .route("/user/:id/group")
    .get(getUserGroups)
    .post(addUserToGroup)
    .delete(removeUserFromGroup);
};

export default todoRoutes;
