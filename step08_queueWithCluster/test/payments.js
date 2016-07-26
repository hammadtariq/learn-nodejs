"use strict";

const request = require('supertest');  
const app = require('../app');  
const api = request(app);
const bodyParser = require('body-parser');

const test = require('tape');

let redisConfig;  
if (process.env.NODE_ENV === 'production') {  
  redisConfig = {
    redis: {
      port: process.env.REDIS_PORT,
      host: process.env.REDIS_HOST,
      auth: process.env.REDIS_PASS,
      options: {
        no_ready_check: false
      }
    }
  };
} else {
  redisConfig = {};
}

const kue = require('kue');  
const queue = kue.createQueue(redisConfig);  
queue.watchStuckJobs(1000 * 10);


const dummyOrder = {  
  // This job property lets you make better use of the kue UI — keep reading for more
  title: 'Order #4kSvjL_Qx',
  paymentToken: '4kSvjL_Qx',
  orderID: '1a2b3c4',
  received: true,
  receivedAt: new Date('December 24, 2015 23:59:59'),
  createdAt: new Date('December 24, 2015 23:58:59'),
  productID: '5d6e6f',
  customer: {
    firstName: 'A',
    lastName: 'Person',
    email: 'example@example.com',
    address: '1234 somewhere lane, ? USA 12345'
  }
};


test('Receiving and processing payments', t => {  
  api
    .post('/')
    .expect('Content-Type', /json/)
    .expect(200)
    .type('json')
    .send(dummyOrder)
    .end((err, res) => {
        console.log("res body: ",res.body)
        const order = res.body.order

        // Check for response body
        t.ok(res.body, 'Should respond with a body');

        // Check for response meta properties
        t.equals(res.body.success, true, 'The success property should be true');
        t.equals(res.body.error, null, 'The error property should be null');
        t.ok(res.body.message, 'Should have a message property');

        // Check to see if the order is intact
        t.equals(order.received, true, 'Should have been received');
        t.equals(order.orderID, dummyOrder.orderID, 'Order ID should be the same');
        t.equals(order.paymentToken, dummyOrder.paymentToken, 'Payment token should be the same');
        t.equals(order.productID, dummyOrder.productID, 'Product ID should be the same');
        t.end();
    });
});


test('Creating payments and processing items with the queue', t => {  
  // put kue into test mode
  queue.testMode.enter();

  queue.createJob('payment', dummyOrder).save();
  queue.createJob('email', dummyOrder).save();

  t.equal(queue.testMode.jobs.length, 2, 'There should be two jobs');
  t.equal(queue.testMode.jobs[0].type, 'payment', 'The jobs should be of type payment');
  t.equal(queue.testMode.jobs[0].data, dummyOrder, 'The job data should be intact');

  // Clear and exit test mode
  queue.testMode.clear();
  queue.testMode.exit()
  t.end();
});