import config from "../db/Config.js";
import bcrypt from "bcrypt";
import mssql from "mssql";
import Jwt from "jsonwebtoken";

export const requireLogin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({ error: "unauthorized!" });
  } else {
    next();
  }
};

export const authLogin = async (req, res) => {
  try {
    const { userEmail, password } = req.body;
    const pool = await mssql.connect(config.sql);
    const request = await pool
      .request()
      .input("Email", mssql.VarChar(50), userEmail)
      .query("SELECT * FROM Phonebook WHERE Email = @Email");
    const result = await request.recordset;
    if (result.length === 0) {
      res.status(404).json("User not found");
    } else {
      if (bcrypt.compareSync(password, result[0].Password)) {
        const token = Jwt.sign(
          {
            userName: result[0].FullName,
            userEmail: result[0].Email,
            userID: result[0].ID,
          },
          config.jwt_secret
        );

        res.status(200).json({
          token: `JWT ${token}`,
        });
      }
    }
  } catch (err) {
    res.status(500).json({ error: "server error" });
  } finally {
    mssql.close();
  }
};

export const authRegister = async (req, res) => {
  try {
    const { userEmail, password, fullName } = req.body;
    const pool = await mssql.connect(config.sql);
    const passwordSalt = await bcrypt.hashSync(password, 10);
    const request = await pool
      .request()
      .input("fullName", mssql.VarChar, fullName)
      .input("MobileNumber", mssql.VarChar, mobileNumber)
      .input("WorkNumber", mssql.VarChar, workNumber)
      .input("Email", mssql.VarChar, email)
      .input("HomeAddress", mssql.VarChar, homeAddress)
      .input("Email", mssql.VarChar(50), userEmail)
      .input("Password", mssql.VarChar(200), passwordSalt)
      .query(
        "INSERT INTO Phonebook (FullName, MobileNumber, WorkNumber, Email, HomeAddress, Password) VALUES (@FullName, @MobileNumber, @WorkNumber, @Email, @HomeAddress, @Password)"
      );
    res.status(200).json({ message: "Register successful" });
  } catch (err) {
    res.status(500).json({ error: "server error" });
  } finally {
    mssql.close();
  }
};
