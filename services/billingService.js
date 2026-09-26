const ShoppingSession = require("../models/ShoppingSession");
const CartItem = require("../models/CartItem");
const Transaction = require("../models/Transaction");

const {
  createAuditLog
} = require("./auditLogService");

const generateTransactionId = () => {
  return `TXN-${Date.now()}`;
};

const generateBill = async (sessionId) => {
  // Find shopping session
  const session = await ShoppingSession.findById(sessionId);

  if (!session) {
    throw new Error("Shopping session not found");
  }

  // Session must be active
  if (session.status !== "ACTIVE") {
    throw new Error("Shopping session is not active");
  }

  // Get cart items
  const cartItems = await CartItem.find({
    sessionId
  }).populate("productId");

  // Cart must not be empty
  if (cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  // Every item must be verified
  const unverifiedItem = cartItems.find(
    (item) => item.verificationStatus !== "VERIFIED"
  );

  if (unverifiedItem) {
    throw new Error(
      "Bill cannot be generated. All cart items must be verified."
    );
  }

  // Prepare transaction items
  const transactionItems = cartItems.map((item) => ({
    productId: item.productId._id,
    name: item.productId.name,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    totalPrice: item.totalPrice
  }));

  // Calculate totals
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = cartItems.reduce(
    (total, item) => total + item.totalPrice,
    0
  );

  const totalAmount = subtotal;

  // Create transaction
  const transaction = await Transaction.create({
    transactionId: generateTransactionId(),
    sessionId: session._id,
    trolleyId: session.trolleyId,
    items: transactionItems,
    totalItems,
    subtotal,
    totalAmount,
    paymentStatus: "PENDING",
    transactionStatus: "PENDING",
    currency: "INR"
  });

  // Create audit log
  await createAuditLog({
    eventType: "BILL_GENERATED",
    sessionId: session._id,
    trolleyId: session.trolleyId,
    transactionId: transaction._id,
    message: `Bill generated successfully for transaction ${transaction.transactionId}.`,
    source: "BILLING",
    metadata: {
      totalItems,
      totalAmount,
      currency: "INR"
    }
  });

  return transaction;
};

module.exports = {
  generateBill
};