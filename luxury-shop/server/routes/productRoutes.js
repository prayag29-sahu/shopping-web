import express from 'express';
import { fetchProducts, fetchProductDetails, fetchCategories, addNewProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/fetch-products',                fetchProducts);
router.get('/fetch-product-details/:id',     fetchProductDetails);
router.get('/fetch-categories',              fetchCategories);
router.post('/add-new-product',   protect,   addNewProduct);
router.put('/update-product/:id', protect,   updateProduct);
router.delete('/delete-product/:id', protect, deleteProduct);

export default router;
