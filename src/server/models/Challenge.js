module.exports = (sequelize, DataTypes) => {
  const Challenge = sequelize.define('Challenge', {
    name: DataTypes.STRING,
    duration: DataTypes.INTEGER
  });

  Challenge.associate = (models) => {
    Challenge.hasOne(models.Module, {
      foreignKey: 'challengeId',
      onDelete: 'CASACADE'
    });
  };

  return Challenge;
};