'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FeedBack extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FeedBack.init({
    isVictim: DataTypes.BOOLEAN,
    userCCCD: DataTypes.STRING,
    victimCCCD: DataTypes.STRING,
    rating: DataTypes.TINYINT,
    comment: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'FeedBack',
  });
  return FeedBack;
};