const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const slugify = require("slugify");

dotenv.config();

// Models
const User = require("../models/User");
const Category = require("../models/Category");
const Product = require("../models/Product");
const Review = require("../models/Review");
const Cart = require("../models/Cart");
const Order = require("../models/Order");

// ─────────────────────────────────────────────
// SEED DATA
// ─────────────────────────────────────────────

const users = [
  {
    name: "Admin",
    email: "admin@shoponline.com",
    password: "admin123",
    role: "admin",
    phone: "0901000001",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
  },
  {
    name: "Nguyễn Văn A",
    email: "nguyenvana@gmail.com",
    password: "user12345",
    role: "user",
    phone: "0901000002",
    address: "456 Lê Lợi, Quận 3, TP.HCM",
  },
  {
    name: "Trần Thị B",
    email: "tranthib@gmail.com",
    password: "user12345",
    role: "user",
    phone: "0901000003",
    address: "789 Trần Hưng Đạo, Quận 5, TP.HCM",
  },
  {
    name: "Lê Minh C",
    email: "leminhc@gmail.com",
    password: "user12345",
    role: "user",
    phone: "0901000004",
    address: "12 Phạm Ngũ Lão, Quận 1, TP.HCM",
  },
];

const categories = [
  {
    name: "Điện thoại",
    description: "Các loại điện thoại di động",
    isActive: true,
    children: [
      { name: "iPhone", description: "Điện thoại Apple iPhone", isActive: true },
      { name: "Samsung", description: "Điện thoại Samsung Galaxy", isActive: true },
    ],
  },
  {
    name: "Laptop",
    description: "Máy tính xách tay các loại",
    isActive: true,
    children: [
      { name: "MacBook", description: "Laptop Apple MacBook", isActive: true },
      { name: "Dell", description: "Laptop Dell", isActive: true },
    ],
  },
  {
    name: "Phụ kiện",
    description: "Phụ kiện điện tử",
    isActive: true,
    children: [
      { name: "Tai nghe", description: "Tai nghe các loại", isActive: true },
      { name: "Sạc & Cáp", description: "Bộ sạc và cáp kết nối", isActive: true },
    ],
  },
];

