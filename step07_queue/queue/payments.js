'use strict';

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

queue.on('ready', () => {  
  console.info('Queue is ready!');
});

queue.on('error', (err) => {  
  console.error('There was an error in the main queue!');
  console.error(err);
  console.error(err.stack);
});


function createPayment(data, done) {  
  queue.create('payment', data)
    .priority('critical')
    .attempts(8)
    .backoff(true)
    .removeOnComplete(false)
    .save(err => {
      if (err) {
        console.error(err);
        done(err);
      }
      if (!err) {
        done();
      }
    });
}

function sendEmail(data, done) {  
  queue.create('email', data)
    .priority('medium')
    .attempts(5)
    .backoff(true)
    .removeOnComplete(false)
    .save(err => {
      if (err) {
        console.error("from queue: ",err);
        done(err);
      }
      if (!err) {
        done();
      }
    });
}



// Process up to 20 jobs concurrently
queue.process('payment', 20, function(job, done){  
  // other processing work here
  // ...
  // ...
    email(job.data, done);
    console.log('Job', job.id, 'is done');
  // Call done when finished
  done && done();;
});


// Process up to 20 jobs concurrently
queue.process('email', 10, function(job, done){  
  // other processing work here
  // ...
  // ...
    email(job.data, done);
    console.log('Job', job.id, 'is done');
  // Call done when finished
  done && done();;
});

function email(address, done) {
  if(typeof(address) == "string" && !isValidEmail(address)) {
    //done('invalid to address') is possible but discouraged
    console.log("in error of email")
    return done(new Error('invalid to address'));
  }
    console.log("in success of email")
    return done('valid address');
  // email send stuff...
}

function isValidEmail(email){
    console.log("i am email: ",email)
    return email && email.match(/.com/g) ? true : false;
}

module.exports = {  
  create: (data, done) => {
    createPayment(data, done);
    sendEmail(data, done);
  }
};