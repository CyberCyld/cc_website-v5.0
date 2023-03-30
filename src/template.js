const express = require('express');
const router = express.Router();
const { checkLogin } = require('./verify');
const db = require('./dataBase');
const fetch = require("isomorphic-fetch");
const passport = require('passport');
const session = require('express-session');
const razorpay = require('razorpay');
const config = require('./config');
const multer = require('multer');
const fs = require('fs');

//for payment

//for payment end
//for facebook 
const FacebookStrategy = require('passport-facebook').Strategy;
router.get('/', checkLogin, (req, res) => {
  // Retrieve plans from the database
  db.query('SELECT * FROM plans', (error, planResults) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving plans' });
    } else {
      // Retrieve videos from the database
      db.query('SELECT `id`, `title`, `embed_link` FROM `videos` WHERE 1', (error, videoResults) => {
        if (error) {
          console.error(error);
          res.status(500).json({ message: 'Error retrieving videos' });
        } else {
          // Check if the user is logged in and has a name and email
          if (req.name && req.email) {
            // Render the index template with the user's name, email, plans, and videos
            res.render('index', {
              name: req.name,
              email: req.email,
              plans: planResults,
              videos: videoResults
            });
          } else {
            // Render the index template with plans and videos
            res.render('index', { plans: planResults, videos: videoResults });
          }
        }
      });
    }
  });
});

  

//blog Routes get blog Detail//
router.get('/blog', (req, res) => {
  const query = 'SELECT * FROM `blog` WHERE `status` = "Active"';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving blog posts from database: ' + err.stack);
      res.status(500).send('Error retrieving blog posts from database');
    } else {
      const blogPosts = results.map(post => {
        return {
          id: post.id,
          head: post.head,
          content: post.content,
          type: post.type,
          img: post.img.toString('base64'),
          date: post.date.toISOString().slice(0, 10)
        };
      });
      
      res.render('blog', { blogPosts });
    }
  });
});
//view blog Detail//
router.get('/viewdetail/:id', (req, res) => {
  const id = req.params.id;
  const query = `SELECT * FROM \`blog\` WHERE \`status\` = 'Active' AND id='${id}' LIMIT 4;`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving blog post from database: ' + err.stack);
      res.status(500).send('Error retrieving blog post from database');
    } else if (results.length === 0) {
      console.error(`No blog post found with id: ${id}`);
      res.status(404).send('Blog post not found');
    } else {
      const post = results[0];
      const blogPost = {
        id: post.id,
        head: post.head,
        content: post.content,
        type: post.type,
        img: post.img.toString('base64'),
        date: post.date.toISOString().slice(0, 10)
      };

      res.render('viewdetail', { blogPost });
    }
  });
});



// Set storage engine for Multer
const path = require('path');
const storage = multer.diskStorage({
    destination: './public/images/',
    filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
  // Initialize Multer upload object
  const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function(req, file, cb) {
      checkFileType(file, cb);
    }
  }).single('img');
  
  // Check file type
  function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
  
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images only!');
    }
  }
  router.post('/blog', (req, res) => {
    upload(req, res, (err) => {
      if (err) {
        console.error('Error uploading image: ' + err.stack);
        res.status(500).send('Error uploading image');
      } else {
        const { head, content, type , status } = req.body;
        const img = fs.readFileSync(req.file.path);
  
        const query = 'INSERT INTO `blog` (`head`, `content`,`type`, `img`, `date`, `status`) VALUES (?, ?, ?, ?, NOW(), "Active")';
        const values = [head, content, type, img, status];
  
        db.query(query, values, (err, results) => {
          if (err) {
            console.error('Error creating blog post in database: ' + err.stack);
            res.status(500).send('Error creating blog post in database');
          } else {
            const newPost = {
              id: results.insertId,
              head: head,
              content: content,
              type: type,
              img: img.toString('base64'),
              date: new Date().toISOString().slice(0, 10),
              status: status
            };
            
            // Redirect to the admin dashboard
            res.redirect('/admindashboard');
          }
        });
      }
    });
  });
  
  //  request to create blog post with image
  router.get('/admindashboard', checkLogin, (req, res) => {
    db.query('SELECT * FROM users', (err, result) => {
      if (err) throw err;
      const data = result;
      db.query('SELECT * FROM blog WHERE status = "Active" ORDER BY id DESC;', (err, result) => {
        if (err) throw err;
        const blog = result.map((row) => {
          return {
            id: row.id,
            head: row.head, 
            content: row.content,
            img: `data:image/jpeg;base64,${row.img.toString('base64')}`,
            date: row.date,
            status: row.status,
          };
        });
        if (req.name && req.email && req.active == 1) {
          const firstname = req.name.split(' ')[0];
          res.render('admindashboard', {
            firstname,
            name: req.name,
            email: req.email,
            valueData: data,
            valueAata: blog,
           // imgFormat: imgFormat,
          });
        } else {
          res.status(302).redirect('/admin');
        }
      });
    });
  });
    
