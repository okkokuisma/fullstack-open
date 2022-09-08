const express = require('express');
const router = express.Router();
const redis = require('../redis')

router.get('/', async (req, res) => {
  const todoCounter = await redis.getAsync('added_todos')
  if (!todoCounter) {
    return res.status(200).json({ added_todos: 0 })
  }
  return res.status(200).json({ added_todos: todoCounter })
})

module.exports = router