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


const cluster = require('cluster');
//const jobs = kue.createQueue();
const kue = require('kue');  
const queue = kue.createQueue(redisConfig);  
queue.watchStuckJobs(1000 * 10);

const max_workers     = 3;

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

function testEmailSend(data,done) {

    queue.create('email', data)
      .priority('medium')
      .attempts(5)
      .backoff(true)
      .removeOnComplete(false)
      .save(err => {
          if( !err){} console.log( "no error");
      });

}

    if( cluster.isMaster ) {

        for (var i = 0; i < max_workers; i++) {
            cluster.fork();
            console.log("forked -> "+i);
        }

    } else {

        
    }

    queue.process('email', function(job, done){
            console.log('Job', job.id, 'is done');
            done && done();
        });

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


    // Process up to 10 jobs concurrently
    queue.process('test', 10, function(job, done){  
      // other processing work here
      // ...
      // ...
        email(job.data, done);
        console.log('Job', job.id, 'is done');
      // Call done when finished
      done && done();;
    });


//setInterval(test,3000);


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
    testEmailSend(data,done);
  }
};