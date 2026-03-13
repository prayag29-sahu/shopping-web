import { Product, Admin } from '../models/Schema.js';

export const fetchProducts = async (req, res) => {
  try {
    const { category, size, color, brand, minPrice, maxPrice, featured, trending } = req.query;
    const filter = {};
    if (category)  filter.category = category;
    if (size)      filter.sizes    = { $in: [size] };
    if (color)     filter.colors   = { $in: [color] };
    if (brand)     filter.brand    = brand;
    if (featured)  filter.isFeatured = true;
    if (trending)  filter.isTrending = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
};

export const fetchProductDetails = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching product', error: err.message });
  }
};

export const fetchCategories = async (req, res) => {
  try {
    let admin = await Admin.findOne();
    if (!admin) {
      admin = new Admin({ categories: ['Men', 'Women', 'Boys', 'Girls', 'Kids'] });
      await admin.save();
    }
    res.json(admin.categories);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching categories', error: err.message });
  }
};

export const addNewProduct = async (req, res) => {
  try {
    if (req.user.usertype !== 'admin') return res.status(403).json({ message: 'Admins only' });
    const product = new Product(req.body);
    await product.save();
    res.json({ message: 'Product added!' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding product', error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    if (req.user.usertype !== 'admin') return res.status(403).json({ message: 'Admins only' });
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated!' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating product', error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    if (req.user.usertype !== 'admin') return res.status(403).json({ message: 'Admins only' });
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted!' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product', error: err.message });
  }
};
