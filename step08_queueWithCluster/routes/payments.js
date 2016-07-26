'use strict';

const router = require('express').Router();
const api = require('./../queue/payments');

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

router.post('/', (req, res, next) => {  
  // our future code will go here

  let data = req.body || "hammadtariq65@gmail.com";
  console.log("in post method body: ",req.body)
  api.create(data,(err)=>{
      console.log("i am callabck of done");
      console.log("i am error: ", err);
      if(!err){
          res.json({"success":true,"message":"i am a message from /", order:data, error:null})
      }else{
          res.json({"success":false,"message":"some error occured", error:err})
      }
  })
});

// router('/events')
// .all(function(req, res, next) {
//   // runs for all HTTP verbs first
//   // think of it as route specific middleware!
//   res.json({status:true,message:"success from events all"});
// })
// .get(function(req, res, next) {
//   res.json({status:true,message:"success from events get"});
// })
// .post(function(req, res, next) {
//   // maybe add a new event...
//   res.json({status:true,message:"success from events post"});
  
// });

router.get('/',(req,res)=>{
    console.log("in get method")
    res.write('WOW at home')
    res.end();
})

module.exports = router; 