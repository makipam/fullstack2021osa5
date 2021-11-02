import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'
import BlogForm from './BlogForm'

test('renders only title and author', () => {
  const blog = {
    title: 'Test title',
    author: 'Test author',
    url: 'testurl.com',
    likes: 15,
    user: {
      name: 'kayttaja'
    }
  }

  const component = render(
    <Blog blog={blog} />
  )

  component.debug()

  expect(component.container).toHaveTextContent(
    'Test title'
  )
  expect(component.container).not.toHaveTextContent(
    'testurl'
  )
})

test('renders rest of the information after "show" button is clicked', () => {
  const blog = {
    title: 'Test title',
    author: 'Test author',
    url: 'testurl.com',
    likes: 15,
    user: {
      name: 'kayttaja'
    }
  }

  const user = {
    username: 'kayttajatunnus',
    name: 'kayttaja',
    password: 'password'
  }

  const component = render(
    <Blog blog={blog} user={user} />
  )

  const button = component.getByText('View')
  fireEvent.click(button)

  component.debug()

  expect(component.container).toHaveTextContent(
    'testurl'
  )
  expect(component.container).toHaveTextContent(
    'likes'
  )
})


test('clicking the button calls event handler once', async () => {
  const blog = {
    title: 'Test title 2',
    author: 'Test author 2',
    url: 'testurl2.com',
    likes: 150,
    user: {
      name: 'kayttaja'
    }
  }

  const user = {
    username: 'kayttajatunnus',
    name: 'kayttaja',
    password: 'password'
  }

  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} user={user} updateLikes={mockHandler} />
  )

  const button = component.getByText('View')
  fireEvent.click(button)

  const button1 = component.getByText('like')
  fireEvent.click(button1)
  fireEvent.click(button1)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('<BlogForm /> updates parent state and calls onSubmit', () => {
  const createBlog = jest.fn()

  const component = render(
    <BlogForm createBlog={createBlog} />
  )

  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')
  const form = component.container.querySelector('form')

  fireEvent.change(title, {
    target: { value: 'testing of forms could be easier' }
  })
  fireEvent.change(author, {
    target: { value: 'testing of author' }
  })
  fireEvent.change(url, {
    target: { value: 'testing of url' }
  })
  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing of forms could be easier' )
  expect(createBlog.mock.calls[0][0].author).toBe('testing of author' )
  expect(createBlog.mock.calls[0][0].url).toBe('testing of url' )
})