"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
require("dotenv").config();

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];

const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

// ✅ Recursively load all model files in subfolders
function loadModelsRecursively(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      loadModelsRecursively(fullPath);
    } else if (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js"
    ) {
      const modelDefiner = require(fullPath);

      if (typeof modelDefiner !== "function") {
        console.warn(`⚠️  Skipped non-model file: ${fullPath}`);
        return;
      }

      const model = modelDefiner(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    }
  });
}

loadModelsRecursively(__dirname);

// ✅ Call associate if available
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

console.log("✅ Loaded models:", Object.keys(db));

module.exports = db;
