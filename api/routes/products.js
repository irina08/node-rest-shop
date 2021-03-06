const express = require('express');
const router = express.Router();
//const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter  = (req, file, cb) => {
    //reject file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

//const upload = multer({dest: 'uploads/'});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const Product = require('../models/product');

// Handle incoming GET request to /orders
router.get('/', ProductsController.products_get_all);

router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create_product);

router.get('/:productID', checkAuth, ProductsController.products_get_product);

router.patch('/:productID', checkAuth, ProductsController.products_update_product);

router.delete('/:productID', checkAuth, ProductsController.products_delete_product);

module.exports = router;