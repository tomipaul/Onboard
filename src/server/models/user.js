import bcrypt from 'bcrypt-nodejs';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING
  });

  User.associate = (models) => {
    User.belongsToMany(models.Session, {
      foreignKey: 'userId',
      through: 'UserSessions',
    });
  };

  User.beforeCreate((user) => {
    user.password = bcrypt.hashSync(user.password);
    if (user.username) {
      user.username = user.username.toLowerCase();
    }
  });

  User.beforeUpdate((user) => {
    user.password = bcrypt.hashSync(user.password);
  });

  return User;
};
