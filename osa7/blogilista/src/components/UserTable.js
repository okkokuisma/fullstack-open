import { useSelector } from 'react-redux'
import { Link } from "react-router-dom"

const UserTableRow = ({ id, name, blogs }) => {
  return (
    <tr>
      <td><Link to={`/users/${ id }`}>{ name }</Link></td>
      <td>{ blogs }</td>
    </tr>
  )
}

const UserTable = () => {
  const blogsByUsers = useSelector(state => state.blogs
    .reduce((users, blog) => {
      let i = users.findIndex(user => user.id === blog.user.id)

      i > 0
      ? users[i].blogs += 1
      : users.push( {id: blog.user.id, name : blog.user.name, blogs : 1} )

      return users
    }, []))

  return (
  <div id='user_table'>
    <h2>Users</h2>
    <table>
      <thead>
        <tr>
          <th>User</th>
          <th>Blogs created</th>
        </tr>
      </thead>
      <tbody>
        {blogsByUsers.map(user =>
          <UserTableRow key={user.id} id={ user.id } name={ user.name } blogs={ user.blogs } />
        )}
      </tbody>
    </table>
  </div>
  )
}

export default UserTable