router.get('/blog', (req, res)=>{
    res.render('blog');
})
const nodemailer = require('nodemailer');

router.get('/proceed/:id', checkLogin, (req, res) => {
  const subscriptionId = req.params.id;
  db.query('SELECT name, email, username FROM users WHERE username = ?', [req.username], (err, usersResult) => {
    if (err) throw err;
    const userData = usersResult[0];
    db.query('SELECT name, price FROM plans WHERE id = ?', [subscriptionId], (err, plansResult) => {
      if (err) throw err;
      const planData = plansResult[0];
      if (req.name && req.email && req.active == 1) {
        const firstname = req.name.split(' ')[0];
        db.query('INSERT INTO subscriptions (username, name, email, plan_name, price, payment_status, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [userData.username, userData.name, userData.email, planData.name, planData.price, 'pending', new Date(), new Date()], (err, result) => {
          if (err) throw err;
          console.log('Subscription created successfully');
          
          // Send email to user
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'shaktitripathi12298@gmail.com',
              pass: 'umvxwtngruchloan'
            }
          });
          
          const mailOptions = {
            from: 'shaktitripathi12298@gmail.com',
            to: userData.email,
            subject: 'Subscription Confirmation and Invoice',
            html: `
            <!DOCTYPE html>
            <html>
              <head>
                <title>Subscription Confirmation and Invoice</title>
                <!-- Bootstrap CSS -->
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
                <!-- Custom CSS -->
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    font-size: 14px;
                    line-height: 1.5;
                    margin: 0;
                    padding: 0;
                  }
                  
                  .container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                  }
                  
                  table {
                    border-collapse: collapse;
                    width: 100%;
                  }
                  
                  th, td {
                    padding: 8px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                  }
                  
                  th {
                    background-color: #f2f2f2;
                  }
                  
                  tfoot td {
                    font-weight: bold;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <p>Dear ${userData.name},</p>
                  <p>Thank you for subscribing to ${planData.name}. Your subscription will be activated soon.</p>
                  <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>${planData.name} Subscription</td>
                      <td>$${planData.price}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td>Total</td>
                      <td>${planData.price}</td>
                    </tr>
                  </tfoot>
                </table>
              <p>Please find attached the invoice for your subscription.</p>
              <p>Thank you again for your business!</p>
            `,
            // attachments: [
            //   {
            //     filename: 'invoice.pdf',
            //     path: '/path/to/invoice.pdf'
            //   }
            // ]
          };
          
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
          
          res.redirect('/payment');
        });
      } else {
        res.status(302).redirect('/register');
      }
    });
  });
});
//updated proceed//
router.get('/payment', (req, res)=>{
  const subscriptionId = req.params.id;
  db.query('SELECT price FROM subscriptions WHERE username = ? AND payment_status = ?', [req.username, 'pending'], (err, result) => {
    if (err) throw err;
    const subscriptionData = result[0];
    res.render('payment', { subscriptionData: subscriptionData });
  });
});

router.post('/payment', (req, res)=>{
  const subscriptionId = req.params.id;
  const razorpay_payment_id = req.body.razorpay_payment_id;
  db.query('UPDATE subscriptions SET payment_status = ?, payment_date = ? WHERE username = ? AND payment_status = ?', ['success', new Date(), req.username, 'pending'], (err, result) => {
    if (err) throw err;
    res.redirect('/success');
  });
});

router.get('/success', (req, res)=>{
 // const subscriptionId = req.params.id;
  db.query('SELECT username, email, name FROM subscriptions WHERE username = ? AND payment_status = ?', [req.username, 'success'], (err, result) => {
    if (err) throw err;
    const subscriptionData = result[0];
    res.render('success', { subscriptionData: subscriptionData });
  });
});


