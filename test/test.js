const assert = require('assert');
const app = require('../server/app');
const request = require('supertest');
const expect = require('chai').expect;
const { type } = require('os');
const { response } = require('express');

describe('api', () => {
    describe('GET', () => {
        describe('/api/envelopes', () => {
            it('returns an array', async () =>{
                const expectedType = 'object';

                const response = await request(app).
                get('/api/envelopes')
                .send()
                .expect(200);
                
                
                assert.strictEqual(typeof response.body, expectedType);
                 
            })
            it('array has instances of envelopes', async () =>{
                
                const response = await request(app).
                get('/api/envelopes')
                .send()
                .expect(200);

                const arr = response.body.filter(env =>{
                    return env.hasOwnProperty('saveAmount');
                })

                assert.strictEqual(response.body.length, arr.length);

            })
        })
        describe('/api/envelopes/:id', () => {
            it('ID of the returned object is same as provided ID', async () =>{
                const expectedId = 0;

                const response = await request(app).
                get('/api/envelopes/0')
                .send()
                .expect(200);

                assert.strictEqual(response.body.id, expectedId);

            })
            it('returns error 404 if ID is not found', async () =>{
                const expectedId = 500;

                const response = await request(app).
                get('/api/envelopes/500')
                .send()
                .expect(404);
            })
            
        })
    })
    describe('POST', () =>{
        describe('/api/envelope', ()=>{
            it('posts correct object', async () =>{
                const objectToPost = {
                    name: 'test',
                    saveAmount: 200,
                    total: 15
                }

                const response = await request(app).
                post('/api/envelope')
                .send(objectToPost)
                .expect(201);
                returnedEnvelope = response.body

                assert.strictEqual(returnedEnvelope.name, objectToPost.name);

            })
            it('returns error 400 if not all keys are sent', async () =>{
                const objectToPost = {
                    name: 'test',
                    total: 15
                }
                
                const response = await request(app).
                post('/api/envelope')
                .send(objectToPost)
                .expect(400);
            })
        })
    })
    describe('PUT', () =>{
        describe('/api/envelopes/:id', ()=>{
            it('updates the correct object', async () =>{
                const objectToSend = {
                    name: 'test',
                    saveAmount: 200,
                    total: 15,
                    id: 0
                }

                const response = await request(app).
                put('/api/envelopes/0')
                .send(objectToSend);

                returnedEnvelope = response.body

                assert.deepStrictEqual(response.body, objectToSend);

            })
            it('returns error 400 if not all keys are sent', async () =>{
                const objectToPost = {
                    name: 'test',
                    total: 15
                }
                
                const response = await request(app).
                put('/api/envelopes/0')
                .send(objectToPost)
                .expect(400);
            })
            it('returns error 404 if ID is not found', async () =>{
                const expectedId = 500;
                const objectToPost = {
                    name: 'test',
                    saveAmount: 200,
                    total: 15
                }
                
                
                const response = await request(app).
                put('/api/envelopes/500')
                .send(objectToPost)
                .expect(404);
            })
        })
        describe('/api/salary', () =>{
            it('returns the new total savings',async () =>{
                const expectedSavings = 18050;
                const objectToPost1 = {
                    salary: 15000
                }

                const objectToPost2 = {
                    salary: 17000
                }

                const response1 = await request(app).
                put('/api/salary')
                .send(objectToPost1)
                .expect(200);

                originalTotSavings = response1.body.totalSavings;

                const response2 = await request(app).
                put('/api/salary')
                .send(objectToPost2)
                .expect(200);

                const newTotSavings = response2.body.totalSavings;

                assert.strictEqual(originalTotSavings+objectToPost2.salary, newTotSavings)

            })
        })
    })
    describe('DELETE', () =>{
        describe('/api/envelopes/:id', ()=>{
            it('deletes the correct object', async () =>{
                const objectToSend = {
                    name: 'test',
                    saveAmount: 200,
                    total: 15,
                    id: 0
                }
                
                await request(app).
                post('/api/envelope')
                .send(objectToSend)
                .expect(201);

                const response = await request(app)
                    .delete('/api/envelopes/0')
                    .send()
                    .expect(204)

                await request(app).
                    post('/api/envelopes/0')
                    .send(objectToSend)
                    .expect(404);

            })
            it('returns error 404 if ID is not found', async () =>{
                const response = await request(app)
                    .delete('/api/envelopes/500')
                    .send()
                    .expect(404)
            })
        })
    })
})