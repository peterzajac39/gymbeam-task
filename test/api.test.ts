import request from 'supertest';
import app from '../src/app';

const basicBody = {
    "products": ["product-1", "product-2", "product-5"],
    "start": {
        "x": 0,
        "y": 100,
        "z": 0
    }
};

const invalidBody = {
    "products": "product-1, product-2",
    "start": {
        "x": 0,
        "y": 100,
        "z": 0
    }
};

const basicResponse = {
    "pickingOrder": [
        {
            "productId": "product-2",
            "positionId": "position-241"
        },
        {
            "productId": "product-1",
            "positionId": "position-31"
        },
        {
            "productId": "product-5",
            "positionId": "position-216"
        }
    ],
    "distance": 127
};

describe('GET path basic request', () => {
    it('responds with expected basicResponse', (done) => {
      request(app)
        .get('/getPath')
        .set('Accept', 'application/json')
        .send(basicBody)
        .expect('Content-Type', /json/)
        .expect(200, basicResponse, done);
    });
  });
  
  describe('Get path Wrong input', () => {
    it('responds with expected basicResponse', (done) => {
      request(app)
        .get('/getPath')
        .set('Accept', 'application/json')
        .send(invalidBody)
        .expect('Content-Type', /json/)
        .expect(400, done);
    });
  });
  