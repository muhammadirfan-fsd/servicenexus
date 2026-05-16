const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const { initSocket } = require("./src/sockets/socket");
const errorMiddleware = require("./src/middlewares/error.middleware");

dotenv.config();

const app = express();
const server = http.createServer(app);

// Connect Database
connectDB();

// Init Socket
initSocket(server);

// Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/auth", require("./src/routes/auth.routes"));
app.use("/api/v1/users", require("./src/routes/user.routes"));
app.use("/api/v1/providers", require("./src/routes/provider.routes"));
app.use("/api/v1/services", require("./src/routes/service.routes"));
app.use("/api/v1/bookings", require("./src/routes/booking.routes"));
app.use("/api/v1/admin", require("./src/routes/admin.routes"));
app.use("/api/v1/chat", require("./src/routes/chat.routes"));
app.use("/api/v1/upload", require("./src/routes/upload.routes"));

// Health check
app.get("/", (req, res) => {
  res.json({ 
    success: true, 
    message: "ServiceNexus API Running",
    version: "1.0.0"
  });
});

// Error Handler
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 ServiceNexus Server running on port ${PORT}`);
});