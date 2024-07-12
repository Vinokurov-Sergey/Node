'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user.init({
    userName: DataTypes.STRING,
    firstName: DataTypes.STRING,
    middleName: DataTypes.STRING,
    surName: DataTypes.STRING,
    image: DataTypes.STRING,
    password: DataTypes.STRING,
    permission: DataTypes.JSONB,
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};