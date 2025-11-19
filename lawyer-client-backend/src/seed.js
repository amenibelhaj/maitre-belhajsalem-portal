const bcrypt = require("bcryptjs");
const User = require("./models/User");  
const sequelize = require("./config/db");

async function seed() {
  try {
    await sequelize.sync({ force: true });

    const hashedPassword = await bcrypt.hash("password123", 10);

    await User.create({
      name: "Ameni Belhaj",
      email: "ameni@example.com",
      password: hashedPassword,
      role: "lawyer",
    });

    console.log("✅ Seed data inserted successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
