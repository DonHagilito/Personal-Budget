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
            it('returns and instance of an envelope object', async () => {
                return await request(app)
                    .get('/api/envelopes/0')
                    .expect(200)
                    .then((response) => {
                        const envelope = response.body;
                        expect(envelope).to.be.an.instanceOf(Object);
                        expect(envelope).to.not.be.and.instanceOf(Array);
                    })
                    });
            it('returns a full envelope object', () => {
                return request(app)
                    .get('/api/envelopes/0')
                    .expect(200)
                    .then((response) => {
                        const envelope = response.body;
                        expect(envelope).to.haveOwnProperty('name');
                        expect(envelope).to.haveOwnProperty('saveAmount');
                        expect(envelope).to.haveOwnProperty('total');
                        expect(envelope).to.haveOwnProperty('id');
                    })
            })
            it('returns the envelope with the correct ID', () => {
                return request(app)
                    .get('/api/envelopes/0')
                    .expect(200)
                    .then((response) => {
                        const envelope = response.body;
                        expect(envelope.id).to.be.equal(0);
                    })
                })
            it('ID of the returned object is same as provided ID', async () =>{
                const expectedId = 0;

                const response = await request(app).
                get('/api/envelopes/0')
                .send()
                .expect(200);

                assert.strictEqual(response.body.id, expectedId);

            })
            it('returns and error 404 if called with a non-numeric ID', () => {
                return request(app)
                    .get('/api/envelopes/schabläm')
                    .expect(404);
            })
            it('returns error 404 if ID is not found', async () =>{
                const expectedId = 500;

                const response = await request(app).
                get('/api/envelopes/500')
                .send()
                .expect(404);
            })
            
        })
        describe('/api/non-envelope-savings', () =>{
            it('returns the non-envelope savings', () =>{
                request(app)
                    .get('/api/non-envelope-savings')
                    .expect(200)
                    .then((response) => {
                        const nonEnvelopeSavings = response.body.nonEnvelopeSavings;
                        expect(nonEnvelopeSavings).to.be.an.instanceOf(Number);
                        expect(nonEnvelopeSavings).to.be.greaterThan.or.equal.to(0);
                    })
            })
        })
    })
    describe('POST', () =>{
        describe('/api/envelope', ()=>{
            it('posts and returns correct object', async () =>{
                const objectToPost = {
                    name: 'test',
                    saveAmount: 200,
                    total: 15
                }

                const response = await request(app).
                post('/api/envelope')
                .send(objectToPost)
                .expect(201)
                .then((response) => {
                    const returnedEnvelope = response.body;
                    objectToPost.id = returnedEnvelope.id;
                    expect(objectToPost).to.be.deep.equal(returnedEnvelope);
                });


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
            it('returns error 400 if saveAmount is a negative number', () =>{
                const objectToSend = {
                    name: 'test',
                    saveAmount: -500,
                    total: 15,
                }
                
                return request(app)
                    .post('/api/envelope')
                    .send(objectToSend)
                    .expect(400);
            })
            it('returns error 400 if property total is a negative number', () =>{
                const objectToSend = {
                    name: 'test',
                    saveAmount: 124,
                    total: -500,
                }
                
                return request(app)
                    .post('/api/envelope')
                    .send(objectToSend)
                    .expect(400);
            })
            it('does not add extra keys supplied in the request to envelopes', () =>{
                const objectToSend = {
                    name: 'test',
                    saveAmount: 124,
                    total: 500,
                    favoriteFood: 'pizza'
                }
                
                return request(app)
                    .post('/api/envelope')
                    .send(objectToSend)
                    .expect(201)
                    .then((response) =>{
                        const envelope = response.body;

                        expect(envelope).to.not.haveOwnProperty('faveoriteFood');
                    });
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
                assert.deepStrictEqual(returnedEnvelope, objectToSend);

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
            it('called with an invalid ID does not change the database array', async () => {
                const response1 = await request(app).
                get('/api/envelopes')
                .send()
                .expect(200);

                const objectToSend = {
                    name: 'test',
                    saveAmount: 200,
                    total: 15,
                    id: 0
                }

                await request(app).
                put('/api/envelopes/1502')
                .send(objectToSend);
                
                const response2 = await request(app).
                get('/api/envelopes')
                .send()
                .expect(200);

                expect(response1.body).to.be.deep.equal(response2.body);
            })
            it('returns error 400 if saveAmount is a negative number', () =>{
                const objectToSend = {
                    name: 'test',
                    saveAmount: -500,
                    total: 15,
                    id: 0
                }
                
                return request(app)
                    .put('/api/envelopes/0')
                    .send(objectToSend)
                    .expect(400);
            })
            it('returns error 400 if property total is a negative number', () =>{
                const objectToSend = {
                    name: 'test',
                    saveAmount: 124,
                    total: -500,
                    id: 0
                }
                
                return request(app)
                    .put('/api/envelopes/0')
                    .send(objectToSend)
                    .expect(400);
            })
            it('does not add extra keys supplied in the request to envelopes', () =>{
                const objectToSend = {
                    name: 'test',
                    saveAmount: 124,
                    total: 500,
                    favoriteFood: 'pizza',
                    id: 0
                }
                
                return request(app)
                    .put('/api/envelopes/0')
                    .send(objectToSend)
                    .expect(200)
                    .then((response) =>{
                        const envelope = response.body;

                        expect(envelope).to.not.haveOwnProperty('faveoriteFood');
                    });
            })
        })
        describe('/api/transfer/:from/:to', () => {
            it('transfers funds from one envelope to another', async() =>{
                const orignalFrom = await request(app)
                    .get('/api/envelopes/0')
                    .send()
                    .expect(200)
                    .then((response) => {
                        return response.body;
                    });
                    
                const orignalTo = await request(app)
                    .get('/api/envelopes/1')
                    .send()
                    .expect(200)
                    .then((response) => {
                        return response.body;
                    });

                
                await request(app)
                    .put('/api/transfer/0/1')
                    .send({amount: 50})
                    .expect(200);

                const newFrom = await request(app)
                    .get('/api/envelopes/0')
                    .send()
                    .expect(200)
                    .then((response) => {
                        return response.body;
                    });
                    
                const newTo = await request(app)
                    .get('/api/envelopes/1')
                    .send()
                    .expect(200)
                    .then((response) => {
                        return response.body;
                    });
                
                expect(orignalFrom.total-50).to.be.equal(newFrom.total);
                expect(orignalTo.total+50).to.be.equal(newTo.total);
            })
            it('returns error 400 if trying to transfer more money than available', () =>{
                return request(app)
                .put('/api/transfer/0/1')
                .send({amount: 1000000})
                .expect(400);
            })
        })
        describe('/api/salary', () =>{
            it('returns the new total savings', async () =>{
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
            it('returns error 400 if a non-numeric salary is entered', () =>{
                return request(app)
                    .put('/api/salary')
                    .send({salary: 'Hello'})
                    .expect(400);
            })
            it('called with a salary too low to fill envelopes returns error 400', async () => {
                const response = await request(app)
                    .get('/api/envelopes')
                    .send()
                    .expect(200);
                arrOfEnvelopes = response.body
                let sumOfRequiredMoney = 0;
                arrOfEnvelopes.forEach((env) => {
                    sumOfRequiredMoney += env.saveAmount;
                })
                
                return request(app)
                .put('/api/salary')
                .send({salary: sumOfRequiredMoney-1})
                .expect(400);
            })
        })
        describe('/api/non-envelope-savings', () => {
            it('it updates the non-envelope savings', async () => {
                const orignalNonEnvelopeSavings = await request(app)
                    .get('/api/non-envelope-savings')
                    .send()
                    .expect(200)
                    .then((response) => {
                        return response.body.nonEnvelopeSavings;
                    })
                
                return request(app)
                    .put('/api/non-envelope-savings')
                    .send({nonEnvelopeSavings: 50})
                    .expect(200)
                    .then((response) => {
                        console.log(response.body)
                        const newNonEnvelopeSavings = response.body.nonEnvelopeSavings;
                        expect(orignalNonEnvelopeSavings-50).to.be.equal(newNonEnvelopeSavings); 
                    })
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