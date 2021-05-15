const { Router } = require("express");
const router = Router();

const { 
    serverCheck, 
    deleteDeviceById, 
    deleteMetricByDeviceId, 
    getDevices, 
    createDevice, 
    getMetricsByDeviceId, 
    createMetricsByDeviceId, 
    getDeviceById
} = require("../controllers/index.controller");

router.get("/health", serverCheck);
router.delete("/api/v1/devices/:id", deleteDeviceById);
router.delete("/api/v1/devices/:id/metrics", deleteMetricByDeviceId);
router.get("/api/v1/devices", getDevices);
router.get("/api/v1/devices/:id", getDeviceById);
router.post("/api/v1/devices", createDevice);
router.get("/api/v1/devices/:id/metrics", getMetricsByDeviceId);
router.post("/api/v1/devices/:id/metrics", createMetricsByDeviceId);

module.exports = router;