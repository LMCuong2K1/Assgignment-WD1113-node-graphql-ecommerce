const express = require("express");
const healthController = require("../controllers/healthController");

const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Kiểm tra sức khỏe server
 *     description: Trả về trạng thái hoạt động của server, database và thời gian uptime
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: Server hoạt động bình thường
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 uptime:
 *                   type: number
 *                   example: 123.45
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-05-15T10:30:00.000Z"
 *                 database:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: connected
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *       503:
 *         description: Server gặp sự cố (database không kết nối được)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: degraded
 *                 uptime:
 *                   type: number
 *                   example: 123.45
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 database:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: disconnected
 */
router.get("/", healthController.getHealth);

module.exports = router;
