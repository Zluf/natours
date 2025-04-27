# Natours

Back-end driven app that serves info on travel tours

## Technologies

- Node.js
- Express.js
- MongoDB (NoSQL):
  - Compass (GUI)
  - Atlas (database)
  - Mongoose (object data modeling library)

## MVC Design Pattern

Model - business logic
View - presentation logic
Controller - application logic

## Mongoose notes

- Model methods - for manipulating documents (entries / objects)
  .create()
  .save()
  .findByIdAndUpdate()
  .findByIdAndDelete()

- Query methods - for retrieval
  .find()
  .findOne()
  .findById()
  .sort()
  .limit()

- Mixed - retrieve and manipulate
  .updateMany()
  .deleteMany()
