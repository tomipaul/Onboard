module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define('Session', {
    name: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    moduleId: DataTypes.INTEGER,
    challengeId: DataTypes.INTEGER
  });

  Session.associate = (models) => {
    Session.belongsTo(models.Challenge, {
      foreignKey: 'challengeId',
      onDelete: 'CASACADE'
    });

    Session.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASACADE'
    });
  };

  return Session;
};