'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Campaigns', {
      campaignId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING
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
      status: {
        allowNull: false,
        type: Sequelize.STRING
      },
      disasterId: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: 'Disasters',
          key: 'disasterId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      orgId: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: 'CharityOrganizations',
          key: 'orgId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      startDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      endDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Campaigns');
  }
};