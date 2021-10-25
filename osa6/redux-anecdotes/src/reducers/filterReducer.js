export const changeFilter = (filter) => {
  return {
    type: 'CHANGE_FILTER',
    filter
  }
}

const reducer = (state = '', action) => {
  switch (action.type) {
    case "CHANGE_FILTER":
      return action.filter
    default:
      return state
  }
}

export default reducer