'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      orgId: {
        type: Sequelize.STRING,
        references: {
          model: 'CharityOrganizations',
          key: 'orgId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      cccdAmin: {
        type: Sequelize.STRING,
        references: {
          model: 'Users',
          key: 'CCCD'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      remaining: {
        type: Sequelize.BIGINT,
        defaultValue: 0
      },
      damages: {
        type: Sequelize.BIGINT,
        defaultValue: 0
      },
      budget: {
        type: Sequelize.BIGINT,
        defaultValue: 0
      },
      comment: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('Reports');
  }
};