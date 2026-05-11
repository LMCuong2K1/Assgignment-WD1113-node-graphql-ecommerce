const Product = require("../models/Product");

class ProductService {
    createProduct = async (body) => {
        const product = await Product.create(body);
        return product.populate('category', 'name');
    }
    findAllProducts = async (query, selectFields = "") => {
        const { search, category, minPrice, maxPrice, sort, page = 1, limit = 10 } = query;
        const filter = { isActive: true };
        if (category) filter.category = category;
        //giá
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        //biểu thức chính quy
        if (search) filter.name = { $regex: search, $options: "i" };
        const skip = (Number(page) - 1) * Number(limit);
        const products = await Product.find(filter).select(selectFields).populate('category', 'name').sort(sort).skip(skip).limit(limit);
        const count = await Product.countDocuments(filter);
        return { products, count };

    }
    findProductById = async (id, selectFields = "") => {
        const product = await Product.findOne({ _id: id, isActive: true }).select(selectFields);
        if (!product) throw new Error("Product is not exist!");
        return product.populate('category', 'name');
    }
    updateProduct = async (id, body) => {
        const product = await Product.findOne({ _id: id, isActive: true });
        if (!product) throw new Error("Product is not exist!");

        // if (body.name) {
        //     let existProduct = await Product.findOne({ name: body.name, isActive: true });
        //     if (existProduct && existProduct._id.toString() !== id) throw new Error("Tên Product đã tồn tại!");
        // }
        // if (body.sku) {
        //     let existProduct = await Product.findOne({ sku: body.sku, isActive: true });
        //     if (existProduct && existProduct._id.toString() !== id) throw new Error("SKU Product đã tồn tại!");
        // }

        if (body.name || body.sku) {
            const conditions = [];
            if (body.name) conditions.push({ name: body.name });
            if (body.sku) conditions.push({ sku: body.sku });
            const duplicate = await Product.findOne({ _id: { $ne: id }, $or: conditions, isActive: true });
            if (duplicate) throw new Error("Name or SKU is already exists!");
        }
        Object.assign(product, body);
        const saveProduct = await product.save();
        return saveProduct.populate('category', 'name');
    }
    deleteProduct = async (id) => {
        const product = await Product.findOne({ _id: id, isActive: true });
        if (!product) throw new Error("Không tìm thấy Product!");
        await product.updateOne({ isActive: false });
    }
}
module.exports = new ProductService();