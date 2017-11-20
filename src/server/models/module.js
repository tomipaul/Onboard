module.exports = (sequelize, DataTypes) => {
  var Module = sequelize.define('Module', {
    name: DataTypes.STRING,
    totalDuration: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Module;
};