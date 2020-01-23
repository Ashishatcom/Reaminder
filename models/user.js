'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    Name: DataTypes.STRING,
    Appdate: DataTypes.DATE,
    email: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};