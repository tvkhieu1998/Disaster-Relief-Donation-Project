'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NewsFeed extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  NewsFeed.init({
    newsAgency: DataTypes.STRING,
    title: DataTypes.TEXT,
    articleUrl: DataTypes.TEXT,
    thumbnails: DataTypes.TEXT,
    summary: DataTypes.TEXT,
    content: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'NewsFeed',
  });
  return NewsFeed;
};