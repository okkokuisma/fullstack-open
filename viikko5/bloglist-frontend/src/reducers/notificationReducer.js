export const setNotification = (notification, time) => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_NOTIFICATION',
      notification: notification
    })

    const timeoutId = setTimeout(() => {
      dispatch({
        type: 'SET_NOTIFICATION',
        notification: ''
      })
    }, time * 1000);

    dispatch({
      type: 'SET_TIMEOUT',
      timeout: timeoutId
    })
  }
}

const reducer = (state = '', action) => {
  switch (action.type) {
    case "SET_NOTIFICATION":
      return action.notification
    default:
      return state
  }
}

export default reducer