const assert = require('assert');
const app = require('../server/app');
const request = require('supertest');
const expect = require('chai').expect;

describe('router', () => {
    describe('GET', () => {
        describe('/', () => {
            it('returns hello world!', async () =>{
                const expected = "Hello world!";

                const response = await request(app).
                get('/')
                .send();
                
                
                assert.strictEqual(response.text, expected);
                 
            })
        })
    })
})