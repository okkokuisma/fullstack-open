import React, { useState } from 'react'
import ReactDOM from 'react-dom'

let mostVotes = 0

const Header = ({header}) => (
  <h1>{header}</h1>
)

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))
  const handleSelected = () => {
    setSelected(Math.floor(Math.random() * 6))
  }

  const handleVotes = () => {
    const copy = {...votes}
    copy[selected] += 1
    if (copy[selected] > copy[mostVotes]) {
      mostVotes = selected
    }
    setVotes(copy)
  }
   
  return (
    <div>
      <Header header='Anecdote of the day' />
      <p>{props.anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <button onClick={handleSelected}>next anecdote</button>
      <button onClick={handleVotes}>vote</button>
      <Header header='Anecdote with most votes' />
      <p>{props.anecdotes[mostVotes]}</p>
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)
