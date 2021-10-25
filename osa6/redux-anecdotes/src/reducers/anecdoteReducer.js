import anecdoteService from '../services/anecdotes'

export const vote = (anecdote) => {
  return async (dispatch) => {
    await anecdoteService.updateAnecdote({ ...anecdote, votes: anecdote.votes + 1 })
    dispatch({
      type: 'VOTE',
      data: { id: anecdote.id },
    })
  }
}

export const newAnecdote = (content) => {
  return async (dispatch) => {
    const createdAnecdote = await anecdoteService.createAnecdote({ content: content, votes: 0 })
    console.log(createdAnecdote)
    dispatch({
      type: 'CREATE',
      data: createdAnecdote
    })
  }
}

export const initAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES',
      data: anecdotes
    })
  }
}

const reducer = (state = [], action) => {
  console.log('state now: ', state)
  console.log('action', action)

  switch (action.type) {
    case 'VOTE':
      const id = action.data.id
      const initialAnecdote = state.find(a => a.id === id)
      const modifiedAnecdote = { ...initialAnecdote, votes: initialAnecdote.votes + 1 }
      return state.map(a => a.id === id ? modifiedAnecdote : a)
    case 'CREATE':
      return [ ...state, action.data ]
    case 'INIT_ANECDOTES':
      return action.data
    default:
      return state;
  }
}

export default reducer