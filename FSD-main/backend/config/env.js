const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173"
};

const requiredKeys = ["MONGO_URI", "JWT_SECRET", "JWT_REFRESH_SECRET"];
const missingKeys = requiredKeys.filter((key) => !process.env[key]);

if (missingKeys.length) {
  throw new Error(`Missing required environment variables: ${missingKeys.join(", ")}`);
}

module.exports = env;
