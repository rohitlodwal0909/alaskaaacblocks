'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    queryInterface.createTable('leads', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      phone: Sequelize.STRING,
      source: Sequelize.STRING,
      status: {
        type: Sequelize.ENUM('New', 'Contacted', 'Interested', 'Converted', 'Lost'),
        defaultValue: 'New'
      },
      assigned_to: Sequelize.STRING,
      notes: Sequelize.TEXT,
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
      }
    }).then(() => {
      done(); // ✅ success callback
    }).catch((err) => {
      done(err); // ❌ error callback
    });
  },

  down: function (queryInterface, Sequelize, done) {
    queryInterface.dropTable('leads')
      .then(() => done())
      .catch(err => done(err));
  }
};
