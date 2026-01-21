const express = require("express");
const router = express.Router();
const studentController = require("./students-controller");
const { validateRequest } = require("../../utils/validate-request");
const { 
    addStudentSchema, 
    updateStudentSchema, 
    updateStudentStatusSchema,
    getStudentDetailSchema,
    deleteStudentSchema
} = require("./students-schema");
const { checkApiAccess } = require("../../middlewares");

router.get("", checkApiAccess, studentController.handleGetAllStudents);
router.post("", checkApiAccess, validateRequest(addStudentSchema), studentController.handleAddStudent);
router.get("/:id", checkApiAccess, validateRequest(getStudentDetailSchema), studentController.handleGetStudentDetail);
router.post("/:id/status", checkApiAccess, validateRequest(updateStudentStatusSchema), studentController.handleStudentStatus);
router.put("/:id", checkApiAccess, validateRequest(updateStudentSchema), studentController.handleUpdateStudent);
router.delete("/:id", checkApiAccess, validateRequest(deleteStudentSchema), studentController.handleDeleteStudent);
module.exports = { studentsRoutes: router };
