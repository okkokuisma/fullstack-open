module.exports = (sequelize, DataTypes) => {
  return sequelize.define('blog', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    author: {
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    year: {
      type: DataTypes.INTEGER,
      validate: {
        min: {
          args: 1991,
          msg: 'Year cannot be set to be under 1991.'
        },
        max: {
          args: new Date().getFullYear(),
          msg: 'Year cannot be set to be greater than the current year.'
        },
      }
    },
  }, {
    timestamps: true,
    tableName: 'blogs',
    underscored: true,
  })
}