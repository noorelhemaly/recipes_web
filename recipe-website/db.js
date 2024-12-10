const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("recipes.db");

const createUSERStable = `CREATE TABLE IF NOT EXISTS USERS (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    USERNAME TEXT UNIQUE NOT NULL,
    EMAIL TEXT UNIQUE NOT NULL,
    PASSWORD TEXT NOT NULL,
    ISADMIN INTEGER NOT NULL DEFAULT 0
)`

const createRECIPEStable = `CREATE TABLE IF NOT EXISTS RECIPES (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    TITLE TEXT NOT NULL,
    INGREDIENTS TEXT NOT NULL,
    INSTRUCTIONS TEXT NOT NULL
)`

const createSUGGESTIONStable = `CREATE TABLE IF NOT EXISTS SUGGESTIONS (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    TITLE TEXT NOT NULL,
    USER_ID INTEGER NOT NULL,
    FOREIGN KEY(USER_ID) REFERENCES USERS(ID)
)`

const createFEEDBACKStable = `CREATE TABLE IF NOT EXISTS FEEDBACKS (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    RECIPE_ID INTEGER NOT NULL,
    USER_ID INTEGER NOT NULL,
    COMMENT TEXT NOT NULL,
    FOREIGN KEY (RECIPE_ID) REFERENCES RECIPES(ID),
    FOREIGN KEY (USER_ID) REFERENCES USERS(ID)
)`

db.serialize(() => {
  db.exec(createUSERStable, (err) => {
    if (err) console.error("Error creating USERS table:", err.message);
    else console.log("USERS table ready.");
  });

  db.exec(createRECIPEStable, (err) => {
    if (err) console.error("Error creating RECIPES table:", err.message);
    else console.log("RECIPES table ready.");
  });

  db.exec(createSUGGESTIONStable, (err) => {
    if (err) console.error("Error creating SUGGESTIONS table:", err.message);
    else console.log("SUGGESTIONS table ready.");
  });

  db.exec(createFEEDBACKStable, (err) => {
    if (err) console.error("Error creating FEEDBACKS table:", err.message);
    else console.log("FEEDBACKS table ready.");
  });
});

module.exports = db;
