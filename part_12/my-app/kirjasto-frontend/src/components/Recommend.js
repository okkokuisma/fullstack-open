const Recommend = ({ show, books, user }) => {
  if (!show || !user) {
    return null
  }
  if (books.loading) return null
  console.log(user)
  const favoriteGenre = user.favoriteGenre

  return (
    <div>
      <h2>books in your favorite genre {favoriteGenre}</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.data.allBooks.filter(b => b.genres.includes(favoriteGenre)).map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend