module.exports = (sequelize, DataTypes) => {
  const Challenge = sequelize.define('Challenge', {
    name: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    moduleId: DataTypes.INTEGER
  });

  Challenge.associate = (models) => {
    Challenge.belongsTo(models.Module, {
      foreignKey: 'moduleId',
      onDelete: 'CASACADE'
    });
  };

  return Challenge;
};