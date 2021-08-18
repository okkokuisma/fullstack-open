import React from 'react'

const Person = ({person, handler}) => {
    return (
        <>
          <p>
            {person.name} {person.number}
            <button onClick={handler}>delete</button>
          </p>
        </>
    )
}

export default Person