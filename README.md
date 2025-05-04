# Natours

Back-end driven app that serves info on travel tours

## Technologies

- **Node**.js
- **Express**.js
- **MongoDB** (NoSQL):
  - **Compass** (GUI)
  - **Atlas** (database)
  - **Mongoose** (object data modeling library)

## MVC Design Pattern

**Model** - business logic
**View** - presentation logic
**Controller** - application logic

## Mongoose notes

1. A _Schema_ is created
2. A _Model_ is created based on a Schema
3. A _Collection_ in DB is created once .create() is used with the Model

- **Model methods** - for manipulating documents (entries / objects)
  .create()
  .save()
  .findByIdAndUpdate()
  .findByIdAndDelete()

- **Query methods** - for retrieval
  .find()
  .findOne()
  .findById()
  .sort()
  .limit()

- Mixed (still Query tho) - retrieve and manipulate
  .updateMany()
  .deleteMany()

- **Aggregation Pipeline** (Model.agregate()) - matching, sorting and calculations of data

- **Virtual Properties** - business logic in Model layer

- **Document/Query Middleware** - runs before (.pre()) and after (.post()) main Model & Query methods (find, create etc.)
- **Aggregation Middleware** - runs before (.pre()) and after (.post()) aggration pipelines

## Terminology notes

- **Operational Errors** - errors that the user will likely encounter
- **Programming Errors** - errors at development process
