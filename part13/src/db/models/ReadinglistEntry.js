module.exports = (sequelize, DataTypes) => {
  return sequelize.define('readinglistItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    blogId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'blogs', key: 'id' },
      onDelete: 'CASCADE'
    },
    read: {
      type: DataTypes.BOOLEAN
    }
  }, {
    timestamps: false,
    tableName: 'readinglist_items',
    underscored: true,
  })
}