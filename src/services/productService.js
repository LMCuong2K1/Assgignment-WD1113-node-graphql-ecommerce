const Product = require("../models/Product");
const AppError = require("../utils/AppError");

class ProductService {
    createProduct = async (body) => {
        const product = await Product.create(body);
        return product.populate('category', 'name');
    }
    findAllProducts = async (query, selectFields = "") => {
        let { search, category, minPrice, maxPrice, sort, page = 1, limit = 10 } = query;
        const allowSorts = ["name", "-name", "price", "-price", "createdAt", "-createdAt", "rating", "-rating"];
        if (sort && !allowSorts.includes(sort)) sort = undefined;
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
        return { products, count, totalPages: Math.ceil(count / Number(limit)), page: Number(page), limit: Number(limit) };

    }
    findProductById = async (id, selectFields = "") => {
        const product = await Product.findOne({ _id: id, isActive: true }).select(selectFields);
        if (!product) throw new AppError("Product is not exist!", 404);
        return product.populate('category', 'name');
    }
    updateProduct = async (id, body) => {
        const product = await Product.findOne({ _id: id, isActive: true });
        if (!product) throw new AppError("Product is not exist!", 404);

        if (body.name || body.sku) {
            const conditions = [];
            if (body.name) conditions.push({ name: body.name });
            if (body.sku) conditions.push({ sku: body.sku });
            const duplicate = await Product.findOne({ _id: { $ne: id }, $or: conditions, isActive: true });
            if (duplicate) throw new AppError("Name or SKU is already exists!", 409);
        }
        Object.assign(product, body);
        const saveProduct = await product.save();
        return saveProduct.populate('category', 'name');
    }
    deleteProduct = async (id) => {
        const product = await Product.findOne({ _id: id, isActive: true });
        if (!product) throw new AppError("Không tìm thấy Product!", 404);
        await product.updateOne({ isActive: false });
    }
}
module.exports = new ProductService();