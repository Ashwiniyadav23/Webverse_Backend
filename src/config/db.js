
const mongoose = require("mongoose");

let connectionPromise;

mongoose.connection.on("disconnected", () => {
  connectionPromise = undefined;
});

function positiveIntegerFromEnv(name, fallback) {
  const value = Number(process.env[name]);
  return Number.isInteger(value) && value > 0 ? value : fallback;
}

async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing from the .env file");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS) || 10000,
      // Vercel may run many instances at once. Keep the pool bounded per instance
      // so horizontal scaling does not multiply MongoDB's default 100 sockets.
      maxPoolSize: positiveIntegerFromEnv("MONGODB_MAX_POOL_SIZE", 10),
      minPoolSize: 0,
      maxConnecting: positiveIntegerFromEnv("MONGODB_MAX_CONNECTING", 2),
      waitQueueTimeoutMS: positiveIntegerFromEnv("MONGODB_WAIT_QUEUE_TIMEOUT_MS", 10000),
    }).catch((error) => {
      connectionPromise = undefined;
      throw error;
    });
  }

  await connectionPromise;

  console.log("MongoDB connected successfully");
  return mongoose.connection;
}

module.exports = connectDB;
