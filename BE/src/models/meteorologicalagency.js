'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MeteorologicalAgency extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MeteorologicalAgency.init({
    agencyId: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    name: DataTypes.STRING,
    dataFeed: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'MeteorologicalAgency',
  });
  return MeteorologicalAgency;
};