// Sản phẩm sẽ được gán categoryId sau khi tạo category
const productTemplates = [
  // ── iPhone ──
  {
    name: "iPhone 15 Pro Max",
    description: "iPhone 15 Pro Max 256GB, chip A17 Pro, camera 48MP, khung Titanium",
    price: 34990000,
    stock: 50,
    categorySlug: "iphone",
    sku: "IP15PM-256",
    images: [{ url: "https://placehold.co/600x400?text=iPhone+15+Pro+Max" }],
  },
  {
    name: "iPhone 15",
    description: "iPhone 15 128GB, chip A16 Bionic, Dynamic Island, camera 48MP",
    price: 22990000,
    stock: 80,
    categorySlug: "iphone",
    sku: "IP15-128",
    images: [{ url: "https://placehold.co/600x400?text=iPhone+15" }],
  },
  // ── Samsung ──
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "Galaxy S24 Ultra 256GB, chip Snapdragon 8 Gen 3, S-Pen, camera 200MP",
    price: 31990000,
    stock: 40,
    categorySlug: "samsung",
    sku: "SS-S24U-256",
    images: [{ url: "https://placehold.co/600x400?text=Galaxy+S24+Ultra" }],
  },
  {
    name: "Samsung Galaxy A55",
    description: "Galaxy A55 128GB, màn hình Super AMOLED 6.6 inch, pin 5000mAh",
    price: 9990000,
    stock: 120,
    categorySlug: "samsung",
    sku: "SS-A55-128",
    images: [{ url: "https://placehold.co/600x400?text=Galaxy+A55" }],
  },
  // ── MacBook ──
  {
    name: "MacBook Pro 14 M3 Pro",
    description: "MacBook Pro 14 inch, chip M3 Pro, RAM 18GB, SSD 512GB, Liquid Retina XDR",
    price: 49990000,
    stock: 25,
    categorySlug: "macbook",
    sku: "MBP14-M3P-512",
    images: [{ url: "https://placehold.co/600x400?text=MacBook+Pro+14" }],
  },
  {
    name: "MacBook Air 15 M3",
    description: "MacBook Air 15 inch, chip M3, RAM 8GB, SSD 256GB, siêu mỏng nhẹ",
    price: 32990000,
    stock: 35,
    categorySlug: "macbook",
    sku: "MBA15-M3-256",
    images: [{ url: "https://placehold.co/600x400?text=MacBook+Air+15" }],
  },
  // ── Dell ──
  {
    name: "Dell XPS 15",
    description: "Dell XPS 15, Intel Core i7-13700H, RAM 16GB, SSD 512GB, OLED 3.5K",
    price: 42990000,
    stock: 20,
    categorySlug: "dell",
    sku: "DELL-XPS15-512",
    images: [{ url: "https://placehold.co/600x400?text=Dell+XPS+15" }],
  },
  // ── Tai nghe ──
  {
    name: "AirPods Pro 2",
    description: "AirPods Pro thế hệ 2, chip H2, chống ồn chủ động, USB-C",
    price: 6490000,
    stock: 100,
    categorySlug: "tai-nghe",
    sku: "APP2-USBC",
    images: [{ url: "https://placehold.co/600x400?text=AirPods+Pro+2" }],
  },
  {
    name: "Sony WH-1000XM5",
    description: "Tai nghe chụp tai Sony WH-1000XM5, chống ồn hàng đầu, pin 30 giờ",
    price: 8490000,
    stock: 45,
    categorySlug: "tai-nghe",
    sku: "SONY-XM5",
    images: [{ url: "https://placehold.co/600x400?text=Sony+XM5" }],
  },
  // ── Sạc & Cáp ──
  {
    name: "Sạc Apple 20W USB-C",
    description: "Bộ sạc nhanh Apple 20W USB-C chính hãng",
    price: 590000,
    stock: 200,
    categorySlug: "sac-cap",
    sku: "APPLE-20W",
    images: [{ url: "https://placehold.co/600x400?text=Apple+Charger+20W" }],
  },
];

const reviewTemplates = [
  { rating: 5, comment: "Sản phẩm rất tuyệt vời, đáng đồng tiền!" },
  { rating: 4, comment: "Chất lượng tốt, giao hàng nhanh." },
  { rating: 5, comment: "Mình rất hài lòng, sẽ mua lại." },
  { rating: 3, comment: "Sản phẩm ổn, nhưng giá hơi cao." },
  { rating: 4, comment: "Dùng rất ok, pin trâu." },
];

