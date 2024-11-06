// tests/adminRoutes.test.js
import request from 'supertest';
import express from 'express';
import mentorMenteeRoutes from '../routes/mentorMenteeRoutes.js';  // Adjust path to your routes file
import { createMentorMenteeRelationship } from '../database_queries/AdminQueries.js';

jest.mock('../database_queries/AdminQueries.js'); // Mock the query module to control its behavior in tests

const app = express();
app.use(express.json()); // Enable JSON body parsing
app.use('/admin', mentorMenteeRoutes); // Mount the route under `/admin`

describe('POST /admin/assign-mentor', () => {
    it('should create a mentor-mentee relationship and return 201 status', async () => {
        // Mock createMentorMenteeRelationship to return a mock ID
        const mockRelationshipId = 123;
        createMentorMenteeRelationship.mockResolvedValue(mockRelationshipId);

        const response = await request(app)
            .post('/admin/assign-mentor')
            .send({ mentorkey: 1, menteekey: 2 });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            message: 'Mentor-Mentee relationship created',
            relationshipId: mockRelationshipId
        });
    });

    it('should return 500 status on error', async () => {
        // Mock createMentorMenteeRelationship to throw an error
        createMentorMenteeRelationship.mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .post('/admin/assign-mentor')
            .send({ mentorkey: 1, menteekey: 2 });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            message: 'Failed to assign mentor'
        });
    });
});
