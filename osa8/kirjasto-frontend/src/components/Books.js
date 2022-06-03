import { useState } from "react"
import { ALL_BOOKS_BY_GENRES } from "../queries"
import { useQuery } from '@apollo/client'


const Books = ({ show, books }) => {
  const [genre, setGenre] = useState('all')
  const booksByGenre = useQuery(ALL_BOOKS_BY_GENRES)

  if (!show) {
    return null
  }
  if (books.loading | booksByGenre.loading) return null
  const genres = booksByGenre.data.allGenres.map(g => g.name)
  const filteredBooks = genre === 'all'
    ? books.data
    : booksByGenre.data.allGenres.find(g => g.name === genre)
  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.allBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setGenre('all')}>all genres</button>
      {genres.map(g => (
        <button key={g} onClick={() => setGenre(g)}>{g}</button>
      ))}
    </div>
  )
}

export default Books