const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

// gets all products
router.get("/", async (req, res) => {
  try {
    const ProductData = await Product.findAll({
      include: [{ model: Category }, { model: Tag }],
    });
    res.status(200).json(ProductData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
router.get("/:id", (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  Product.findByPk(req.params.id, {
    include: [{ model: Category }, { model: Tag }],
  })
    .then((Product) => {
      res.json(Product);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

// create new product
router.post("/", (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tag_ids: [1, 2, 3, 4]
    }
  */
  Product.create(req.body).then((product) => {
    // if there's product tags, we need to create pairings to bulk create in the ProductTag model
    if (req.body.tag_ids.length) {
      const productTagIdArr = req.body.tag_ids.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      ProductTag.bulkCreate(productTagIdArr)
        .then((productTagIds) => {
          product.tags = productTagIds;
          res.status(200).json({ product, tags: productTagIds });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json(err);
        });
    } else {
      // if no product tags, just respond
      res.status(200).json(product);
    }
  });
});

// update product
router.put("/:id", (req, res) => {
  // update product data
  Product.update(
    {
      product_name: req.body.product_name,
      price: req.body.price,
      stock: req.body.stock,
      category_id: req.body.category_id,
      tag_ids: req.body.tag_ids,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tag_ids
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tag_ids.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.delete("/:id", (req, res) => {
  // delete one product by its `id` value
  Product.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((deletedProduct) => {
      if (deletedProduct) {
        res.json({
          success: `Attempted to delete product ${req.params.id}.`,
        });
      } else {
        res.json({
          failure: `Attempted to delete product ${req.params.id}, but it doesn't.`,
        });
      }
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
