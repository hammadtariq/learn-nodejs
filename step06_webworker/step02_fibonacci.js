var Worker = require('webworker-threads').Worker;
var http = require('http');

// (function spinForever () {
//   setImmediate(spinForever);
// })();

// var fibo = new Worker(function() {
//     postMessage("I'm working before postMessage('ali').");
//     function fibo (n) {
//       return n > 1 ? fibo(n - 1) + fibo(n - 2) : 1;
//     }
//     this.onmessage = function (event) {
//         console.log("Worker said1 : " + event.data);
//         postMessage("hi ",fibo(event.data));
//         console.log("Worker said2 : " + event.data);
//     }
//   });

//   fibo.onmessage = function (event) {
//     res.end('fib(40) = ' + event.data);
//   };
//   fibo.postMessage(40);


// a CPU-bound task that takes quite a while to complete and that blocks the event loop making it spin slowly and clumsily. The point is simply to show that you can't put a job like that in the event loop because Node will stop performing properly when its event loop can't spin fast and freely due to a callback/listener/setImmediate()ed function that's blocking.

// function fibo (n) {
//   return n > 1 ? fibo(n - 1) + fibo(n - 2) : 1;
// }
 
// (function fiboLoop () {
//   process.stdout.write(fibo(35).toString());
//   setImmediate(fiboLoop);
// })();
 
// (function spinForever () {
//   setImmediate(spinForever);
// })();


// The program below uses webworker-threads to run the fibonacci(35) calls in a background thread, so Node's event loop isn't blocked at all and can spin freely again at full speed:

// function fibo (n) {
//   return n > 1 ? fibo(n - 1) + fibo(n - 2) : 1;
// }
 
// function cb (err, data) {
//   process.stdout.write(data);
//   this.eval('fibo(35)', cb);
// }
 
// var thread= require('webworker-threads').create();
 
// thread.eval(fibo).eval('fibo(35)', cb);
 
// (function spinForever () {
//   process.stdout.write(".");
//   setImmediate(spinForever);
// })();



// This example is almost identical to the one above, only that it creates 5 threads instead of one, each running a fibonacci(35) in parallel and in parallel too with Node's event loop that keeps spinning happily at full speed in its own thread:

// function fibo (n) {
//   return n > 1 ? fibo(n - 1) + fibo(n - 2) : 1;
// }
 
// function cb (err, data) {
//   process.stdout.write(" ["+ this.id+ "]"+ data);
//   this.eval('fibo(35)', cb);
// }
 
// var Threads= require('webworker-threads');
 
// Threads.create().eval(fibo).eval('fibo(35)', cb);
// Threads.create().eval(fibo).eval('fibo(35)', cb);
// Threads.create().eval(fibo).eval('fibo(35)', cb);
// Threads.create().eval(fibo).eval('fibo(35)', cb);
// Threads.create().eval(fibo).eval('fibo(35)', cb);
 
// (function spinForever () {
//   setImmediate(spinForever);
// })();


//  The next one asks webworker-threads to create a pool of 10 background threads, instead of creating them manually one by one

function fibo (n) {
  return n > 1 ? fibo(n - 1) + fibo(n - 2) : 1;
}
 
var numThreads= 10;
var threadPool= require('webworker-threads').createPool(numThreads).all.eval(fibo);
 
threadPool.all.eval('fibo(35)', function cb (err, data) {
  process.stdout.write(" ["+ this.id+ "]"+ data);
  this.eval('fibo(35)', cb);
});
 
(function spinForever () {
  setImmediate(spinForever);
})();

http.createServer(function (req,res) {
    res.end("Hello worker");
}).listen(3000);
console.log("server is listening on port 3000")