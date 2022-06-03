export const setSuccessNotification = (notification, time) => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_SUCCESS_NOTIFICATION',
      message: { successMessage: notification }
    })

    const timeoutId = setTimeout(() => {
      dispatch({
        type: 'SET_SUCCESS_NOTIFICATION',
        message: { successMessage: null }
      })
    }, time * 1000);

    dispatch({
      type: 'SET_TIMEOUT',
      timeout: timeoutId
    })
  }
}

export const setErrorNotification = (notification, time) => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_ERROR_NOTIFICATION',
      message: { errorMessage: notification }
    })

    const timeoutId = setTimeout(() => {
      dispatch({
        type: 'SET_ERROR_NOTIFICATION',
        message: { errorMessage: null }
      })
    }, time * 1000);

    dispatch({
      type: 'SET_TIMEOUT',
      timeout: timeoutId
    })
  }
}

const reducer = (state = {successMessage: null, errorMessage: null }, action) => {
  switch (action.type) {
    case "SET_SUCCESS_NOTIFICATION":
      return {...state, successMessage: action.message.successMessage}
    case "SET_ERROR_NOTIFICATION":
      return {...state, errorMessage: action.message.errorMessage}
    default:
      return state
  }
}

export default reducer