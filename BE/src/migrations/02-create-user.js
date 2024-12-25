'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      cccd: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      phoneNumber: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      roleId: {
        type: Sequelize.TINYINT,
        defaultValue: 2,
        references: {
          model: 'Roles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      age: {
        allowNull: false,
        type: Sequelize.SMALLINT
      },
      address: {
        allowNull: false,
        type: Sequelize.STRING
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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

    await queryInterface.addConstraint('Users', {
      fields: ['email'],
      type: 'check',
      where: Sequelize.where(
        Sequelize.col('email'),
        {
          [Sequelize.Op.like]: '%@%._%'
        }
      ),
    });
    await queryInterface.addConstraint('Users', {
      fields: ['age'],
      type: 'check',
      where: Sequelize.where(
        Sequelize.col('age'),
        { [Sequelize.Op.gte]: 18 }
      ),
    });
    await queryInterface.addConstraint('Users', {
      fields: ['phoneNumber'],
      type: 'check',
      where: Sequelize.where(
        Sequelize.fn('LEN', Sequelize.col('phoneNumber')),
        { [Sequelize.Op.eq]: 10 }
      ),
    });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};