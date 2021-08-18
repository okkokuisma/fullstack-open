import React, { useEffect, useState } from 'react'
import './index.css'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Person from './components/Person'
import contactService from './services/Contacts'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    contactService
      .getAll()
      .then(contacts => {
        setPersons(contacts)
        console.log(contacts)
      })
  }, [])
  
  const addName = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)) {
        const person = persons.find(person => person.name === newName)     
        if (window.confirm(`${person.name} is already added to the phonebook, do you want to replace the old number with a new one?`)) {
          const update = {...person, number: newNumber}
          contactService
            .update(update.id, update)
            .then(updatedPerson => {
              setPersons(persons.map(pers => pers.id !== updatedPerson.id ? pers : updatedPerson))
              setMessage(`${person.name} was updated`)
              setTimeout(() => {
                setMessage(null)
              }, 3000)
            })
            .catch(error => {
              setErrorMessage(`Information of ${person.name} was already removed from server`)
              setTimeout(() => {
                setErrorMessage(null)
              }, 3000)
            })
        }
    } else {
        const person = {name: newName, number: newNumber}
        contactService
          .create(person)
          .then(addedPerson => {
            setPersons(persons.concat(addedPerson))
            setNewName('')
            setNewNumber('')
            setMessage(`${person.name} was added`)
            setTimeout(() => {
              setMessage(null)
            }, 3000)
          })
          .catch(error => {
            setErrorMessage(error.response.data.error)
            setTimeout(() => {
              setErrorMessage(null)
            }, 3000)
          }) 
    }
  }

  const deleteName = person => {
    if (window.confirm(`Delete ${person.name}?`)) {
      contactService
        .remove(person.id)
        .then(() => {
          setPersons(persons.filter(pers => pers.id !== person.id))
          setMessage(`${person.name} was deleted`)
          setTimeout(() => {
            setMessage(null)
          }, 3000)
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleDeleteButtons = (person) => {
    return () => {
      deleteName(person)
    }
  }
  
  const filteredPersons = persons.filter(person => 
    person !== undefined && person.name.toUpperCase().includes(filter.toUpperCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification.ErrorMessage message={errorMessage} />
      <Notification.SuccessMessage message={message} />
      <Filter value={filter} handler={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm 
        addName={addName} 
        name={newName} 
        number={newNumber}
        nameHandler={handleNameChange}
        numberHandler={handleNumberChange}
      />
      <h3>Numbers</h3>
      {filteredPersons.map(person =>
        <Person key={person.id} person={person} handler={handleDeleteButtons(person)} />
      )}
    </div>
  )

}

export default App