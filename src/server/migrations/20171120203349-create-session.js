module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Sessions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.UUID
      },
      moduleId: {
        type: Sequelize.UUID
      },
      challengeId: {
        type: Sequelize.UUID
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }),
  down: queryInterface =>
    queryInterface.dropTable('Sessions')
};
