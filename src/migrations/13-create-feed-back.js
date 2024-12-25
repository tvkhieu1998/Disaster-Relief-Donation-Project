'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FeedBacks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      isVictim: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      userCCCD: {
        type: Sequelize.STRING,
        references: {
          model: 'Users',
          key: 'CCCD'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      victimCCCD: {
        type: Sequelize.STRING,
        references: {
          model: 'Victims',
          key: 'CCCD'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      rating: {
        type: Sequelize.TINYINT
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
    await queryInterface.dropTable('FeedBacks');
  }
};