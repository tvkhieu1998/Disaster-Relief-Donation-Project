'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Victims', {
      cccd: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      damages: {
        type: Sequelize.BIGINT,
        defaultValue: 0
      },
      received: {
        type: Sequelize.BIGINT,
        defaultValue: 0
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
      receivedDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Victims');
  }
};