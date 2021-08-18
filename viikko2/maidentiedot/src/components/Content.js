import React from 'react'

const Content = ({countries, handler}) => {
  if (countries.length > 10) {
      return (
        <div>Too many matches, specify filter</div>
      )
  } else if (countries.length > 1) {
      return (
        <div>
          {countries.map(country =>
            <p key={country.name}>
              {country.name}
              <button onClick={handler(country.name)}>show</button>
            </p>
          )}
        </div>
      )
  } else if (countries.length === 1) {
      const country = countries[0]
      return (
        <div>
          <h2>{country.name}</h2>
          <p>capital {country.capital}</p>
          <p>population {country.population}</p>
          <h3>Languages</h3>
          <ul>
            {country.languages.map(lang => <li key={lang.name}>{lang.name}</li>)}
          </ul>
          <img src={country.flag} alt={`$country.name flag`} width='200' height='150' ></img>
        </div>
      )
  }
  return null
}

export default Content