//End Blog Routes//
//carrier Page//
router.get('/tables', checkLogin, (req, res) => {
  if (!req.name || !req.email) {
    res.render('login');
  } else {
    const blogSql = 'SELECT `id`, `head`, `content`, `type`, `img`, `date`, `status` FROM `blog` WHERE `status` = 1';
    const jobSql = 'SELECT `id`, `job_title`, `job_description`, `job_location`, `job_type`, `salary`, `posted_date`, `application_deadline` FROM `job_posting` WHERE 1';
    const videoSql = 'SELECT `id`, `title`, `embed_link` FROM `videos` WHERE 1';

    db.query(blogSql, (err, blogResult) => {
      if (err) throw err;

      db.query(jobSql, (err, jobResult) => {
        if (err) throw err;

        db.query(videoSql, (err, videoResult) => {
          if (err) throw err;

          res.render('tables', { blogs: blogResult, jobs: jobResult, videos: videoResult });
        });
      });
    });
  }
});

//delete blog//
router.post('/delete/', checkLogin, (req, res) => {
  const blogId = req.body.id;
  const deleteSql = 'DELETE FROM `blog` WHERE `id` = ?';

  db.query(deleteSql, [blogId], (err, result) => {
    if (err) throw err;

    res.redirect('/tables');
  });
});
//Delete Jobs//
router.get('/deletejobs/:id', checkLogin, (req, res) => {
  const blogId = parseInt(req.params.id);
  const deleteSql = `DELETE FROM \`job_posting\` WHERE \`id\` = '${blogId}'`;
  db.query(deleteSql, [blogId], (err, result) => {
    if (err) throw err;

    res.redirect('/tables');
  });
});
//block user //
router.get('/blockusers/:username', checkLogin, (req, res) => {
  const username = req.params.username;
  const deleteSql = `UPDATE users SET active = '0' WHERE username = ?`;

  db.query(deleteSql, [username], (err, result) => {
    if (err) throw err;

    res.redirect('/admindashboard');
  });
});
router.get('/unblockusers/:username', checkLogin, (req, res) => {
  const username = req.params.username;
  const deleteSql = `UPDATE users SET active = '1' WHERE username = ?`;

  db.query(deleteSql, [username], (err, result) => {
    if (err) throw err;

    res.redirect('/admindashboard');
  });
});

router.get('/terms-of-use', (req, res)=>{
    res.render('terms-of-use');
})
router.get('/policy', (req, res)=>{
    res.render('policy');
})
// router.get('/subscriptions/:id', (req, res)=>{
// //  const db = require('../database'); // assuming the database module is imported here
//   const subscriptionId = req.params.id;
  
//   db.query('SELECT `id`, `username`, `name`, `price`, `itemone`, `itemtwo`, `itemthree`, `itemfour`, `itemfive`, `itemsix`, `itemseven`, `itemeight`, `itemnine`, `date` FROM `plans` WHERE `id` = ?', [subscriptionId], (error, results, fields) => {
//       if (error) throw error;
//       if (results.length === 0) {
//           res.status(404).send('Subscription not found');
//       } else {
//           res.render('subscriptions', { subscription: results[0] });
//       }
//   });
// });
router.get('/subscriptions/:id', checkLogin, (req, res) => {
  const subscriptionId = req.params.id;
  db.query('SELECT * FROM users where username="$username"', (err, usersResult) => {
    if (err) throw err;
    const userData = usersResult;
    db.query('SELECT * FROM `plans` WHERE `id` = ?', [subscriptionId], (err, plansResult) => {
      if (err) throw err;
      const planData = plansResult.map((row) => {
        return {
          id: row.id,
          name: row.name, 
          itemone: row.itemone, 
          itemtwo: row.itemtwo, 
          itemthree: row.itemthree, 
          itemfour: row.itemfour, 
          itemfive: row.itemfive, 
          itemsix: row.itemsix, 
          price: row.price,
          date: row.date,
        };
      });
      if (req.name && req.email && req.active == 1) {
        const firstname = req.name.split(' ')[0];
        res.render('subscriptions', {
          firstname,
          name: req.name,
          email: req.email,
          userData: userData,
          planData: planData,
        });
      } else {
        res.status(302).redirect('/register');
      }
    });
  });
});
//proceed//
router.get('/proceed/:id', checkLogin, (req, res) => {
  const subscriptionId = req.params.id;
  db.query('SELECT name, email, username FROM users WHERE username = ?', [req.username], (err, usersResult) => {
    if (err) throw err;
    const userData = usersResult[0];
    db.query('SELECT name, price FROM plans WHERE id = ?', [subscriptionId], (err, plansResult) => {
      if (err) throw err;
      const planData = plansResult[0];
      if (req.name && req.email && req.active == 1) {
        const firstname = req.name.split(' ')[0];
        res.render('payment', {
          firstname,
          name: req.name,
          email: req.email,
          userData: userData,
          planData: planData,
        });
        db.query('INSERT INTO subscriptions (username, name, email, plan_name, price, payment_status, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [userData.username, userData.name, userData.email, planData.name, planData.price, 'pending', new Date(), new Date()], (err, result) => {
          if (err) throw err;
          console.log('Subscription created successfully');
        });
      } else {
        res.status(302).redirect('/register');
      }
    });
  });
});







 router.get('/tables', checkLogin, (req, res) => {
  if (!req.name || !req.email) {
    res.render('login');
  } else {
    const blogSql = 'SELECT `id`, `head`, `content`, `type`, `img`, `date`, `status` FROM `blog` WHERE `status` = 1';
    const jobSql = 'SELECT `id`, `job_title`, `job_description`, `job_location`, `job_type`, `salary`, `posted_date`, `application_deadline` FROM `job_posting` WHERE 1';

    db.query(blogSql, (err, blogResult) => {
      if (err) throw err;

      db.query(jobSql, (err, jobResult) => {
        if (err) throw err;

        res.render('tables', { blogs: blogResult, jobs: jobResult });
      });
    });
  }
});
router.get('/contacts', (req, res)=>{
    res.render('contacts');
})

