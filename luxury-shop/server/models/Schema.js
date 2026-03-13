import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  usertype: { type: String, enum: ['customer', 'admin'], default: 'customer' }
}, { timestamps: true });

const adminSchema = new mongoose.Schema({
  banner:     { type: String, default: '' },
  categories: { type: [String], default: ['Men', 'Women', 'Boys', 'Girls', 'Kids'] }
});

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String, required: true },
  category:    { type: String, enum: ['Men', 'Women', 'Boys', 'Girls', 'Kids'], required: true },
  brand:       { type: String, default: 'VELOUR' },
  sizes:       { type: [String], default: ['S', 'M', 'L', 'XL'] },
  colors:      { type: [String], default: [] },
  price:       { type: Number, required: true },
  discount:    { type: Number, default: 0 },
  stock:       { type: Number, default: 100 },
  mainImg:     { type: String, required: true },
  images:      { type: [String], default: [] },
  rating:      { type: Number, default: 4.2 },
  isFeatured:  { type: Boolean, default: false },
  isTrending:  { type: Boolean, default: false }
}, { timestamps: true });

const orderSchema = new mongoose.Schema({
  userId:        { type: String, required: true },
  name:          { type: String },
  email:         { type: String },
  mobile:        { type: String },
  address:       { type: String },
  pincode:       { type: String },
  productId:     { type: String },
  title:         { type: String },
  mainImg:       { type: String },
  size:          { type: String },
  color:         { type: String },
  quantity:      { type: Number, default: 1 },
  price:         { type: Number },
  discount:      { type: Number, default: 0 },
  paymentMethod: { type: String },
  orderDate:     { type: String },
  orderStatus:   { type: String, default: 'Order Placed' }
}, { timestamps: true });

const cartSchema = new mongoose.Schema({
  userId:   { type: String, required: true },
  productId:{ type: String },
  title:    { type: String },
  mainImg:  { type: String },
  size:     { type: String },
  color:    { type: String },
  quantity: { type: Number, default: 1 },
  price:    { type: Number },
  discount: { type: Number, default: 0 }
}, { timestamps: true });

export const User    = mongoose.model('users',    userSchema);
export const Admin   = mongoose.model('admin',    adminSchema);
export const Product = mongoose.model('products', productSchema);
export const Orders  = mongoose.model('orders',   orderSchema);
export const Cart    = mongoose.model('cart',     cartSchema);
