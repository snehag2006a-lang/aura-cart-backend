const express = require("express");
const cors = require("cors");

const productRoutes = require("./routes/productRoutes");
const trolleyRoutes = require("./routes/trolleyRoutes");
const shoppingSessionRoutes = require("./routes/shoppingSessionRoutes");
const cartRoutes = require("./routes/cartRoutes");
const verificationRoutes = require("./routes/verificationRoutes");
const weightVerificationRoutes = require("./routes/weightVerificationRoutes");
const consistencyRoutes = require("./routes/consistencyRoutes");
const lossPreventionRoutes = require("./routes/lossPreventionRoutes");
const cartVerificationRoutes = require("./routes/cartVerificationRoutes");
const billingRoutes = require("./routes/billingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const aiRecognitionRoutes = require("./routes/aiRecognitionRoutes");
const auditLogRoutes = require("./routes/auditLogRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "AI-Powered Smart Trolley Backend is running"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    service: "Smart Trolley Backend"
  });
});

app.use("/api/products", productRoutes);
app.use("/api/trolleys", trolleyRoutes);
app.use("/api/shopping-sessions", shoppingSessionRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/weight-verification", weightVerificationRoutes);
app.use("/api/consistency", consistencyRoutes);
app.use("/api/loss-prevention", lossPreventionRoutes);
app.use("/api/cart-verification", cartVerificationRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/ai", aiRecognitionRoutes);
app.use("/api/audit-logs", auditLogRoutes);

module.exports = app;