//end carrier routes//
router.get('/login', checkLogin, (req, res) => {
    if (!req.name || !req.email) { 
        res.render('login');
    } else 
     if (!req.name || !req.email || req.active != 1) {
        res.status(302).redirect('/register');
    } else  {
        res.status(302).redirect('/home')
    }
})

router.get('/register', checkLogin, (req, res) => {
    if (!req.name || !req.email || req.active != 1) {
        res.render('register', {
            email: req.email
        });
    } else {
        res.status(302).redirect('/home')
    }
})

//admin login register
router.get('/admin', checkLogin, (req, res) => {
    if (!req.name || !req.email) {
        res.render('admin');
    } else if (!req.name || !req.email || req.active != 1) {
        res.status(302).redirect('/adminreg');
    } else {
        res.status(302).redirect('/admindashboard')
    }
})

router.get('/adminreg', checkLogin, (req, res) => {
    if (!req.name || !req.email || req.active != 1) {
        res.render('adminreg', {
            email: req.email
        });
    } else {
        res.status(302).redirect('/admindashboard')
    }
})
router.get('/admindashboard', checkLogin, (req, res) => {

    db.query('SELECT * FROM users', (err, result) => {
        if (err) throw err
           let data = result;
           db.query('SELECT * FROM blog where status="Active"  ORDER BY id DESC', (err, result) => {
            if (err) throw err
            const blog = result
    if (req.name && req.email && req.active == 1) {
        let firstname = req.name.split(' ')
        firstname = firstname[0]
        res.render('admindashboard', {
            firstname,
            name: req.name,
            email: req.email,
            valueData : data,
            valueAata :blog
        });
    } else {
        res.status(302).redirect('/admin')
    }
});
});  
})


//edit//
router.get('/delete/:id', checkLogin, (req, res) => {
          const blogId = parseInt(req.params.id);   
    if (req.name && req.email && req.active == 1) {
        db.query(`UPDATE  blog SET status='Delete' where id=${blogId}`, (err, result) => {
            if (err) throw err
               let deleteData = result; 
               if(deleteData){
                console.log('Record Deleted');
                res.redirect('/admindashboard');
               }
            }); 
    } else {
        res.status(302).redirect('/admin')
    } 
})

//post
router.post('/admindashboard',checkLogin, function(req, res) {
    const { head, content, img}  = req.body;
    var sql = `INSERT INTO blog (head, content, img, date , staus) VALUES ("${head}", "${content}", "${img}", NOW() ,"Active")`;
    db.query(sql, function(err, result) {
      if (err) throw err;
      console.log('record inserted');
      res.redirect('/admindashboard');
      
    });
  });

//end of admin routes

router.get('/recovery', checkLogin, (req, res) => {
    if (!req.name || !req.email) {
        res.render('recovery');
    } else {
        res.status(302).redirect('/home')
    }
})

