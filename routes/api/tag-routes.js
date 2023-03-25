const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

router.get("/", async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const TagData = await Tag.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(TagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  Tag.findByPk(req.params.id, {
    include: [{ model: Product }],
  })
    .then((tag) => {
      res.json(tag);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

router.post("/", (req, res) => {
  // create a new tag
  Tag.create(req.body)
    .then((newTag) => {
      res.json(newTag);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.put("/:id", (req, res) => {
  // update a tag's name by its `id` value
  Tag.update(
    {
      tag_name: req.body.tag_name,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((updatedTag) => {
      if (updatedTag) {
        res.json({
          success: `Attempted to rename tag ${req.params.id} to '${req.body.tag_name}'.`,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

router.delete("/:id", (req, res) => {
  // delete on tag by its `id` value
  Tag.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((deletedTag) => {
      if (deletedTag) {
        res.json({
          success: `Attempted to delete tag ${req.params.id}.`,
        });
      }
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
