import sql from "mssql";
import config from "../db/config.js";

// Get user's groups
export const getUserGroups = async (req, res) => {
  try {
    const { id } = req.params;
    let pool = await sql.connect(config.sql);
    const result = await pool.request().input("UserID", sql.Int, id).query(`
        SELECT g.ID AS GroupID, g.GroupName
        FROM Groups g
        INNER JOIN UserGroups ug ON g.ID = ug.GroupID
        WHERE ug.UserID = @UserID
      `);

    !result.recordset[0]
      ? res.status(404).json({ message: "User Groups not found" })
      : res.status(200).json(result.recordset);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while retrieving User Groups" });
  } finally {
    sql.close();
  }
};

// Add user to a group
export const addUserToGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { groupID } = req.body;
    let pool = await sql.connect(config.sql);
    await pool
      .request()
      .input("UserID", sql.Int, id)
      .input("GroupID", sql.Int, groupID)
      .query(
        "INSERT INTO UserGroups (UserID, GroupID) VALUES (@UserID, @GroupID)"
      );
    res.status(201).json({ message: "User added to group successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while adding the user to the group" });
  } finally {
    sql.close();
  }
};

// Remove user from a group
export const removeUserFromGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { groupID } = req.body;
    let pool = await sql.connect(config.sql);
    await pool
      .request()
      .input("UserID", sql.Int, id)
      .input("GroupID", sql.Int, groupID)
      .query(
        "DELETE FROM UserGroups WHERE UserID = @UserID AND GroupID = @GroupID"
      );
    res.status(200).json({ message: "User removed from group successfully" });
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while removing the user from the group",
    });
  } finally {
    sql.close();
  }
};
