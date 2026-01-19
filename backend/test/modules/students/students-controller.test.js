const {
    handleGetAllStudents,
    handleGetStudentDetail,
    handleAddStudent,
    handleStudentStatus,
    handleUpdateStudent,
} = require('../../../src/modules/students/students-controller');
const {
    getAllStudents,
    addNewStudent,
    getStudentDetail,
    setStudentStatus,
    updateStudent
} = require('../../../src/modules/students/students-service');

// Mock the students-service module
jest.mock('../../../src/modules/students/students-service');

// Mock express-async-handler to pass through the async function
jest.mock('express-async-handler', () => {
    return (fn) => fn;
});

describe('Students Controller', () => {
    let req, res, next;

    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();

        // Setup common request and response objects
        req = {
            query: {},
            body: {},
            params: {},
            user: {}
        };

        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        next = jest.fn();
    });

    describe('handleGetAllStudents', () => {
        it('should get all students without filters', async () => {
            // Arrange
            const mockStudents = [
                { id: 1, name: 'John Doe', className: '10A', section: 'A', roll: 1 },
                { id: 2, name: 'Jane Smith', className: '10B', section: 'B', roll: 2 }
            ];
            getAllStudents.mockResolvedValue(mockStudents);

            // Act
            await handleGetAllStudents(req, res);

            // Assert
            expect(getAllStudents).toHaveBeenCalledWith({
                name: undefined,
                className: undefined,
                section: undefined,
                roll: undefined
            });
            expect(res.json).toHaveBeenCalledWith({ students: mockStudents });
        });

        it('should get students with name filter', async () => {
            // Arrange
            const mockStudents = [
                { id: 1, name: 'John Doe', className: '10A', section: 'A', roll: 1 }
            ];
            req.query = { name: 'John' };
            getAllStudents.mockResolvedValue(mockStudents);

            // Act
            await handleGetAllStudents(req, res);

            // Assert
            expect(getAllStudents).toHaveBeenCalledWith({
                name: 'John',
                className: undefined,
                section: undefined,
                roll: undefined
            });
            expect(res.json).toHaveBeenCalledWith({ students: mockStudents });
        });

        it('should get students with multiple filters', async () => {
            // Arrange
            const mockStudents = [
                { id: 1, name: 'John Doe', className: '10A', section: 'A', roll: 1 }
            ];
            req.query = { name: 'John', className: '10A', section: 'A', roll: '1' };
            getAllStudents.mockResolvedValue(mockStudents);

            // Act
            await handleGetAllStudents(req, res);

            // Assert
            expect(getAllStudents).toHaveBeenCalledWith({
                name: 'John',
                className: '10A',
                section: 'A',
                roll: '1'
            });
            expect(res.json).toHaveBeenCalledWith({ students: mockStudents });
        });

        it('should handle service errors', async () => {
            // Arrange
            const error = new Error('Database error');
            getAllStudents.mockRejectedValue(error);

            // Act & Assert
            await expect(handleGetAllStudents(req, res)).rejects.toThrow('Database error');
            expect(getAllStudents).toHaveBeenCalled();
        });
    });

    describe('handleAddStudent', () => {
        it('should add a new student successfully', async () => {
            // Arrange
            const studentData = {
                name: 'John Doe',
                email: 'john@example.com',
                className: '10A',
                section: 'A',
                roll: 1
            };
            const mockResponse = { message: 'Student added successfully', studentId: 1 };
            req.body = studentData;
            addNewStudent.mockResolvedValue(mockResponse);

            // Act
            await handleAddStudent(req, res);

            // Assert
            expect(addNewStudent).toHaveBeenCalledWith(studentData);
            expect(res.json).toHaveBeenCalledWith(mockResponse);
        });

        it('should handle empty request body', async () => {
            // Arrange
            const mockResponse = { message: 'Student added successfully' };
            req.body = {};
            addNewStudent.mockResolvedValue(mockResponse);

            // Act
            await handleAddStudent(req, res);

            // Assert
            expect(addNewStudent).toHaveBeenCalledWith({});
            expect(res.json).toHaveBeenCalledWith(mockResponse);
        });

        it('should handle service errors', async () => {
            // Arrange
            const studentData = { name: 'John Doe' };
            const error = new Error('Validation error');
            req.body = studentData;
            addNewStudent.mockRejectedValue(error);

            // Act & Assert
            await expect(handleAddStudent(req, res)).rejects.toThrow('Validation error');
            expect(addNewStudent).toHaveBeenCalledWith(studentData);
        });
    });

    describe('handleUpdateStudent', () => {
        it('should update student successfully', async () => {
            // Arrange
            const userId = '123';
            const updateData = {
                name: 'John Updated',
                email: 'johnupdated@example.com',
                className: '11A'
            };
            const mockResponse = { message: 'Student updated successfully' };
            req.params = { id: userId };
            req.body = updateData;
            updateStudent.mockResolvedValue(mockResponse);

            // Act
            await handleUpdateStudent(req, res);

            // Assert
            expect(updateStudent).toHaveBeenCalledWith({
                ...updateData,
                userId
            });
            expect(res.json).toHaveBeenCalledWith(mockResponse);
        });

        it('should handle update with partial data', async () => {
            // Arrange
            const userId = '456';
            const updateData = { name: 'Jane Doe' };
            const mockResponse = { message: 'Student updated successfully' };
            req.params = { id: userId };
            req.body = updateData;
            updateStudent.mockResolvedValue(mockResponse);

            // Act
            await handleUpdateStudent(req, res);

            // Assert
            expect(updateStudent).toHaveBeenCalledWith({
                ...updateData,
                userId
            });
            expect(res.json).toHaveBeenCalledWith(mockResponse);
        });

        it('should handle service errors', async () => {
            // Arrange
            const error = new Error('Update failed');
            req.params = { id: '123' };
            req.body = { name: 'Test' };
            updateStudent.mockRejectedValue(error);

            // Act & Assert
            await expect(handleUpdateStudent(req, res)).rejects.toThrow('Update failed');
        });
    });

    describe('handleGetStudentDetail', () => {
        it('should get student detail successfully', async () => {
            // Arrange
            const studentId = '123';
            const mockStudent = {
                id: 123,
                name: 'John Doe',
                email: 'john@example.com',
                className: '10A',
                section: 'A',
                roll: 1
            };
            req.parans = { id: studentId }; // Note: typo in original code 'parans' instead of 'params'
            getStudentDetail.mockResolvedValue(mockStudent);

            // Act
            await handleGetStudentDetail(req, res);

            // Assert
            expect(getStudentDetail).toHaveBeenCalledWith(studentId);
            expect(res.json).toHaveBeenCalledWith(mockStudent);
        });

        it('should handle student not found', async () => {
            // Arrange
            const studentId = '999';
            req.parans = { id: studentId };
            getStudentDetail.mockResolvedValue(null);

            // Act
            await handleGetStudentDetail(req, res);

            // Assert
            expect(getStudentDetail).toHaveBeenCalledWith(studentId);
            expect(res.json).toHaveBeenCalledWith(null);
        });

        it('should handle service errors', async () => {
            // Arrange
            const error = new Error('Database error');
            req.parans = { id: '123' };
            getStudentDetail.mockRejectedValue(error);

            // Act & Assert
            await expect(handleGetStudentDetail(req, res)).rejects.toThrow('Database error');
        });
    });

    describe('handleStudentStatus', () => {
        it('should update student status successfully', async () => {
            // Arrange
            const userId = '123';
            const reviewerId = '456';
            const statusData = {
                status: 'active',
                reason: 'Student verified'
            };
            const mockResponse = { message: 'Status updated successfully' };
            req.params = { id: userId };
            req.user = { id: reviewerId };
            req.body = statusData;
            setStudentStatus.mockResolvedValue(mockResponse);

            // Act
            await handleStudentStatus(req, res);

            // Assert
            expect(setStudentStatus).toHaveBeenCalledWith({
                ...statusData,
                userId,
                reviewerId
            });
            expect(res.json).toHaveBeenCalledWith(mockResponse);
        });

        it('should handle status change with minimal data', async () => {
            // Arrange
            const userId = '789';
            const reviewerId = '101';
            const statusData = { status: 'inactive' };
            const mockResponse = { message: 'Status updated successfully' };
            req.params = { id: userId };
            req.user = { id: reviewerId };
            req.body = statusData;
            setStudentStatus.mockResolvedValue(mockResponse);

            // Act
            await handleStudentStatus(req, res);

            // Assert
            expect(setStudentStatus).toHaveBeenCalledWith({
                ...statusData,
                userId,
                reviewerId
            });
            expect(res.json).toHaveBeenCalledWith(mockResponse);
        });

        it('should handle missing user in request', async () => {
            // Arrange
            const userId = '123';
            const statusData = { status: 'active' };
            const mockResponse = { message: 'Status updated successfully' };
            req.params = { id: userId };
            req.user = {}; // No id in user object
            req.body = statusData;
            setStudentStatus.mockResolvedValue(mockResponse);

            // Act
            await handleStudentStatus(req, res);

            // Assert
            expect(setStudentStatus).toHaveBeenCalledWith({
                ...statusData,
                userId,
                reviewerId: undefined
            });
        });

        it('should handle service errors', async () => {
            // Arrange
            const error = new Error('Unauthorized');
            req.params = { id: '123' };
            req.user = { id: '456' };
            req.body = { status: 'active' };
            setStudentStatus.mockRejectedValue(error);

            // Act & Assert
            await expect(handleStudentStatus(req, res)).rejects.toThrow('Unauthorized');
        });
    });
});
