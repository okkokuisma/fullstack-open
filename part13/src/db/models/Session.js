module.exports = (sequelize, DataTypes) => {
  return sequelize.define('session', {
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
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    underscored: true,
    timestamps: true,
    updatedAt: false,
  })
}