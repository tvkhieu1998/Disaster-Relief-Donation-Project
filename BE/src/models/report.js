'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Report.init({
    orgId: DataTypes.STRING,
    cccdAmin: DataTypes.STRING,
    remaining: DataTypes.BIGINT,
    damages: DataTypes.BIGINT,
    budget: DataTypes.BIGINT,
    comment: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Report',
  });
  return Report;
};