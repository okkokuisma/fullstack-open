import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

let component
const mockHandler = jest.fn()

beforeEach(() => {
  const blog = {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7
  }

  component = render(
    <Blog
      blog={blog}
      likeBlog={mockHandler}
      deleteBlog={() => {}} />
  )
})

test('renders content correctly at start', () => {
  const visibleDiv = component.container.querySelector('.visibleContent')

  expect(visibleDiv).toBeDefined()

  expect(visibleDiv).toHaveTextContent(
    'React patterns by Michael Chan'
  )

  const togglableDiv = component.container.querySelector('.toggledContent')
  expect(togglableDiv).toHaveStyle('display: none')
})

test('renders content correctly after clicking show button', () => {
  const button = component.getByText('show')
  fireEvent.click(button)

  const togglableDiv = component.container.querySelector('.toggledContent')
  expect(togglableDiv).not.toHaveStyle('display: none')
})

test('clicking the show button calls handler correctly', () => {
  const button = component.getByText('like')
  fireEvent.click(button)
  expect(mockHandler.mock.calls).toHaveLength(1)
  fireEvent.click(button)
  expect(mockHandler.mock.calls).toHaveLength(2)
})