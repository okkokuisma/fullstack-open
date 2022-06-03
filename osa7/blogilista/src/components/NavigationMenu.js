import { Link } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import blogService from '../services/blogs'
import { logout } from '../reducers/userReducer'

const NavigationMenu = () => {
  const padding = {
    paddingRight: 5
  }

  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  const handleLogout = async (e) => {
    e.preventDefault()
    dispatch(logout())
    blogService.setToken(null)
    window.localStorage.removeItem('loggedUser')
  }

  return (
    <nav className='navbar'>
      <ul>
        <li><Link style={padding} to='/'>blogs</Link></li>
        <li><Link style={padding} to='/users'>users</Link></li>
        <li>{user.name} logged in</li>
        <li>
          <form onSubmit={handleLogout}>
            <button type="submit">logout</button>
          </form>
        </li>
      </ul>
    </nav>
  )
}

export default NavigationMenu