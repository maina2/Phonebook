import sql from "mssql";
import config from "../db/config.js";

// // Get all Users
export const getUsers = async (req, res) => {
  try {
    let pool = await sql.connect(config.sql);
    const result = await pool.request().query("select * from UserData");
    !result.recordset[0]
      ? res.status(404).json({ message: "Users not found" })
      : res.status(200).json(result.recordset);
  } catch (error) {
    res.status(201).json({ error: "an error occurred while retrieving Users" });
  } finally {
    sql.close(); // Close the SQL connection
  }
};

// // Get a single User
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    let pool = await sql.connect(config.sql);
    const result = await pool
      .request()
      .input("UserId", sql.Int, id)
      .query("select * from UserData where ID = @UserId");
    !result.recordset[0]
      ? res.status(404).json({ message: "User not found" })
      : res.status(200).json(result.recordset);
  } catch (error) {
    // console.log(error);
    res.status(500).json({ error: "An error occurred while retrieving User" });
  } finally {
    sql.close();
  }
};

// // Create a new User
export const createUser = async (req, res) => {
  try {
    const { description } = req.body;
    let pool = await sql.connect(config.sql);
    let insertUser = await pool
      .request()
      .input("description", sql.VarChar, description) // Insert the description into the SQL query
      .query("insert into UserData (description) values (@description)"); // Execute the SQL query
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while creating the User" });
  } finally {
    sql.close(); // Close the SQL connection
  }
};
// // Update a User
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    let pool = await sql.connect(config.sql);
    await pool
      .request()
      .input("UserId", sql.Int, id)
      .input("UserDescription", sql.VarChar, description)
      .query(
        "UPDATE UserData SET description = @UserDescription WHERE ID = @UserId"
      );
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the User" });
  } finally {
    sql.close();
  }
};
// // Delete a User
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await sql.connect(config.sql);
    await sql.query`DELETE FROM UserData WHERE ID = ${id}`;
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the User" });
  } finally {
    sql.close();
  }
};
