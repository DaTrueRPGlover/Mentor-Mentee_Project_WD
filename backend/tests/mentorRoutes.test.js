import request from 'supertest';
import express from 'express';
import mentorRoutes from '../routes/mentorRoutes';
import {
    getMentorNameByKey,
    getMenteeKeyByMentorKey,
    getMentorDepartmentKeyByKey,
    getMentorEmailByKey
} from '../database_queries/MentorQueries.js';

import {
    getMenteeNameByKey,
    getMenteeEmailByKey,
    getMenteeDepartmentKeyByKey
} from '../database_queries/MenteeQueries.js';
// Mocking database query functions to avoid actual database calls during testing
jest.mock('../database_queries/MentorQueries.js', () => ({
    getMentorNameByKey: jest.fn(),
    getMenteeKeyByMentorKey: jest.fn(),
    getMentorDepartmentKeyByKey: jest.fn(),
    getMentorEmailByKey: jest.fn(),
}));

jest.mock('../database_queries/MenteeQueries.js', () => ({
    getMenteeNameByKey: jest.fn(),
    getMenteeEmailByKey: jest.fn(),
    getMenteeDepartmentKeyByKey: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/mentor', mentorRoutes);

describe('Mentor Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear previous mock calls before each test
    });

    it('should fetch mentor name by mentorkey', async () => {
        const mockMentorName = 'John Doe';
        getMentorNameByKey.mockResolvedValue(mockMentorName);

        const response = await request(app)
            .get('/mentor/name/1')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body.mentorName).toBe(mockMentorName);
    });

    it('should fetch mentee keys by mentorkey', async () => {
        const mockMenteeKeys = [1, 2, 3];
        getMenteeKeyByMentorKey.mockResolvedValue(mockMenteeKeys);

        const response = await request(app)
            .get('/mentor/mentees/1')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body.menteeKeys).toEqual(mockMenteeKeys);
    });

    it('should fetch mentor department key by mentorkey', async () => {
        const mockDepartmentKey = 101;
        getMentorDepartmentKeyByKey.mockResolvedValue(mockDepartmentKey);

        const response = await request(app)
            .get('/mentor/department/1')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body.departmentKey).toBe(mockDepartmentKey);
    });

    it('should fetch mentor email by mentorkey', async () => {
        const mockEmail = 'johndoe@example.com';
        getMentorEmailByKey.mockResolvedValue(mockEmail);

        const response = await request(app)
            .get('/mentor/email/1')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body.email).toBe(mockEmail);
    });

    it('should fetch mentee details by mentorkey', async () => {
        const mockMenteeKeys = [1, 2];
        const mockMenteeDetails = [
            { menteekey: 1, menteeName: 'Mentee A', menteeEmail: 'menteeA@example.com', menteeDepartmentKey: 101 },
            { menteekey: 2, menteeName: 'Mentee B', menteeEmail: 'menteeB@example.com', menteeDepartmentKey: 102 }
        ];

        getMenteeKeyByMentorKey.mockResolvedValue(mockMenteeKeys);
        getMenteeNameByKey.mockResolvedValueOnce('Mentee A').mockResolvedValueOnce('Mentee B');
        getMenteeEmailByKey.mockResolvedValueOnce('menteeA@example.com').mockResolvedValueOnce('menteeB@example.com');
        getMenteeDepartmentKeyByKey.mockResolvedValueOnce(101).mockResolvedValueOnce(102);

        const response = await request(app)
            .get('/mentor/1/mentees')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body.mentees).toEqual(mockMenteeDetails);
    });
});
