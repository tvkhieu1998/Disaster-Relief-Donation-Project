'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NewsfeedComment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  NewsfeedComment.init({
    newsfeedId: DataTypes.INTEGER,
    userEmail: DataTypes.STRING,
    comment: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'NewsfeedComment',
  });
  return NewsfeedComment;
};