
require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

const PORT = process.env.PORT || 5000;

async function ensureAdminUser() {
  await User.updateMany({ role: "admin" }, { $set: { role: "super_admin" } });
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "WebVerse Admin";

  if (!email || !password) {
    console.warn(
      "ADMIN_EMAIL and ADMIN_PASSWORD are not configured; no admin account was created."
    );
    return;
  }

  if (password.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters");
  }

  const existingAdmin = await User.findOne({ email }).select("+password");
  const passwordHash = await bcrypt.hash(password, 12);

  if (!existingAdmin) {
    await User.create({
      name,
      email,
      password: passwordHash,
      role: "super_admin",
    });
    console.log(`Admin account provisioned for ${email}`);
    return;
  }

  const passwordChanged = !(await bcrypt.compare(password, existingAdmin.password));
  const nameChanged = existingAdmin.name !== name;
  const roleChanged = existingAdmin.role !== "super_admin";

  if (passwordChanged || nameChanged || roleChanged) {
    existingAdmin.name = name;
    existingAdmin.password = passwordHash;
    existingAdmin.role = "super_admin";
    await existingAdmin.save();
    console.log(`Admin account synchronized for ${email}`);
  }
}

async function startServer() {
  try {
    await connectDB();
    await ensureAdminUser();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`WebVerse backend running at http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("Failed to start WebVerse backend:", error.message);
    process.exit(1);
  }
}

startServer();
