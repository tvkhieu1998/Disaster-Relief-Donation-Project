'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Victim extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Victim.init({
    cccd: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    name: DataTypes.STRING,
    damages: DataTypes.BIGINT,
    received: DataTypes.BIGINT,
    disasterId: DataTypes.STRING,
    receivedDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Victim',
    timestamps: true,  // Bật tính năng timestamps
    createdAt: false,  // Tắt trường createdAt
    updatedAt: false  // Tắt trường updatedAt
  });
  return Victim;
};