import React from 'react'
import { useSelector } from 'react-redux'

const ErrorMessage = () => {
  const notification = useSelector(state => state.notification.errorMessage)

  if (notification === null) {
    return null
  }

  return (
    <div className='errorMessage'>
      {notification}
    </div>
  )
}

const SuccessMessage = () => {
  const notification = useSelector(state => state.notification.successMessage)

  if (notification === null) {
    return null
  }

  return (
    <div className='successMessage'>
      {notification}
    </div>
  )
}

const exportedObject = { ErrorMessage, SuccessMessage }

export default exportedObject