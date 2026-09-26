const AuditLog = require("../models/AuditLog");

const getAuditLogs = async (req, res) => {
  try {
    const {
      sessionId,
      trolleyId,
      transactionId,
      eventType
    } = req.query;

    const filter = {};

    if (sessionId) {
      filter.sessionId = sessionId;
    }

    if (trolleyId) {
      filter.trolleyId = trolleyId;
    }

    if (transactionId) {
      filter.transactionId = transactionId;
    }

    if (eventType) {
      filter.eventType = eventType;
    }

    const auditLogs = await AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      count: auditLogs.length,
      auditLogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch audit logs",
      error: error.message
    });
  }
};

module.exports = {
  getAuditLogs
};