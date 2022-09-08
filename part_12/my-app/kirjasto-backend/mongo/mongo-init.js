db.createUser({
  user: 'the_username',
  pwd: 'the_password',
  roles: [
    {
      role: 'dbOwner',
      db: 'the_database',
    },
  ],
});

db.createCollection('authors');
db.createCollection('books');
db.createCollection('users');

db.authors.insert({ name: 'Matti Meikäläinen', born: 1989 });