import { useSelector } from 'react-redux'

const UserViewRow = ({ blog }) => {
  return (
    <li>
      {blog.title}
    </li>
  )
}

const UserView = ({ user }) => {
  const blogsByUser = useSelector(state => state.blogs
    .filter(b => b.user.username === user?.username))

  if (!user) {
    return null
  }

  return (
    <div id='user_view'>
      <h1>{ user.name }</h1>
      <h2>added blogs</h2>
        <ul>
          {blogsByUser.map(blog =>
            <UserViewRow key={blog.id} blog={ blog } />
          )}
        </ul>
    </div>
  )
}

export default UserView