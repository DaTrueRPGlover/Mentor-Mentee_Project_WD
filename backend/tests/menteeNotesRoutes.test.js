import request from 'supertest';
import express from 'express';
import menteeNotesRoutes from '../routes/menteeNotesRoutes'; // Adjust the path if needed

const app = express();
app.use(express.json());
app.use('/api', menteeNotesRoutes); // Mount the routes

describe('Mentee Notes Routes', () => {
    it('should fetch mentee notes by meeting key', async () => {
        const res = await request(app).get('/api/menteenotes/2f7adff3-9943-11ef-a92b-02a12f7436d7');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('menteekey'); // Adjust as per your actual output
    });

    /*it('should insert a new mentee note', async () => {
        const res = await request(app)
            .post('/api/menteenotes')
            .send({
                meetingkey: 'de967905-9c73-11ef-a92b-02a12f7436d7',
                menteekey: '2d9f4b3a-987f-11ef-a92b-02a12f7436d7',
                datetime: '2024-11-05T12:00:00Z',
                profileOfALeader: '1',
                executiveCommunicationStyle: '1',
                trustRespectVisibility: '1',
                motivatingYourTeam: '1',
                selfAdvocacyAndCareerGrowth: '1',
                workLifeBalance: '1',
                additionalComments: 'Testing'
            });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'Mentee note inserted successfully.');
    });*/
});
