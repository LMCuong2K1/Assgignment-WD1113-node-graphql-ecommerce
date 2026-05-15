const mongoose = require("mongoose");

class HealthController {
  /**
   * GET /health
   * Kiểm tra sức khỏe tổng thể của server
   */
  getHealth = async (req, res) => {
    // Kiểm tra trạng thái kết nối MongoDB
    let dbStatus = "disconnected";
    try {
      if (mongoose.connection.readyState === 1) {
        // 1 = connected
        await mongoose.connection.db.admin().ping();
        dbStatus = "connected";
      }
    } catch (error) {
      dbStatus = "error";
    }

    // Xác định status tổng thể
    const overallStatus = dbStatus === "connected" ? "ok" : "degraded";

    return res.status(dbStatus === "connected" ? 200 : 503).json({
      status: overallStatus,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: {
        status: dbStatus,
      },
      version: process.env.npm_package_version || "1.0.0",
    });
  };
}

module.exports = new HealthController();
