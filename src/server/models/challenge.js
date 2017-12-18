module.exports = (sequelize, DataTypes) => {
  const Challenge = sequelize.define('Challenge', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    moduleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Challenge.associate = (models) => {
    Challenge.belongsTo(models.Module, {
      foreignKey: 'moduleId',
      onDelete: 'CASACADE'
    });
  };

  return Challenge;
};
