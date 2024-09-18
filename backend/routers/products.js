const { Category } = require("../models/category");
const { Product } = require("../models/product");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png", // MIME(Multipurpose Internet Mail Extension) type
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("Invalid image type");

    if (isValid) {
      uploadError = null;
    }

    cb(uploadError, "D:/React prjects/ShopEase/backend/public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype]; // it goto FILE_TYPE_MAP and check MIME type which one of those
    // and assign the extension as a value
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

router.post(`/`, uploadOptions.single("image"), async (req, res) => {
  // 'image' is field name where send image from frontend
  // Validate if category ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(req.body.category)) {
    console.log("Invalid Category ID: ", req.body.category);
    return res.status(400).send("Invalid category ID");
  }
  // Find the category by ID
  const category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(400).send("Invalid category");
  }

  const file = req.file;
  if (!file) {
    return res.status(400).send("No image");
  }
  const fileName = req.file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/upload`;

  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: `${basePath}${fileName}`,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });

  product = await product.save();
  if (!product) {
    return res.status(500).send("product cannot be created");
  }
  res.send(product);
});

// router.get(`/`, async (req, res) => {
//   const productList = await Product.find().select("name image");

//   if (!productList) {
//     res.status(500).json({ success: false });
//   }
//   res.send(productList);
// });

router.get(`/`, async (req, res) => {
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }
  const productList = await Product.find(filter).populate("category");

  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
});

router.get(`/:id`, async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");

  if (!product) {
    res.status(500).json({ success: false });
  }
  res.send(product);
});

router.put(`/:id`, uploadOptions.single("image"), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send("Invalid product id");
  }
  const category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(400).send("Invalid category");
  }

  const productFind = await Product.findById(req.params.id);
  if (!productFind) {
    return res.status(400).send("Invalid product");
  }

  const file = req.file;
  let imagePath;
  if (file) {
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/upload`;
    imagePath = `${basePath}${fileName}`;
  } else {
    imagePath = productFind.image;
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: imagePath,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  );
  if (!product) {
    return res.status(400).send("product not updated");
  }
  res.send(product);
});

router.delete(`/:id`, (req, res) => {
  Product.findByIdAndDelete(req.params.id)
    .then((product) => {
      if (product) {
        return res
          .status(200)
          .json({ success: true, message: "product is deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "product not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

router.get(`/get/count`, async (req, res) => {
  const productCount = await Product.countDocuments();
  if (!productCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    productCount: productCount,
  });
});

router.get(`/get/featured/:count`, async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const products = await Product.find({ isFeatured: true }).limit(+count);
  if (!products) {
    res.status(500).json({ success: false });
  }
  res.send(products);
});

module.exports = router;
