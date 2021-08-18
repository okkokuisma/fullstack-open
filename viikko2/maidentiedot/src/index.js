import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios'
import Content from './components/Content';

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  
  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then((response) => {
        setCountries(response.data)
      })
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleCountryButtons = (country) => {
    return () => {
      setFilter(country)
    }
  }
  
  const filteredCountries = countries.filter(country =>
    country.name.toUpperCase().includes(filter.toUpperCase())
  )

  return (
    <div>
      find countries <input value={filter} onChange={handleFilterChange} />
      <Content countries={filteredCountries} handler={handleCountryButtons} />
    </div>
  )
}

ReactDOM.render(
    <App />, document.getElementById('root')
);

