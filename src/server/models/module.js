module.exports = (sequelize, DataTypes) => {
  const Module = sequelize.define('Module', {
    name: DataTypes.STRING,
    totalDuration: DataTypes.INTEGER
  });

  Module.associate = (models) => {
    Module.hasMany(models.Challenge, {
      foreignKey: 'moduleId',
      onDelete: 'CASACADE'
    });
  };

  return Module;
};