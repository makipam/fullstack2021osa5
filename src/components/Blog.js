import React, { useState } from 'react'
const Blog = ({ blog, user, updateLikes, removeBlog }) => {
  const [visible, setVisible] = useState(false)

  const handleClick = () => {
    setVisible(!visible)
  }

  const ShowLess = () => (
    <div>
      {blog.title} by {blog.author} <button id={blog.title} onClick={handleClick}>View</button>
    </div>
  )

  const ShowAll = () => (
    <div className="blog">
      {blog.title} by {blog.author} <button id="hide" onClick={handleClick}>Hide</button>
      <div>URL: {blog.url}</div>
      <div>likes: {blog.likes} <button id="like" onClick={updateLikes}>like</button></div>
      <div>Added by: {blog.user.name}</div>
      {user.username === blog.user.username ?
        <button id="like" onClick={removeBlog}>Remove</button> : <div></div>}
    </div>
  )
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  return (
    <div style={blogStyle}>
      <div>
        {visible ? ShowAll() : ShowLess()}
      </div>
    </div>
  )
}

export default Blog