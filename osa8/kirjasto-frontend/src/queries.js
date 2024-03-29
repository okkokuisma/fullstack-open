import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      id
      name
      born
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      author {
        name
      }
      published
      genres
    }
  }
`

export const ALL_BOOKS_BY_GENRES = gql`
  query {
    allGenres {
      name
      allBooks {
        title
        author {
          name
        }
        published
      }
    }
  }
`

export const ADD_BOOK = gql`
  mutation createBook ($title: String!, $published: Int!, $author: String!, $genres: [String!]!) {
    addBook(
      title: $title
      published: $published
      author: $author
      genres: $genres
    ) {
      author {
        name
      }
      title
    }
  }
`

export const EDIT_AUTHOR = gql`
  mutation editAuthor ($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
      user {
        favoriteGenre
      }
    }
  }
`