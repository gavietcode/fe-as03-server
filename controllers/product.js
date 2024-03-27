import Product from "../models/Product.js";

export const postAddProduct = async (req, res, next) => {
  const product = new Product({
    name: req.body.name,
    category: req.body.category,
    img1: req.body.img1,
    long_desc: req.body.long_desc,
    short_desc: req.body.long_desc,
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedName = req.body.name;
  const updatedCategory = req.body.category;
  const updatedImg1 = req.body.img1;
  const updatedLongDesc = req.body.long_desc;
  const updatedShortDesc = req.body.short_desc;

  Product.findById(prodId)
    .then((product) => {
      product.name = updatedName;
      product.category = updatedCategory;
      product.img1 = updatedImg1;
      product.long_desc = updatedLongDesc;
      product.short_desc = updatedShortDesc;
      return product.save();
    })
    .then((result) => {
      console.log("UPDATED PRODUCT!");
    })
    .catch((err) => console.log(err));
};

export const getAllProduct = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).send(products);
  } catch (err) {
    next(err);
  }
};

export const getProductDetail = async (req, res, next) => {
  try {
    const id = req.params.id;
    const detail = await Product.findById(id);
    if (detail != null) {
      res.json(detail);
    } else {
      res.send({ message: "Product not found!." });
    }
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  const productId = req.params.id;
  const { name, category, long_desc, short_desc, img1 } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { name, category, long_desc, short_desc, img1 },
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted!.");
  } catch (err) {
    next(err);
  }
};
