const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('readinglist_items', 'read', {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('readinglist_items', 'read')
  },
}