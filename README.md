## MongoDB Book Collection Operations
This README provides instructions for running a MongoDB script containing basic queries, advanced queries, aggregation pipelines, and indexing operations on a book collection using MongoDB Compass. The script operates on a dataset of books stored in a MongoDB Atlas database.
Prerequisites

## MongoDB Atlas Account:

Sign up at MongoDB Atlas.
Create a cluster and ensure it’s active (e.g., a free-tier M0 cluster).
Whitelist your IP address in Network Access (e.g., 0.0.0.0/0 for testing, but secure it later).
Create a database user with readWrite privileges in Database Access.


MongoDB Compass:

Download and install MongoDB Compass (latest version recommended).
Ensure Compass is connected to your Atlas cluster using the connection string from Atlas (format: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>).


Book Dataset:

The script assumes a collection named books in a database (e.g., myDatabase) with the provided book dataset (12 documents with fields like title, author, genre, published_year, etc.).
If not already inserted, import the dataset using Compass:
Save the JSON dataset to a file (e.g., books.json).
In Compass, navigate to the books collection, click Add Data > Import File, select books.json, and import.

## Setup

## Connect to Atlas in Compass:

Open MongoDB Compass.
Paste your Atlas connection string into the New Connection field.
Replace <username> and <password> with your Atlas database user credentials.
Optionally, specify the database name (e.g., myDatabase) in the connection string.
Click Connect.


Verify the Collection:

In Compass, expand your database in the left sidebar and select the books collection.
Ensure the collection contains the expected book documents (e.g., "To Kill a Mockingbird", "1984").

## Running the Script in MongoDB Compass
The script (book_operations.js) contains queries for basic CRUD operations, advanced queries, aggregations, and indexing. Since Compass doesn’t directly execute JavaScript files, you’ll run each query individually in the appropriate Compass tabs.
Step 1: Basic Queries (Task 1)
These queries perform CRUD operations on the books collection.

## Find Books by Genre (Fiction):

In the books collection view, go to the Filter field.
Enter: { "genre": "Fiction" }
Click Find. Expected: 5 books (e.g., "To Kill a Mockingbird", "The Great Gatsby").


## Find Books Published After 1950:

In the Filter field, enter: { "published_year": { "$gt": 1950 } }
Click Find. Expected: 3 books (e.g., "The Catcher in the Rye", "The Lord of the Rings").


## Find Books by Author (George Orwell):

In the Filter field, enter: { "author": "George Orwell" }
Click Find. Expected: 2 books ("1984", "Animal Farm").


## Update Price of a Book (The Hobbit):

Go to the Documents tab, find "The Hobbit", and click the Edit icon (pencil).
Alternatively, use the Query Bar:
Filter: { "title": "The Hobbit" }
Update: { "$set": { "price": 15.99 } }
Click Update (requires MongoDB shell or programmatic execution; in Compass, manual editing is easier).


## Verify the price updates to $15.99.


Delete a Book (Animal Farm):

Find "Animal Farm" in the collection, click the Delete icon (trash can), and confirm.
Alternatively, use the MongoDB shell to run: db.books.deleteOne({ "title": "Animal Farm" }).
Verify the book is removed.

## Step 2: Advanced Queries (Task 3)
These queries include filtering, projection, sorting, and pagination.

Find Books In Stock and Published After 2010:

In the Filter field, enter: { "in_stock": true, "published_year": { "$gt": 2010 } }
Click Find. Expected: No books (none meet both criteria).


Projection (Title, Author, Price):

In the Filter field, enter: { "genre": "Fiction" }
In the Projection field, enter: { "title": 1, "author": 1, "price": 1, "_id": 0 }
Click Find. Expected: 5 books with only title, author, and price fields.


## Sort by Price (Ascending):

In the Sort field, enter: { "price": 1 }
Click Find. Expected: Books sorted from lowest price ("Pride and Prejudice" at $7.99) to highest.


Sort by Price (Descending):

In the Sort field, enter: { "price": -1 }
Click Find. Expected: Books sorted from highest price ("The Lord of the Rings" at $19.99) to lowest.


Pagination (5 Books per Page):

