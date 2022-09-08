import { useEffect, useState } from 'react'
import { useQuery, useApolloClient } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommend from './components/Recommend'
import EditAuthors from './components/EditAuthors'
import { ALL_AUTHORS, ALL_BOOKS } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const authors = useQuery(ALL_AUTHORS)
  const books = useQuery(ALL_BOOKS)
  const client = useApolloClient()

  useEffect(() => {
    setToken(localStorage.getItem('library-user-token'))
    setUser(localStorage.getItem('library-user'))
  }, [])

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ? <button onClick={() => setPage('add')}>add book</button> : null}
        {token ? <button onClick={() => setPage('editAuthor')}>edit authors</button> : null}
        {token ? <button onClick={() => setPage('recommend')}>recommend</button> : null}
        {!token ? <button onClick={() => setPage('login')}>login</button> : null}
        {token ? <button onClick={() => logout()}>logout</button> : null}
      </div>
      <Authors show={page === 'authors'} authors={authors} />

      <EditAuthors show={page === 'editAuthor'} authors={authors} />

      <Books show={page === 'books'} books={books} />

      <NewBook show={page === 'add'} />

      <Recommend show={page === 'recommend'} books={books} user={user} />

      <Login show={page === 'login' && !token} setToken={setToken} setUser={setUser} />
    </div>
  )
}

export default App