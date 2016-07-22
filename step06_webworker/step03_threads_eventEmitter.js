var http = require('http');
var thread= require('webworker-threads').create();
thread.load(__dirname + '/quickIntro.js');
 
/*
  This is the code that's .load()ed into the child/background thread:
  
  function fibo (n) {
    return n > 1 ? fibo(n - 1) + fibo(n - 2) : 1;
  }
 
  thread.on('giveMeTheFibo', function onGiveMeTheFibo (data) {
    this.emit('theFiboIs', fibo(+data)); //Emits 'theFiboIs' in the parent/main thread.
  });
  
*/
 
//Emit 'giveMeTheFibo' in the child/background thread. 
thread.emit('giveMeTheFibo', 35);
 
//Listener for the 'theFiboIs' events emitted by the child/background thread. 
thread.on('theFiboIs', function cb (data) {
  process.stdout.write(data);
  this.emit('giveMeTheFibo', 35);
});

(function spinForever () {
  setImmediate(spinForever);
})();


http.createServer(function (req,res) {
    res.end("Hello worker");
}).listen(3000);
console.log("server is listening on port 3000")