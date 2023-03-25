# E-commerce Back End Starter Code

## Setup and Usage

Seed the database by running the following command in the root directory.

`npm run seed`

Run the server using the following command.

`node server.js`

Creates the following routes:

### Categories

- /categories

  - GET: Returns all categories.
  - POST: Creates a new category.
    - `category_name` required

- /categories/:id
  - GET: Returns the category matching :id.
  - PUT: Updates the category matching :id.
    - `category_name`
  - DELETE: Deletes the category matching :id.

### Products

- /products

  - GET: Returns all products, including their categories and tags.
  - POST: Creates a new product.
    - `product_name` required
    - `price` required
    - `stock` required
    - `category_id`
    - `tag_ids`

- /products/:id

  - GET: Returns the product matching :id.
  - PUT: Updates the product matching :id.
    - `product_name`
    - `price`
    - `stock`
    - `category_id`
    - `tag_ids`
  - DELETE: Deletes the product matching :id.

- /tags

  - GET: Returns all tags.
  - POST: Creates a new tag.
    - `tag_name` required

- /tags/:id
  - GET: Returns the tag matching :id.
  - PUT: Updates the tag matching :id.
    - `tag_name`
  - DELETE: Deletes the tag matching :id.
