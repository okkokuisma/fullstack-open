
const reducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_TIMEOUT':
      return action.timeout
    default:
      return state
  }
}

export default reducer