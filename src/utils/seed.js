const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding');

    // Implement your seeding logic here (e.g., clear DB, insert users, categories, products)
    
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error with seeding data: ${error}`);
    process.exit(1);
  }
};

seedData();
