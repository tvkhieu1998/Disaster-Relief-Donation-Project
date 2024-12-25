'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Disaster extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Disaster.init({
    disasterId: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Disaster',
  });
  return Disaster;
};