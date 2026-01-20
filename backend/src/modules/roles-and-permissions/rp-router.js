const express = require("express");
const router = express.Router();
const rpController = require("./rp-controller");
const { checkApiAccess } = require("../../middlewares");

router.get("", checkApiAccess, rpController.handleGetRoles);
router.post("", checkApiAccess, rpController.handleAddRole);
router.post("/switch", checkApiAccess, rpController.handleSwitchRole);
router.put("/:id", checkApiAccess, rpController.handleUpdateRole);
router.post("/:id/status", checkApiAccess, rpController.handleRoleStatus);
router.get("/:id", checkApiAccess, rpController.handleGetRole);
router.get("/:id/permissions", checkApiAccess, rpController.handleGetRolePermission);
router.post("/:id/permissions", checkApiAccess, rpController.handleAddRolePermission);
router.get("/:id/users", checkApiAccess, rpController.handleGetUsersByRoleId);

module.exports = { rpRoutes: router };
