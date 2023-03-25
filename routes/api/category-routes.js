const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

router.get("/", async (req, res) => {
  try {
    const CategoryData = await Category.findAll({
      // this `include` key tells sequelize, literally, to include these models in the result
      include: [{ model: Product }],
    });
    res.status(200).json(CategoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", (req, res) => {
  // get the category matching :id
  Category.findByPk(req.params.id, {
    include: [{ model: Product }],
  })
    .then((category) => {
      res.json(category);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

router.post("/", (req, res) => {
  // create a new category
  Category.create(req.body)
    .then((newCategory) => {
      res.json(newCategory);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.put("/:id", (req, res) => {
  // update a category by its `id` value
  Category.update(
    {
      category_name: req.body.category_name,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((updatedCategory) => {
      if (updatedCategory) {
        res.json({
          success: `Attempted to rename category ${req.params.id} to '${req.body.category_name}'.`,
        });
      } else {
        res.json({
          failure: `Category does not exist or was not renamed.`,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

router.delete("/:id", (req, res) => {
  // delete a category by its `id` value
  Category.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((deletedCategory) => {
      if (deletedCategory) {
        res.json({
          success: `Attempted to delete category ${req.params.id}.`,
        });
      }
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
