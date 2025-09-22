 const productModel = require("../models/product.model");
const { uploadImage } = require("../services/Storage.service");

async function createProduct(req, res) {
  try {
    const { title, description, priceAmount, priceCurrency = "INR" } = req.body;

    if (!title || !priceAmount) {
      return res
        .status(400)
        .json({ message: "title and priceAmount is required" });
    }

    const seller = req.user.id; // Extract seller from authenticated user

    const price = {
      amount: Number(priceAmount),
      currency: priceCurrency,
    };

    const images = await Promise.all(
      (req.files || []).map((file) => uploadImage({ buffer: file.buffer }))
    );

    const product = await productModel.create({
      title,
      description,
      price,
      seller,
      images,
    });

    return res.status(201).json({
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Create Product Error: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  createProduct,
};
 