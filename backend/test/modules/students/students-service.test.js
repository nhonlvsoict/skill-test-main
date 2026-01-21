// Mock all external dependencies BEFORE any imports
jest.mock('../../../src/config/env', () => ({
    RESEND_API_KEY: 'test-api-key',
    JWT_SECRET: 'test-secret',
    NODE_ENV: 'test',
    UI_URL: 'http://localhost:3000',
    PORT: 5000,
    DATABASE_URL: 'test-db'
}));

jest.mock('../../../src/config', () => ({
    env: {
        RESEND_API_KEY: 'test-api-key',
        JWT_SECRET: 'test-secret',
        NODE_ENV: 'test',
        UI_URL: 'http://localhost:3000',
        PORT: 5000,
        DATABASE_URL: 'test-db'
    }
}));

jest.mock('resend', () => {
    return {
        Resend: jest.fn().mockImplementation(() => ({
            emails: {
                send: jest.fn()
            }
        }))
    };
});

jest.mock('../../../src/modules/students/students-repository');
jest.mock('../../../src/shared/repository');
jest.mock('../../../src/utils', () => ({
    ApiError: class ApiError extends Error {
        constructor(statusCode, message) {
            super(message);
            this.statusCode = statusCode;
        }
    },
    sendAccountVerificationEmail: jest.fn()
}));

// Now import the modules
const {
    deleteStudent
} = require('../../../src/modules/students/students-service');
const {
    deleteStudentFromDB
} = require('../../../src/modules/students/students-repository');
const { findUserById } = require('../../../src/shared/repository');
const { ApiError } = require('../../../src/utils');

describe('Students Service - Delete Feature', () => {
    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();
    });

    describe('deleteStudent', () => {
        it('should delete student successfully', async () => {
            // Arrange
            const studentId = '123';
            const mockStudent = { id: studentId, name: 'John Doe' };
            const mockDeleteResult = { status: true, message: 'Student deleted successfully' };

            findUserById.mockResolvedValue(mockStudent);
            deleteStudentFromDB.mockResolvedValue(mockDeleteResult);

            // Act
            const result = await deleteStudent(studentId);

            // Assert
            expect(findUserById).toHaveBeenCalledWith(studentId);
            expect(deleteStudentFromDB).toHaveBeenCalledWith(studentId);
            expect(result).toEqual({ message: 'Student deleted successfully' });
        });

        it('should throw error when student not found', async () => {
            // Arrange
            const studentId = '999';
            findUserById.mockResolvedValue(null);

            // Act & Assert
            await expect(deleteStudent(studentId)).rejects.toThrow('Student not found');
            expect(findUserById).toHaveBeenCalledWith(studentId);
            expect(deleteStudentFromDB).not.toHaveBeenCalled();
        });

        it('should throw error when student deletion fails in database', async () => {
            // Arrange
            const studentId = '123';
            const mockStudent = { id: studentId, name: 'John Doe' };
            const mockDeleteResult = { status: false, message: 'Database deletion error' };

            findUserById.mockResolvedValue(mockStudent);
            deleteStudentFromDB.mockResolvedValue(mockDeleteResult);

            // Act & Assert
            await expect(deleteStudent(studentId)).rejects.toThrow('Database deletion error');
            expect(findUserById).toHaveBeenCalledWith(studentId);
            expect(deleteStudentFromDB).toHaveBeenCalledWith(studentId);
        });

        it('should handle repository errors during deletion', async () => {
            // Arrange
            const studentId = '123';
            const mockStudent = { id: studentId, name: 'John Doe' };
            const error = new Error('Connection failed');

            findUserById.mockResolvedValue(mockStudent);
            deleteStudentFromDB.mockRejectedValue(error);

            // Act & Assert
            await expect(deleteStudent(studentId)).rejects.toThrow('Connection failed');
            expect(findUserById).toHaveBeenCalledWith(studentId);
            expect(deleteStudentFromDB).toHaveBeenCalledWith(studentId);
        });

        it('should handle service layer errors from checkStudentId', async () => {
            // Arrange
            const studentId = '123';
            const error = new ApiError(404, 'Student not found');

            findUserById.mockRejectedValue(error);

            // Act & Assert
            await expect(deleteStudent(studentId)).rejects.toThrow('Student not found');
            expect(findUserById).toHaveBeenCalledWith(studentId);
            expect(deleteStudentFromDB).not.toHaveBeenCalled();
        });

        it('should successfully delete student with string numeric ID', async () => {
            // Arrange
            const studentId = '456';
            const mockStudent = { id: studentId, name: 'Jane Smith' };
            const mockDeleteResult = { status: true, message: 'Student deleted successfully' };

            findUserById.mockResolvedValue(mockStudent);
            deleteStudentFromDB.mockResolvedValue(mockDeleteResult);

            // Act
            const result = await deleteStudent(studentId);

            // Assert
            expect(findUserById).toHaveBeenCalledWith(studentId);
            expect(deleteStudentFromDB).toHaveBeenCalledWith(studentId);
            expect(result).toEqual({ message: 'Student deleted successfully' });
        });
    });
});
