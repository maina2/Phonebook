import sql from "mssql";
import config from "../db/Config.js";

// Get all Groups with Phonebook details
export const getGroupsWithPhonebook = async (req, res) => {
  try {
    let pool = await sql.connect(config.sql);
    const result = await pool.request().query(`
      SELECT g.ID AS GroupID, g.GroupName, p.ID AS PersonID, p.FullName, p.MobileNumber, p.WorkNumber, p.Email, p.HomeAddress
      FROM Groups g
      LEFT JOIN PhonebookGroups pg ON g.ID = pg.GroupID
      LEFT JOIN Phonebook p ON pg.PhonebookID = p.ID
    `);

    const groups = {};
    result.recordset.forEach((row) => {
      const {
        GroupID,
        GroupName,
        PersonID,
        FullName,
        MobileNumber,
        WorkNumber,
        Email,
        HomeAddress,
      } = row;
      if (!groups[GroupID]) {
        groups[GroupID] = {
          GroupID,
          GroupName,
          Phonebook: [],
        };
      }
      groups[GroupID].Phonebook.push({
        PersonID,
        FullName,
        MobileNumber,
        WorkNumber,
        Email,
        HomeAddress,
      });
    });

    const response = Object.values(groups);

    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while retrieving Group details" });
  } finally {
    sql.close();
  }
};

// Get a single Group with Phonebook details
export const getGroupWithPhonebook = async (req, res) => {
  try {
    const { id } = req.params;
    let pool = await sql.connect(config.sql);
    const result = await pool.request().input("GroupID", sql.Int, id).query(`
      SELECT g.ID AS GroupID, g.GroupName, p.ID AS PersonID, p.FullName, p.MobileNumber, p.WorkNumber, p.Email, p.HomeAddress
      FROM Groups g
      LEFT JOIN PhonebookGroups pg ON g.ID = pg.GroupID
      LEFT JOIN Phonebook p ON pg.PhonebookID = p.ID
      WHERE g.ID = @GroupID
    `);

    if (!result.recordset[0]) {
      res.status(404).json({ message: "Group not found" });
    } else {
      const { GroupID, GroupName } = result.recordset[0];
      const phonebook = result.recordset.map((row) => {
        const {
          PersonID,
          FullName,
          MobileNumber,
          WorkNumber,
          Email,
          HomeAddress,
        } = row;
        return {
          PersonID,
          FullName,
          MobileNumber,
          WorkNumber,
          Email,
          HomeAddress,
        };
      });

      const response = {
        GroupID,
        GroupName,
        Phonebook: phonebook,
      };
      res.status(200).json(response);
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while retrieving Group details" });
  } finally {
    sql.close();
  }
};
