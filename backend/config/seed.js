const bcrypt = require("bcryptjs");
const User = require("../models/User");

const seedAdminUser = async () => {
  try {
    const email = process.env.ADMIN_EMAIL || "admin@example.com";
    const password = process.env.ADMIN_PASSWORD || "admin123";
    const name = process.env.ADMIN_NAME || "Admin User";
    const role = process.env.ADMIN_ROLE || "admin";

    const hashedPassword = await bcrypt.hash(password, 10);
    let adminUser = await User.findOne({ email });
    
    if (adminUser) {
      // Reset existing admin password
      adminUser.password = hashedPassword;
      adminUser.resetPasswordOtp = undefined;
      adminUser.resetPasswordOtpExpires = undefined;
      await adminUser.save();
      console.log(`Reset admin user password: ${email}`);
      return;
    }

    adminUser = new User({
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
