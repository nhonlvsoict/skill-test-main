const express = require("express");
const router = express.Router();
const studentController = require("./students-controller");
const { validateRequest } = require("../../utils/validate-request");
const { 
    addStudentSchema, 
    updateStudentSchema, 
    updateStudentStatusSchema,
    getStudentDetailSchema 
} = require("./students-validation");

router.get("", studentController.handleGetAllStudents);
router.post("", validateRequest(addStudentSchema), studentController.handleAddStudent);
router.get("/:id", validateRequest(getStudentDetailSchema), studentController.handleGetStudentDetail);
router.post("/:id/status", validateRequest(updateStudentStatusSchema), studentController.handleStudentStatus);
router.put("/:id", validateRequest(updateStudentSchema), studentController.handleUpdateStudent);

module.exports = { studentsRoutes: router };