// ─────────────────────────────────────────────
// SEED FUNCTION
// ─────────────────────────────────────────────

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected for Seeding");

    // 1️⃣ Clear all collections
    await Promise.all([
      User.deleteMany(),
      Category.deleteMany(),
      Product.deleteMany(),
      Review.deleteMany(),
      Cart.deleteMany(),
      Order.deleteMany(),
    ]);
    console.log("🗑️  Cleared all collections");

    // 2️⃣ Seed Users
    const createdUsers = await User.create(users);
    const adminUser = createdUsers[0];
    const normalUsers = createdUsers.slice(1);
    console.log(`👤 Created ${createdUsers.length} users`);

    // 3️⃣ Seed Categories (parent + children)
    const categoryMap = {}; // slug -> _id

    for (const cat of categories) {
      const parentSlug = slugify(cat.name, { lower: true, strict: true });
      const parent = await Category.create({
        name: cat.name,
        description: cat.description,
        slug: parentSlug,
        isActive: cat.isActive,
      });
      categoryMap[parentSlug] = parent._id;

      if (cat.children && cat.children.length > 0) {
        const childIds = [];
        for (const child of cat.children) {
          const childSlug = slugify(child.name, { lower: true, strict: true });
          const createdChild = await Category.create({
            name: child.name,
            description: child.description,
            slug: childSlug,
            parent: parent._id,
            isActive: child.isActive,
          });
          categoryMap[childSlug] = createdChild._id;
          childIds.push(createdChild._id);
        }
        // Cập nhật children array cho parent
        parent.children = childIds;
        await parent.save();
      }
    }
    const totalCats = Object.keys(categoryMap).length;
    console.log(`📂 Created ${totalCats} categories (${categories.length} parents + ${totalCats - categories.length} children)`);

    // 4️⃣ Seed Products
    const productsToCreate = productTemplates.map((p) => ({
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      category: categoryMap[p.categorySlug],
      sku: p.sku,
      slug: slugify(p.name, { lower: true, strict: true }),
      images: p.images,
    }));
    const createdProducts = await Product.create(productsToCreate);
    console.log(`📦 Created ${createdProducts.length} products`);

    // 5️⃣ Seed Reviews (mỗi user review vài sản phẩm)
    let reviewCount = 0;
    for (let i = 0; i < normalUsers.length; i++) {
      const user = normalUsers[i];
      // Mỗi user review 3 sản phẩm đầu tiên (tránh trùng)
      const productsToReview = createdProducts.slice(0, 3 + i).slice(i);
      for (let j = 0; j < productsToReview.length; j++) {
        const product = productsToReview[j];
        const tmpl = reviewTemplates[(i + j) % reviewTemplates.length];
        await Review.create({
          user: user._id,
          product: product._id,
          rating: tmpl.rating,
          comment: tmpl.comment,
        });
        reviewCount++;
      }
    }
    console.log(`⭐ Created ${reviewCount} reviews`);

    // 6️⃣ Seed Carts (cho 2 user đầu tiên)
    for (let i = 0; i < 2; i++) {
      const user = normalUsers[i];
      const cartItems = createdProducts.slice(i, i + 2).map((p) => ({
        product: p._id,
        quantity: i + 1,
      }));
      await Cart.create({ user: user._id, items: cartItems });
    }
    console.log("🛒 Created 2 carts");

    // 7️⃣ Seed Orders
    const orderItems1 = [
      { product: createdProducts[0]._id, quantity: 1, price: createdProducts[0].price },
      { product: createdProducts[7]._id, quantity: 2, price: createdProducts[7].price },
    ];
    const order1Total = orderItems1.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderItems2 = [
      { product: createdProducts[4]._id, quantity: 1, price: createdProducts[4].price },
    ];
    const order2Total = orderItems2.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderItems3 = [
      { product: createdProducts[2]._id, quantity: 1, price: createdProducts[2].price },
      { product: createdProducts[9]._id, quantity: 3, price: createdProducts[9].price },
    ];
    const order3Total = orderItems3.reduce((sum, item) => sum + item.price * item.quantity, 0);

    await Order.create([
      {
        user: normalUsers[0]._id,
        items: orderItems1,
        totalPrice: order1Total,
        status: "delivered",
        shippingAddress: normalUsers[0].address,
      },
      {
        user: normalUsers[1]._id,
        items: orderItems2,
        totalPrice: order2Total,
        status: "processing",
        shippingAddress: normalUsers[1].address,
      },
      {
        user: normalUsers[2]._id,
        items: orderItems3,
        totalPrice: order3Total,
        status: "pending",
        shippingAddress: normalUsers[2].address,
      },
    ]);
    console.log("📋 Created 3 orders");

    // ─── Summary ───
    console.log("\n════════════════════════════════════");
    console.log("✅ SEED COMPLETED SUCCESSFULLY!");
    console.log("════════════════════════════════════");
    console.log(`  👤 Users:      ${createdUsers.length}`);
    console.log(`  📂 Categories: ${totalCats}`);
    console.log(`  📦 Products:   ${createdProducts.length}`);
    console.log(`  ⭐ Reviews:    ${reviewCount}`);
    console.log(`  🛒 Carts:      2`);
    console.log(`  📋 Orders:     3`);
    console.log("════════════════════════════════════");
    console.log("\n📌 Admin login: admin@shoponline.com / admin123");
    console.log("📌 User login:  nguyenvana@gmail.com / user12345");
    console.log("════════════════════════════════════\n");

    process.exit();
  } catch (error) {
    console.error(`❌ Error with seeding data: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
};

seedData();
