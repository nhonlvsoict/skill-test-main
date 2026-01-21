const { z } = require('zod');

// Schema for adding a new student
const addStudentSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email format').min(1, 'Email is required'),
        name: z.string().min(1, 'Name is required')
    })
});

// Schema for updating an existing student
const updateStudentSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/, 'Student ID must be a valid number')
    }),
    body: z.object({
        email: z.string().email('Invalid email format').optional(),
        name: z.string().min(1, 'Name cannot be empty').optional()
    })
});

// Schema for updating student status
const updateStudentStatusSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/, 'Student ID must be a valid number')
    }),
    body: z.object({
        status: z.boolean({ 
            required_error: 'Status is required',
            invalid_type_error: 'Status must be a boolean' 
        }),
        reviewerId: z.string().min(1, 'Name is required')
    })
});

// Schema for get student detail
const getStudentDetailSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/, 'Student ID must be a valid number')
    })
});

// Schema for delete student 
const deleteStudentSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/, 'Student ID must be a valid number')
    })
});

module.exports = {
    addStudentSchema,
    updateStudentSchema,
    updateStudentStatusSchema,
    getStudentDetailSchema,
    deleteStudentSchema
};
