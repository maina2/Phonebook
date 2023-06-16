import sql from "mssql";
import config from "../db/Config.js";

// Get all User Groups
export const getUsersGroups = async (req, res) => {
  try {
    let pool = await sql.connect(config.sql);
    const result = await pool.request().query("SELECT * FROM Groups");
    !result.recordset[0]
      ? res.status(404).json({ message: "User Groups not found" })
      : res.status(200).json(result.recordset);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while retrieving User Groups" });
  } finally {
    sql.close(); // Close the SQL connection
  }
};

// Get a single User Group
export const getUserGroup = async (req, res) => {
  try {
    const { id } = req.params;
    let pool = await sql.connect(config.sql);
    const result = await pool
      .request()
      .input("GroupID", sql.Int, id)
      .query("SELECT * FROM Groups WHERE ID = @GroupID");
    !result.recordset[0]
      ? res.status(404).json({ message: "User Group not found" })
      : res.status(200).json(result.recordset);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while retrieving User Group" });
  } finally {
    sql.close();
  }
};

// Create a new User Group
export const createUserGroups = async (req, res) => {
  try {
    const { groupName } = req.body;
    let pool = await sql.connect(config.sql);
    await pool
      .request()
      .input("GroupName", sql.VarChar, groupName)
      .query("INSERT INTO Groups (GroupName) VALUES (@GroupName)");
    res.status(201).json({ message: "User Group created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while creating the User Group" });
  } finally {
    sql.close();
  }
};

// Update a User Group
export const updateUserGroups = async (req, res) => {
  try {
    const { id } = req.params;
    const { groupName } = req.body;
    let pool = await sql.connect(config.sql);
    await pool
      .request()
      .input("GroupID", sql.Int, id)
      .input("GroupName", sql.VarChar, groupName)
      .query("UPDATE Groups SET GroupName = @GroupName WHERE ID = @GroupID");
    res.status(200).json({ message: "User Group updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the User Group" });
  } finally {
    sql.close();
  }
};

// Delete a User Group
export const deleteUserGroups = async (req, res) => {
  try {
    const { id } = req.params;
    let pool = await sql.connect(config.sql);
    await pool.query`DELETE FROM Groups WHERE ID = ${id}`;
    res.status(200).json({ message: "User Group deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the User Group" });
  } finally {
    sql.close();
  }
};
