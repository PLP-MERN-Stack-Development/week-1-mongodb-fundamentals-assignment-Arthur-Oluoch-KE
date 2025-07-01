// Task 1: Basic Queries

// 1. Find all books in a specific genre 
db.books.find({ "genre": "Fiction" })

// 2. Find books published after a certain year 
db.books.find({ "published_year": { "$gt": 1950 } })

// 3. Find books by a specific author 
db.books.find({ "author": "George Orwell" })

// 4. Update the price of a specific book 
db.books.updateOne(
  { "title": "The Hobbit" },
  { "$set": { "price": 15.99 } }
)

// 5. Delete a book by its title 
db.books.deleteOne({ "title": "Animal Farm" })

// Task 3: Advanced Queries

// 1. Find books that are both in stock and published after 2010
db.books.find({
  "in_stock": true,
  "published_year": { "$gt": 2010 }
})

// 2. Use projection to return only title, author, and price fields
db.books.find(
  { "genre": "Fiction" },
  { "title": 1, "author": 1, "price": 1, "_id": 0 }
)

// 3. Sort books by price (ascending)
db.books.find().sort({ "price": 1 })

// 4. Sort books by price (descending)
db.books.find().sort({ "price": -1 })

// 5. Pagination: 5 books per page 
db.books.find().skip(0).limit(5)

// 6. Pagination: 5 books per page 
db.books.find().skip(5).limit(5)

// Task 4: Aggregation Pipelines

// 1. Calculate the average price of books by genre
db.books.aggregate([
  {
    "$group": {
      "_id": "$genre",
      "averagePrice": { "$avg": "$price" }
    }
  }
])

// 2. Find the author with the most books in the collection
db.books.aggregate([
  {
    "$group": {
      "_id": "$author",
      "bookCount": { "$sum": 1 }
    }
  },
  {
    "$sort": { "bookCount": -1 }
  },
  {
    "$limit": 1
  }
])

// 3. Group books by publication decade and count them
db.books.aggregate([
  {
    "$bucket": {
      "groupBy": "$published_year",
      "boundaries": [1800, 1810, 1820, 1830, 1840, 1850, 1860, 1870, 1880, 1890, 1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020],
      "default": "Other",
      "output": {
        "count": { "$sum": 1 },
        "titles": { "$push": "$title" }
      }
    }
  }
])

// Task 5: Indexing

// 1. Create an index on the title field
db.books.createIndex({ "title": 1 })

// 2. Create a compound index on author and published_year
db.books.createIndex({ "author": 1, "published_year": 1 })

// 3. Use explain() to demonstrate performance improvement
// Explain query without index (run before creating indexes)
db.books.find({ "title": "The Hobbit" }).explain("executionStats")

// Explain query with index (run after creating title index)
db.books.find({ "title": "The Hobbit" }).explain("executionStats")

// Explain query for compound index
db.books.find({ "author": "George Orwell", "published_year": 1949 }).explain("executionStats")