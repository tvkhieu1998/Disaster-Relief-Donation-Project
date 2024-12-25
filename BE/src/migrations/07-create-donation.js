'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Donations', {
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
        onDelete: 'SET NULL'
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
      amount: {
        allowNull: false,
        type: Sequelize.BIGINT
      },
      paymentMethod: {
        allowNull: false,
        type: Sequelize.STRING
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING
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

    await queryInterface.addConstraint('Donations', {
      fields: ['amount'],
      type: 'check',
      where: {
        amount: {
          [Sequelize.Op.gte]: 50000,
        }
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Donations');
  }
};