'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Severities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.TINYINT
      },
      intensity: {
        type: Sequelize.STRING,
      },
      radius: {
        type: Sequelize.INTEGER,
        defaultValue: 50,
      },
      blur: {
        type: Sequelize.INTEGER,
        defaultValue: 30,
      },
      maxZoom: {
        type: Sequelize.INTEGER,
        defaultValue: 5,
      },
      gradient: {
        type: Sequelize.JSON
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Severities');
  }
};