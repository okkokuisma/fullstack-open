require('dotenv').config()
const { ApolloServer, gql, UserInputError, AuthenticationError } = require('apollo-server')
const { v1: uuid } = require('uuid')
const mongoose = require('mongoose')
const Author = require('./db/schemas/Author')
const Book = require('./db/schemas/Book')
const User = require('./db/schemas/User')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET
const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
    user: User
  }

  type Genre {
    name: String!
    allBooks: [Book!]
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    allGenres: [Genre!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const books = await Book.find({}).populate('author')
      switch (!args.author && !args.genre) {
        case true:
          return books
        case false:
          let filter
          if (!args.author) {
            filter = (b) => b.genres.some((g) => g === args.genre)
          } else if (!args.genre) {
            filter = (b) => b.author.name === args.author
          } else {
            filter = (b) => b.genres.some((g) => g === args.genre) && b.author.name === args.author
          }
          return books.filter(filter)
      }
    },
    allAuthors: async () => Author.find({}),
    me: (root, args, context) => {
      return context.user
    },
    allGenres: async () => {
      const books = await Book.find({})
      const uniqueGenres = books.reduce((prev, cur) => {
        for (let g in cur.genres) {
          prev.add(cur.genres[g])
        }
        return prev
      }, new Set())
      const genres = []
      uniqueGenres.forEach(g => genres.push({name: g}))
      return genres
    },
  },
  Author: {
    bookCount: async ({name}) => {
      const author = await Author.findOne({ name: name })
      const books = await Book.find({ author: author._id })
      return books.length
    }
  },
  Genre: {
    allBooks: async ({name}) => {
      const books = await Book.find({ genres: name }).populate('author')
      return books
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.user

      if (!currentUser) {
        throw new AuthenticationError("not authorized")
      }
      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author, bookCount: 1 })
        try {
          author.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }
      }

      const book = new Book({ ...args, author: author._id })
      try {
        await book.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return { ...book._doc, id: book._id, author: author }
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.user

      if (!currentUser) {
        throw new AuthenticationError("not authorized")
      }
      const author = await Author.findOne({ name: args.name })
      author.born = args.setBornTo
      try {
        await author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return author
    },
    createUser: async (root, args) => {
      const user = new User({ ...args })

      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if ( !user || args.password !== 'salis' ) {
        throw new AuthenticationError("wrong password or username")
      }

      const tokenUser = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(tokenUser, JWT_SECRET), user }
    },
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const trimmedAuth = auth.substring(7)
      const token = jwt.verify(trimmedAuth, JWT_SECRET)
      const user = await User.findById(token.id)
      return { user }
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})