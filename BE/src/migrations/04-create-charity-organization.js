'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CharityOrganizations', {
      orgId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      orgname: {
        allowNull: false,
        type: Sequelize.STRING
      },
      contractInfo: {
        allowNull: false,
        type: Sequelize.STRING
      },
      license: {
        allowNull: false,
        type: Sequelize.STRING
      },
      isVerify: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      cccd: {
        type: Sequelize.STRING,
        references: {
          model: 'Users',
          key: 'CCCD'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
    await queryInterface.dropTable('CharityOrganizations');
  }
};