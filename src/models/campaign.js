'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Campaign extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Campaign.init({
    campaignId: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    description: DataTypes.STRING,
    remaining: DataTypes.BIGINT,
    damages: DataTypes.BIGINT,
    budget: DataTypes.BIGINT,
    status: DataTypes.STRING,
    disasterId: DataTypes.STRING,
    orgId: DataTypes.STRING,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Campaign',
    timestamps: true,  // Bật tính năng timestamps
    createdAt: false,  // Tắt trường createdAt
    updatedAt: false  // Giữ lại trường updatedAt
  });
  return Campaign;
};