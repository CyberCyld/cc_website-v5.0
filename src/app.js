const express = require('express');
const cors = require('cors');
const path = require('path');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
require("dotenv").config({path:`${__dirname}/../.env`});
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
//body parser middleware gi
const { urlencoded } = require('express');
app.use(express.json());
app.use(urlencoded({extended: false}));
app.set('views', path.join(__dirname, './../views'));
app.engine('handlebars', exphbs({ defaultLayout: 'main' , partialsDir: __dirname + '../partials' }));
app.set('view engine', 'handlebars');
app.use("/public",express.static(__dirname + './../public'))
//for payment
const Razorpay = require('razorpay');
const razorpay = new Razorpay({
  key_id: 'rzp_test_Zv5p3iZ3oibhjM',
  key_secret: 'yMSxN57eEkfRHE1zJrd9oNn3'
});

//routes
app.use('/', require('./template'));
app.use("/user", require('./user') );
app.post('/pay', (req, res) => {
    const { amount, currency, name, description, image, order_id } = req.body;
  
    const options = {
      amount: 12000,
      currency: currency,
      receipt: 'receipt#1',
      payment_capture: 1
    };
  
    razorpay.orders.create(options, (err, order) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.render('dashboard', {
          key_id: razorpay.key_id,
          amount: order.amount,
          currency: order.currency,
          name:'CyberCyld',
          description: 'A Digital Security Plateform',
          image: 'https://cybercyld.com/public/logo2.png',
          order_id: order.id
        });
      }
    });
  });
app.use("/*", (req, res) => {
    res.status(404).send(`<br><br><h1 style="text-align: center;">404 || content not found</h1>`);
    
});
const PORT = process.env.PORT || 3000 ; 
app.listen(PORT, () => { console.log(`server started ar PORT number ${PORT}`)})