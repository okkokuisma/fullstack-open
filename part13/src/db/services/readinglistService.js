const { ReadinglistEntry } = require('../dbInit')

const create = async (values) => {
  return await ReadinglistEntry.create(values)
}

const findById = async (id) => {
  const entry = await ReadinglistEntry.findByPk(id)

  if (!entry) {
    const error = new Error('No reading list entries found with the given id')
    error.name = 'ReadingListEntryNotFoundError'
    throw error
  }

  return entry
}

const markRead = async (entry) => {
  entry.read = true
  return await entry.save()
}

module.exports = { create, findById, markRead }