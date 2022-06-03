
export const initUsers = (blogs) => {
  return async (dispatch) => {
    const users = blogs
      .reduce((users, blog) => {
        if (!users.find(user => user.id === blog.user.id)) {
          users.push(blog.user)
        }
        return users
      }, [])
    dispatch({
      type: 'INIT_USERS',
      data: users
    })
  }
}

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_USERS':
      return action.data
    default:
      return state;
  }
}

export default reducer