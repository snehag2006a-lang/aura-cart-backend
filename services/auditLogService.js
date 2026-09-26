const AuditLog = require("../models/AuditLog");

const createAuditLog = async ({
  eventType,
  sessionId = null,
  trolleyId = null,
  transactionId = null,
  productId = null,
  message,
  source = "SYSTEM",
  metadata = {}
}) => {
  try {
    const auditLog = await AuditLog.create({
      eventType,
      sessionId,
      trolleyId,
      transactionId,
      productId,
      message,
      source,
      metadata
    });

    return {
      success: true,
      auditLog
    };
  } catch (error) {
    console.error("Audit log creation failed:", error.message);

    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  createAuditLog
};