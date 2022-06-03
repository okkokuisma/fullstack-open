import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent, waitFor } from '@testing-library/react'
import CreateBlogForm from './CreateBlogForm'
import { act } from 'react-dom/test-utils'

let component
const mockCreateBlog = jest.fn()

beforeEach(() => {
  component = render(
    <CreateBlogForm createBlog={mockCreateBlog} />
  )
})

test('input values are set correctly when submitting form', async () => {
  const titleInput = component.container.querySelector('#title')
  const authorInput = component.container.querySelector('#author')
  const urlInput = component.container.querySelector('#url')
  const form = component.container.querySelector('form')

  fireEvent.change(titleInput, {
    target: { value: 'test title' }
  })
  fireEvent.change(authorInput, {
    target: { value: 'test author' }
  })
  fireEvent.change(urlInput, {
    target: { value: 'test url' }
  })

  fireEvent.submit(form)

  expect(mockCreateBlog.mock.calls).toHaveLength(1)
  await waitFor(() => {
    expect(mockCreateBlog.mock.calls[0][0].title).toBe('test title')
    expect(mockCreateBlog.mock.calls[0][0].author).toBe('test author')
    expect(mockCreateBlog.mock.calls[0][0].url).toBe('test url')
  })
})