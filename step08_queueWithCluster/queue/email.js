var cluster         = require('cluster');
var kue             = require('kue');


var jobs = kue.createQueue();
var max_workers     = 3;


function test() {

    var job = jobs.create('email', {
        name:'email job '+Math.round(Math.random()*10),
        title: 'welcome email for tj'
        , to: 'tj@learnboost.com'
        , template: 'welcome-email'
    })
    .on('complete', function (){
        console.log('Job', job.id, 'with name', job.data.name, 'is    done');
    })
    .on('failed', function (){
        console.log('Job', job.id, 'with name', job.data.name, 'has  failed');
    })
    .save( function(err){
        if( !err){} console.log( "no error");
    });

    if( cluster.isMaster ) {

        for (var i = 0; i < max_workers; i++) {
            cluster.fork();
            console.log("forked -> "+i);
        }

    } else {
        // Process up to 3 jobs concurrently   
        jobs.process('email',3, function(jobs, done){

            console.log('Job', jobs.id, 'is done');
            done && done();

        });
    }

}

setInterval(test,3000);