import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries'

const EditAuthors = ({ show, authors }) => {
  const [ author, setAuthor ] = useState('')
  const [ year, setYear ] = useState('')
  const [ editAuthor ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ { query: ALL_AUTHORS } ]
  })

  if (!show) {
    return null
  }
  if (authors.loading) return null

  const submit = (e) => {
    e.preventDefault()
    editAuthor({ variables: { name: author, setBornTo: Number(year) } })

    setAuthor('')
    setYear('')
  }

  return (
    <div>
      <h2>set birthyear</h2>
      <form onSubmit={submit}>
        <select
          onChange={({ target }) => setAuthor(target.value)}
        >
          {authors.data.allAuthors.map((a) => (
            <option key={a.id} value={a.name}>{a.name}</option>
          ))}
        </select>
        <div>
          <label> year
            <input
              value={year}
              onChange={({ target }) => setYear(target.value)}
            />
          </label>
        </div>
        <button type='submit'>edit</button>
      </form>
    </div>
  )
}

export default EditAuthors