For page 1:
In the Skip field, enter: 0
In the Limit field, enter: 5
Click Find. Expected: First 5 books.


For page 2:
In the Skip field, enter: 5
In the Limit field, enter: 5
Click Find. Expected: Next 5 books.


## Step 3: Aggregation Pipelines (Task 4)
Use the Aggregation tab in Compass to run these pipelines.

Average Price by Genre:

Go to the Aggregation tab in the books collection.
Add a stage: $group
Enter: { "_id": "$genre", "averagePrice": { "$avg": "$price" } }
Run the pipeline. Expected: Average prices (e.g., Fiction ~$10.49, Fantasy ~$17.49).


Author with Most Books:

In the Aggregation tab, add three stages:
Stage 1: $group, { "_id": "$author", "bookCount": { "$sum": 1 } }
Stage 2: $sort, { "bookCount": -1 }
Stage 3: $limit, 1


Run the pipeline. Expected: J.R.R. Tolkien (2 books).


Group by Publication Decade:

In the Aggregation tab, add a $bucket stage:{
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


## Run the pipeline. Expected: Counts by decade (e.g., 1810s: 1 book, 1840s: 2 books, 1930s: 2 books).

Step 4: Indexing (Task 5)

Create Index on Title:

Go to the Indexes tab in the books collection.
Click Create Index.
Enter: { "title": 1 }
Click Create. Expected: Index created for faster title searches.


Create Compound Index on Author and Published Year:

In the Indexes tab, click Create Index.
Enter: { "author": 1, "published_year": 1 }
Click Create. Expected: Compound index created.


## Analyze Performance with Explain:

Compass doesn’t directly support explain() in the UI, but you can use the Explain Plan tab:
Go to the Documents tab, enter: { "title": "The Hobbit" } in the Filter field.
Click Explain (top-right). Note the execution stats (e.g., totalDocsExamined).
Repeat after creating the title index. Expected: Fewer documents scanned (e.g., 1 vs. entire collection).
For the compound index, filter: { "author": "George Orwell", "published_year": 1949 } and check Explain. Expected: Index used, reducing scan time.


Alternatively, run explain() in the MongoDB shell:
Connect to your Atlas cluster using the shell.
Run: db.books.find({ "title": "The Hobbit" }).explain("executionStats") before and after indexing.
Run: db.books.find({ "author": "George Orwell", "published_year": 1949 }).explain("executionStats").


## Troubleshooting

Connection Issues:
Ensure your IP is whitelisted in Atlas (Network Access).
Verify your connection string and database user credentials.


Invalid Query Errors:
Check JSON syntax in Compass (e.g., use double quotes, no trailing commas).
Validate queries in an online JSON validator if needed.


No Data Returned:
Confirm the books collection exists and contains the dataset.
Re-import the dataset if necessary.


Aggregation Errors:
Ensure stages are entered correctly in the Aggregation tab.
Check field names match the dataset (e.g., published_year, not year).


Index Creation Fails:
Ensure your Atlas user has sufficient permissions.
Check for duplicate indexes in the Indexes tab.

## Expected Results

Basic Queries:
Fiction genre: 5 books.
Published after 1950: 3 books.
George Orwell: 2 books.
Update: "The Hobbit" price set to $15.99.
Delete: "Animal Farm" removed.


Advanced Queries:
In stock and after 2010: 0 books.
Projection: 5 Fiction books with title, author, price.
Sorting: Books ordered by price (ascending/descending).
Pagination: 5 books per page (12 books total, 3 pages).


Aggregations:
Average price: e.g., Fiction ~$10.49, Fantasy ~$17.49.
Most books: J.R.R. Tolkien (2 books).
Decade counts: e.g., 1810s (1), 1840s (2), 1930s (2).


Indexes:
Title index: Speeds up title searches.
Compound index: Optimizes author and published_year queries.
Explain: Shows reduced totalDocsExamined with indexes.

## Additional Notes

Use the latest version of MongoDB Compass for optimal performance.
For programmatic execution or explain(), consider using the MongoDB shell or a driver (e.g., Node.js, Python).
Back up your data before running updateOne or deleteOne operations.
For further assistance, refer to MongoDB Compass Docs or MongoDB Atlas Docs.
