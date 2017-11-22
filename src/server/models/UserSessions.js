module.exports = (sequelize, DataTypes) => {
    const UserSessions = sequelize.define('UserSessions', {
      sessionId: {
        type: DataTypes.INTEGER,
        unique: false
      },
      userId: DataTypes.INTEGER
    });
    
    return UserSessions;
};
  