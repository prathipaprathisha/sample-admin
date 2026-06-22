const bcrypt = require("bcryptjs");
const User = require("../models/User");

const seedAdminUser = async () => {
  try {
    const email = process.env.ADMIN_EMAIL || "admin@example.com";
    const password = process.env.ADMIN_PASSWORD || "admin123";
    const name = process.env.ADMIN_NAME || "Admin User";
    const role = process.env.ADMIN_ROLE || "admin";

    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log("Admin user already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const adminUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await adminUser.save();
    console.log(`Seeded admin user: ${email}`);
  } catch (error) {
    console.error("Failed to seed admin user:", error.message);
  }
};

module.exports = seedAdminUser;
