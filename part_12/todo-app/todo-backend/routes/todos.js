const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const redis = require('../redis')

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  const todoCounter = await redis.getAsync('added_todos')
  todoCounter
    ? await redis.setAsync('added_todos', Number(todoCounter) + 1)
    : await redis.setAsync('added_todos', 1)
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.status(200).send(req.todo);
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  try {
    req.todo.done = req.body.done
    await req.todo.save()
    // res.send(req.todo);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(400);
  }
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
