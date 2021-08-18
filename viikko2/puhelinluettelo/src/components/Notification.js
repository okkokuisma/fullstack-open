import React from 'react'

const ErrorMessage = ({message}) => {
    if (message === null) {
        return null
    }

    return (
        <div className='errorMessage'>
        {message}
        </div>
    )
}

const SuccessMessage = ({message}) => {
    if (message === null) {
        return null
    }

    return (
        <div className='successMessage'>
        {message}
        </div>
    )
}

export default {ErrorMessage, SuccessMessage}