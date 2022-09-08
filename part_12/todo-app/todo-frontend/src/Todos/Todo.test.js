import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Todo from './Todo'

test('renders content', () => {
  const todo = {
    text: 'testing',
    done: false
  }

  const mock = () => {}

  render(<Todo todo={todo} onClickComplete={mock} onClickDelete={mock} />)

  const element = screen.getByText('testing')
  expect(element).toBeDefined()
})