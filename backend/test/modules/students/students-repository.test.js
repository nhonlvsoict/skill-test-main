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

jest.mock('../../../src/utils', () => ({
    processDBRequest: jest.fn()
}));

// Now import the modules
const {
    deleteStudentFromDB
} = require('../../../src/modules/students/students-repository');
const { processDBRequest } = require('../../../src/utils');

describe('Students Repository - Delete Feature', () => {
    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();
    });

    describe('deleteStudentFromDB', () => {
        it('should delete student from database successfully', async () => {
            // Arrange
            const studentId = '123';
            const mockDeleteResult = {
                status: true,
                message: 'Student deleted successfully'
            };
            processDBRequest.mockResolvedValue({
                rows: [mockDeleteResult]
            });

            // Act
            const result = await deleteStudentFromDB(studentId);

            // Assert
            expect(processDBRequest).toHaveBeenCalledWith({
                query: 'SELECT * FROM delete_student($1)',
                queryParams: [studentId]
            });
            expect(result).toEqual(mockDeleteResult);
            expect(result.status).toBe(true);
        });

        it('should return failure status when database deletion fails', async () => {
            // Arrange
            const studentId = '456';
            const mockDeleteResult = {
                status: false,
                message: 'Failed to delete student'
            };
            processDBRequest.mockResolvedValue({
                rows: [mockDeleteResult]
            });

            // Act
            const result = await deleteStudentFromDB(studentId);

            // Assert
            expect(processDBRequest).toHaveBeenCalledWith({
                query: 'SELECT * FROM delete_student($1)',
                queryParams: [studentId]
            });
            expect(result).toEqual(mockDeleteResult);
            expect(result.status).toBe(false);
        });

        it('should handle database connection errors', async () => {
            // Arrange
            const studentId = '789';
            const error = new Error('Database connection failed');
            processDBRequest.mockRejectedValue(error);

            // Act & Assert
            await expect(deleteStudentFromDB(studentId)).rejects.toThrow('Database connection failed');
            expect(processDBRequest).toHaveBeenCalledWith({
                query: 'SELECT * FROM delete_student($1)',
                queryParams: [studentId]
            });
        });

        it('should pass correct student ID to database function', async () => {
            // Arrange
            const studentId = '999';
            const mockDeleteResult = {
                status: true,
                message: 'Student deleted successfully'
            };
            processDBRequest.mockResolvedValue({
                rows: [mockDeleteResult]
            });

            // Act
            await deleteStudentFromDB(studentId);

            // Assert
            const callArgs = processDBRequest.mock.calls[0][0];
            expect(callArgs.queryParams[0]).toBe(studentId);
            expect(callArgs.query).toBe('SELECT * FROM delete_student($1)');
        });

        it('should handle empty response from database', async () => {
            // Arrange
            const studentId = '111';
            processDBRequest.mockResolvedValue({
                rows: [{}]
            });

            // Act
            const result = await deleteStudentFromDB(studentId);

            // Assert
            expect(processDBRequest).toHaveBeenCalledWith({
                query: 'SELECT * FROM delete_student($1)',
                queryParams: [studentId]
            });
            expect(result).toEqual({});
        });

        it('should handle string numeric student ID', async () => {
            // Arrange
            const studentId = '222';
            const mockDeleteResult = {
                status: true,
                message: 'Student deleted successfully'
            };
            processDBRequest.mockResolvedValue({
                rows: [mockDeleteResult]
            });

            // Act
            const result = await deleteStudentFromDB(studentId);

            // Assert
            expect(processDBRequest).toHaveBeenCalledWith({
                query: 'SELECT * FROM delete_student($1)',
                queryParams: [studentId]
            });
            expect(result).toEqual(mockDeleteResult);
        });

        it('should call delete_student stored procedure with correct SQL', async () => {
            // Arrange
            const studentId = '333';
            const mockDeleteResult = {
                status: true,
                message: 'Student deleted successfully'
            };
            processDBRequest.mockResolvedValue({
                rows: [mockDeleteResult]
            });

            // Act
            await deleteStudentFromDB(studentId);

            // Assert
            const callArgs = processDBRequest.mock.calls[0][0];
            expect(callArgs.query).toContain('delete_student');
            expect(callArgs.query).toContain('SELECT *');
        });

        it('should handle multiple deletions in sequence', async () => {
            // Arrange
            const studentIds = ['123', '456', '789'];
            const mockDeleteResult = {
                status: true,
                message: 'Student deleted successfully'
            };
            processDBRequest.mockResolvedValue({
                rows: [mockDeleteResult]
            });

            // Act
            for (const id of studentIds) {
                await deleteStudentFromDB(id);
            }

            // Assert
            expect(processDBRequest).toHaveBeenCalledTimes(3);
            studentIds.forEach((id, index) => {
                expect(processDBRequest.mock.calls[index][0].queryParams[0]).toBe(id);
            });
        });
    });
});