router.get('/home', checkLogin, (req, res) => {
    if (req.name && req.email && req.active == 1) {
        let firstname = req.name.split(' ')
        firstname = firstname[0]
        res.render('home', {
            firstname,
            name: req.name,
            email: req.email
        });
    } else {
        res.status(302).redirect('/login')
    }
})

router.get('/dashboard', checkLogin, (req, res) => {
    if (req.name && req.email && req.active == 1) {
        res.render('dashboard', {
            userID: req.username,
            name: req.name,
            email: req.email,
            active: function () {
                if (req.active == 1) {
                    return 'active'
                } else {
                    return 'not active'
                }
            }
        });
    } else {
        res.status(302).redirect('/login')
    }
})

router.get('/setting', checkLogin, (req, res) => {
    if (req.name && req.email && req.active == 1) {
        res.render('setting', {
            userID: req.username,
            name: req.name,
            email: req.email
        });
    } else {
        res.status(302).redirect('/login')
    }
})
 //goole signup regristation

//for facebook//
router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/dashboard');
  }
);
router.post('/login',
  passport.authenticate('local', { successRedirect: '/dashboard', failureRedirect: '/login' })
);

//For Plan Posting//
router.post('/plans', (req, res) => {
    const { name, price, itemone, itemtwo, itemthree, itemfour, itemfive, itemsix, itemseven, itemeight, itemnine } = req.body;
  
    const plan = {
      name,
      price,
      itemone,
      itemtwo,
      itemthree,
      itemfour,
      itemfive,
      itemsix,
      itemseven,
      itemeight,
      itemnine
    };
  
    db.query('INSERT INTO plans SET ?', plan, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: 'Error creating plan' });
          } else {
            res.status(200).json({ message: 'Plan successfully created!' });
          }
    });
  });
// Job Posting//
router.post('/job_postings', (req, res) => {
  const jobTitle = req.body.job_title;
  const jobDescription = req.body.job_description;
  const jobLocation = req.body.job_location;
  const jobType = req.body.job_type;
  const salary = req.body.salary;
  const postedDate = new Date(req.body.posted_date); // parse the input as a Date object
  const applicationDeadline = req.body.application_deadline;

  // validate that the posted_date input is a valid date
  if (isNaN(postedDate.getTime())) {
    console.error('Invalid posted_date input:', req.body.posted_date);
    res.status(400).send('Invalid posted_date input'); // return a 400 Bad Request response
    return;
  }

  // format the posted_date as YYYY-MM-DD
  const formattedPostedDate = postedDate.toISOString().split('T')[0];

  const newJobPosting = {
    job_title: jobTitle,
    job_description: jobDescription,
    job_location: jobLocation,
    job_type: jobType,
    salary: salary,
    posted_date: formattedPostedDate,
    application_deadline: applicationDeadline
  };

  db.query('INSERT INTO job_posting SET ?', newJobPosting, (err, result) => {
    if (err) {
      console.error('Error inserting new job posting: ', err);
      res.status(500).send('Error inserting new job posting');
    } else {
      console.log('New job posting added!');
      res.redirect('/admindashboard');
    }
  });
});

router.get('/careers', (req, res) => {
  db.query('SELECT * FROM job_posting', (err, results) => {
  if (err) {
  console.error('Error retrieving job postings: ', err);
  res.status(500).send('Error retrieving job postings');
  } else {
  console.log('Job postings retrieved!');
  res.render('careers', { jobPostings: results });
  }
  });
  });
// For posting Video
router.post('/videos', (req, res) => {
  // Extract the video title and embed link from the request body
  const { title, embedLink } = req.body;

  // Insert the video into the database
  db.query('INSERT INTO videos (title, embed_link) VALUES (?, ?)', [title, embedLink], (error, results, fields) => {
      if (error) throw error;
      res.redirect('/tables');
  });
});
// router.get('/videos', (req, res) => {
//   // Retrieve all videos from the database
//   db.query('SELECT * FROM videos', (error, results, fields) => {
//       if (error) throw error;
//       // Render the videos template with the list of videos
//       res.render('index', { videos: results });
//   });
// });

// delete videos
router.get('/videos/:id', checkLogin, (req, res) => {
  const blogId = parseInt(req.params.id);
  const deleteSql = `DELETE FROM \`videos\` WHERE \`id\` = '${blogId}'`;
  db.query(deleteSql, [blogId], (err, result) => {
    if (err) throw err;

    res.redirect('/tables');
  });
});



module.exports = router;