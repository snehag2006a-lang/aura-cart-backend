
const Payment = require("../models/Payment");
const Transaction = require("../models/Transaction");
const ShoppingSession = require("../models/ShoppingSession");
const Trolley = require("../models/Trolley");

const {
  updateInventoryAfterPayment
} = require("./inventoryService");

const {
  createAuditLog
} = require("./auditLogService");

const generatePaymentId = () => {
  return "PAY-" + Date.now();
};

const generatePaymentReference = () => {
  return "SIM-" + Date.now();
};

const processPayment = async (transactionId, method) => {
  // Find transaction
  const transaction = await Transaction.findById(transactionId);

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  // Transaction must be pending
  if (transaction.transactionStatus !== "PENDING") {
    throw new Error("Transaction is not pending");
  }

  // Payment method is required
  if (!method) {
    throw new Error("Payment method is required");
  }

  // Create simulated payment
  const payment = await Payment.create({
    paymentId: generatePaymentId(),
    transactionId: transaction._id,
    amount: transaction.totalAmount,
    method,
    status: "SUCCESS",
    reference: generatePaymentReference()
  });

  // Audit: payment successful
  await createAuditLog({
    eventType: "PAYMENT_SUCCESS",
    sessionId: transaction.sessionId,
    trolleyId: transaction.trolleyId,
    transactionId: transaction._id,
    message:
      "Payment successful for transaction " +
      transaction.transactionId +
      ".",
    source: "PAYMENT",
    metadata: {
      paymentId: payment.paymentId,
      amount: payment.amount,
      method: payment.method,
      reference: payment.reference
    }
  });

  // Update inventory only after successful payment
  const inventoryResult =
    await updateInventoryAfterPayment(transaction);

  // Inventory must be updated successfully
  // before transaction/session are marked completed.
  if (!inventoryResult.success) {
    transaction.paymentStatus = "SUCCESS";
    transaction.transactionStatus = "PENDING";

    await transaction.save();

    await createAuditLog({
      eventType: "PAYMENT_FAILED",
      sessionId: transaction.sessionId,
      trolleyId: transaction.trolleyId,
      transactionId: transaction._id,
      message:
        "Payment succeeded, but transaction could not be completed because inventory update failed: " +
        inventoryResult.error,
      source: "INVENTORY",
      metadata: {
        paymentId: payment.paymentId,
        inventoryError: inventoryResult.error
      }
    });

    throw new Error(
      "Payment received, but transaction could not be completed: " +
      inventoryResult.error
    );
  }

  // Audit: inventory updated
  await createAuditLog({
    eventType: "INVENTORY_UPDATED",
    sessionId: transaction.sessionId,
    trolleyId: transaction.trolleyId,
    transactionId: transaction._id,
    message:
      "Inventory updated successfully for transaction " +
      transaction.transactionId +
      ".",
    source: "INVENTORY",
    metadata: {
      totalItems: transaction.totalItems,
      totalAmount: transaction.totalAmount
    }
  });

  // Now it is safe to complete the transaction
  transaction.paymentStatus = "SUCCESS";
  transaction.transactionStatus = "COMPLETED";

  await transaction.save();

  // Audit: transaction completed
  await createAuditLog({
    eventType: "TRANSACTION_COMPLETED",
    sessionId: transaction.sessionId,
    trolleyId: transaction.trolleyId,
    transactionId: transaction._id,
    message:
      "Transaction " +
      transaction.transactionId +
      " completed successfully.",
    source: "PAYMENT",
    metadata: {
      paymentStatus: transaction.paymentStatus,
      transactionStatus: transaction.transactionStatus
    }
  });

  // Find shopping session
  const session = await ShoppingSession.findById(
    transaction.sessionId
  );

  if (!session) {
    throw new Error("Shopping session not found");
  }

  // Complete shopping session
  session.status = "COMPLETED";
  session.completedAt = new Date();

  await session.save();

  // Audit: session completed
  await createAuditLog({
    eventType: "SESSION_COMPLETED",
    sessionId: session._id,
    trolleyId: transaction.trolleyId,
    transactionId: transaction._id,
    message:
      "Shopping session " +
      session.sessionId +
      " completed successfully.",
    source: "SYSTEM",
    metadata: {
      totalItems: session.totalItems,
      totalAmount: session.totalAmount
    }
  });

  // Find trolley
  const trolley = await Trolley.findById(
    transaction.trolleyId
  );

  if (!trolley) {
    throw new Error("Trolley not found");
  }

  // Release trolley
  trolley.status = "AVAILABLE";

  await trolley.save();

  // Audit: trolley released
  await createAuditLog({
    eventType: "TROLLEY_RELEASED",
    sessionId: session._id,
    trolleyId: trolley._id,
    transactionId: transaction._id,
    message:
      "Trolley " +
      trolley.trolleyId +
      " is now available.",
    source: "SYSTEM",
    metadata: {
      trolleyStatus: trolley.status
    }
  });

  return {
    payment,
    transaction,
    inventory: inventoryResult,
    session,
    trolley
  };
};

module.exports = {
  processPayment
};
