const fs = require('fs');
const mongoose = require('mongoose');

////////////////////////////////////////////////////////////////
// Environment variables
const dotenv = require('dotenv');
dotenv.config({ path: './.env.development.local' });

////////////////////////////////////////////////////////////////
// Models
const Product = require('./../../models/productModel');

////////////////////////////////////////////////////////////////
// Connect to DB
const DB = process.env.DATABASE;

dbConnect().catch((err) => console.log(err));

async function dbConnect() {
  await mongoose.connect(DB);
  console.log('DB connection successful!');
}

////////////////////////////////////////////////////////////////
// Read JSON file
const products = JSON.parse(
  fs.readFileSync(`${__dirname}/products.json`, 'utf-8')
);

// Import DATA into DB
const importData = async () => {
  try {
    await Product.create(products);
    console.log('Data successfully loaded!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// Delete DATA from collection
const deleteData = async () => {
  try {
    await Product.deleteMany();
    console.log('Data successfully deleted!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
