import sql from "mssql";
import config from "../db/config.js";

// Get all Users
export const getUsers = async (req, res) => {
  try {
    console.log("running getGroupsWithPhonebook");
    let pool = await sql.connect(config.sql);
    const result = await pool
      .request()
      .query(
        "select ID, FullName, MobileNumber, WorkNumber, Email, HomeAddress from Phonebook"
      );
    !result.recordset[0]
      ? res.status(404).json({ message: "Users not found" })
      : res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while retrieving Users" });
  } finally {
    sql.close(); // Close the SQL connection
  }
};

// Get a single User
export const getUser = async (req, res) => {
  try {
    console.log("running getGroupsWithPhonebook");
    const { id } = req.params;
    let pool = await sql.connect(config.sql);
    const result = await pool
      .request()
      .input("UserId", sql.Int, id)
      .query(
        "select ID, FullName, MobileNumber, WorkNumber, Email, HomeAddress from Phonebook where ID = @UserId"
      );
    !result.recordset[0]
      ? res.status(404).json({ message: "User not found" })
      : res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while retrieving User" });
  } finally {
    sql.close();
  }
};

// Create a new User
export const createUser = async (req, res) => {
  try {
    console.log("running getGroupsWithPhonebook");
    const { fullName, mobileNumber, workNumber, email, homeAddress } = req.body;
    let pool = await sql.connect(config.sql);
    let insertUser = await pool
      .request()
      .input("fullName", sql.VarChar, fullName)
      .input("mobileNumber", sql.VarChar, mobileNumber)
      .input("workNumber", sql.VarChar, workNumber)
      .input("email", sql.VarChar, email)
      .input("homeAddress", sql.VarChar, homeAddress)
      .query(
        "INSERT INTO Phonebook (FullName, MobileNumber, WorkNumber, Email, HomeAddress) VALUES (@fullName, @mobileNumber, @workNumber, @email, @homeAddress)"
      );
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while creating the User" });
  } finally {
    sql.close(); // Close the SQL connection
  }
};

// Update a User
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, mobileNumber, workNumber, email, homeAddress } = req.body;

    const pool = await sql.connect(config.sql); // Use your database configuration

    await pool
      .request()
      .input("UserId", sql.Int, id)
      .input("FullName", sql.VarChar(100), fullName)
      .input("MobileNumber", sql.VarChar(20), mobileNumber)
      .input("WorkNumber", sql.VarChar(20), workNumber)
      .input("Email", sql.VarChar(100), email)
      .input("HomeAddress", sql.VarChar(200), homeAddress).query(`
        UPDATE Phonebook
        SET FullName = @FullName,
            MobileNumber = @MobileNumber,
            WorkNumber = @WorkNumber,
            Email = @Email,
            HomeAddress = @HomeAddress
        WHERE ID = @UserId
      `);

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the User" });
  } finally {
    sql.close(); // Close the SQL connection
  }
};

// Delete a User
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    let pool = await sql.connect(config.sql);
    await pool
      .request()
      .input("UserId", sql.Int, id)
      .query("DELETE FROM Phonebook WHERE ID = @UserId");
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the User" });
  } finally {
    sql.close();
  }
};
