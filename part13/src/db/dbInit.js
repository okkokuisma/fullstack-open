const { Sequelize } = require('sequelize')
const { Umzug, SequelizeStorage } = require('umzug')

const DB_CONNECTION_RETRY_LIMIT = 10
const { DATABASE_URL } = require('../utils/config')
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
})

const Blog = require('./models/Blog')(sequelize, Sequelize.DataTypes)
const User = require('./models/User')(sequelize, Sequelize.DataTypes)
const ReadinglistEntry = require('./models/ReadinglistEntry')(sequelize, Sequelize.DataTypes)
const Session = require('./models/Session')(sequelize, Sequelize.DataTypes)

User.hasMany(Blog)
Blog.belongsTo(User)
User.belongsToMany(Blog, { through: ReadinglistEntry, as: 'addedBlogs', onDelete: 'CASCADE' })
Blog.belongsToMany(User, { through: ReadinglistEntry, as: 'usersAdded', onDelete: 'CASCADE' })

const closeConnection = async () => {
  await sequelize.close()
}

const connectToDatabase = async (attempt = 0) => {
  try {
    await sequelize.authenticate()
    await runMigrations()
    console.log('Connected to database')
  }
  catch (e) {
    if (attempt === DB_CONNECTION_RETRY_LIMIT) {
      console.log(`Connection to database failed after ${attempt} attempts`)
      process.exit(1)
    }

    console.log(
      `Connection to database failed! Attempt ${attempt} of ${DB_CONNECTION_RETRY_LIMIT}`,
    )

    await sleep(3000)
    connectToDatabase(attempt + 1)
  }
}

const runMigrations = async () => {
  const migrator = new Umzug({
    migrations: {
      glob: 'migrations/*.js',
    },
    storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
    context: sequelize.getQueryInterface(),
    logger: console,
  })
  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  })
}

module.exports = {
  connectToDatabase,
  closeConnection,
  Blog,
  User,
  ReadinglistEntry,
  Session
}