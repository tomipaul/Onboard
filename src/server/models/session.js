'use strict';
module.exports = (sequelize, DataTypes) => {
  var Session = sequelize.define('Session', {
    name: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    moduleId: DataTypes.INTEGER,
    challengeId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Session;
};