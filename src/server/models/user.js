import bcrypt from 'bcrypt-nodejs';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: {
        args: true,
        msg: 'id already exists'
      },
      validate: {
        isUUID: {
          args: 4,
          msg: 'id must be uuid'
        }
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'username is not available'
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'email already exists'
      },
      validate: {
        isEmail: {
          msg: 'email is invalid',
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  User.associate = (models) => {
    User.hasMany(models.Session, {
      foreignKey: 'userId'
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

  User.beforeBulkUpdate((user) => {
    user.attributes.password = bcrypt.hashSync(user.attributes.password);
  });

  User.prototype.verifyPassword = function verifyPassword(password) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(
        password,
        this.password,
        (error, result) =>
          ((error) ? reject(error) : resolve(result))
      );
    });
  };
  return User;
};
