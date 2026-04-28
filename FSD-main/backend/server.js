const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");

dotenv.config();

const connectDB = require("./config/db");
const env = require("./config/env");
const swaggerSpec = require("./config/swagger");
const { httpLogger, logger } = require("./config/logger");
const { apiLimiter } = require("./middleware/rateLimiter");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
connectDB();

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true
  })
);
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(httpLogger);
app.use(apiLimiter);

app.get("/", (_req, res) => {
  res.json({
    name: "Volunteer Connect API",
    status: "running",
    docs: "/api/docs"
  });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/ngos", require("./routes/ngoRoutes"));
app.use("/api/opportunities", require("./routes/opportunityRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));
app.use("/api/campaigns", require("./routes/campaignRoutes"));
app.use("/api/donations", require("./routes/donationRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(notFound);
app.use(errorHandler);

app.listen(env.port, () => logger.info(`Server running on port ${env.port}`));
