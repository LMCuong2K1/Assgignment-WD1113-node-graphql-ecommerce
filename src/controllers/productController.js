const productService = require("../services/productService");

class ProductController {
    createProduct = async (req, res) => {
        try {
            const product = await productService.createProduct(req.body);
            return res.status(201).json({
                success: true,
                data: product
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    getProducts = async (req, res) => {
        try {
            const { products, count } = await productService.findAllProducts(req.query);
            return res.status(200).json({
                success: true,
                count,
                data: products
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    getProductById = async (req, res) => {
        try {
            const product = await productService.findProductById(req.params.id);
            return res.status(200).json({
                success: true,
                data: product
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    updateProduct = async (req, res) => {
        try {
            const product = await productService.updateProduct(req.params.id, req.body);
            return res.status(200).json({
                success: true,
                data: product
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    deleteProduct = async (req, res) => {
        try {
            await productService.deleteProduct(req.params.id);
            return res.status(200).json({
                success: true,
                message: "Xóa sản phẩm thành công"
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new ProductController();