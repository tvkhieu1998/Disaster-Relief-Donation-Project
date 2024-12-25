'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CharityOrganization extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CharityOrganization.init({
    orgId: {
      type: DataTypes.STRING,
      primaryKey: true, // Đảm bảo rằng `orgId` là khóa chính
    },
    orgname: DataTypes.STRING,
    contractInfo: DataTypes.STRING,
    license: DataTypes.STRING,
    isVerify: DataTypes.BOOLEAN,
    cccd: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'CharityOrganization',
  });
  return CharityOrganization;
};