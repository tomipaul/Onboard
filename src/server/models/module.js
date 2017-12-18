module.exports = (sequelize, DataTypes) => {
  const Module = sequelize.define('Module', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    totalDuration: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Module.associate = (models) => {
    Module.hasMany(models.Challenge, {
      foreignKey: 'moduleId',
      onDelete: 'CASACADE'
    });
  };

  return Module;
};
