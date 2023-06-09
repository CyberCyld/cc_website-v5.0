const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const uuid = require('uuid');
const shajs = require('sha.js');
const db = require('./dataBase');
const otp = require('./otp');
const { verifyToken, check } = require('./verify');
const router = express.Router();
const app = express();
app.use(cookieParser());
const path = require('path');
const moment = require('moment')
//for payment
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

//to prevent SQL injection && XSS attack through username, email, name
router.use((req, res, next) => {
    const { username, email, uname } = req.body;
    const cred = [username, email, uname];
    let valid = check(cred)
    if (valid) {
        next();
    } else {
        res.status(403).send({ msg: 'ERROR: only [ A-Za-z0-9{@_. -(){}[]!} ] can be used as username, email and name' })
    }
})

//password hashing
router.use((req, res, next) => {
    var { password, userOTP, newPassword } = req.body;

    const hash = (key) => {
        for (let i = 0; i < key.length; i++) {
            if (key[i] == "'" || key[i] == '"' || key[i] == "`") {
                if (key[i - 1] != "\\") {
                    var part1 = key.slice(0, i);
                    var part2 = key.slice(i, key.length);
                    part1 = part1 + '\\';
                    key = part1.concat(part2);
                }
            }
        }
        key = (new shajs.sha1().update(`${key}`).digest('hex'))
        return key;
    }

    if (password) {
        password = hash(password);
        req.body.password = password;
    }

    if (userOTP) {
        userOTP = hash(userOTP);
        req.body.userOTP = userOTP;
    }

    if (newPassword) {
        newPassword = hash(newPassword);
        req.body.newPassword = newPassword;
    }

    next();

})

router.get('/test', (req, res) => {
    res.json({ msg: "router working" })
    console.log(req.body);
})

router.post('/signup/', (req, res) => {
    const { username, email, password, uname } = req.body;
    if (username && email && password && uname) {
        try {
            
            let select = `SELECT USERNAME, active FROM users WHERE USERNAME= ?`;
            db.query(select, [username], (error, results, fields) => {
                if (error) {
                    return console.error(error.message);
                }
                if (!results[0]) {
                    var ID = uuid.v4();
                    function randomInt(max, min) {
                        var num = (Math.floor(Math.random() * (max - min)) + min);
                        return num;
                    }
                    var OTP = randomInt(10000, 99999);
                    var today = new Date();
                    var OTP_timestamp = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
                    console.log(`Current time${OTP_timestamp}`);
                    otp(email, OTP)
                        .then((result) => {
                            OTP = (new shajs.sha1().update(`${OTP}`).digest('hex'))
                            db.promise().query(`INSERT INTO users VALUES(?, ?, ?, ?, ?, ?, ?, ? , ?, ?)`, [username, password, ID, email,'0', uname, OTP , OTP_timestamp,'','']);
                            // Mock user
                            const user = {
                                username: username,
                                ID: ID
                            }

                            jwt.sign({ user }, process.env.JWT_token, { expiresIn: '3600s' }, (err, token) => {
                                if (err) {
                                    res.json({ err });
                                }
                                res.cookie('authorization', `bearer ${token}`);
                                res.cookie('active', 0);
                                res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });
                                res.status(200).send({ msg: `account created!! welcome ${username}, please verify your OTP sent to your email` });
                            });

                        }).catch((err) => {
                            res.status(500).send({ msg: `please check your email ID` });
                            console.log(err);
                        });

                } else if (results[0].active === 0) {
                    var ID = uuid.v4();
                    function randomInt(max, min) {
                        var num = (Math.floor(Math.random() * (max - min)) + min);
                        return num;
                    }
                    var OTP = randomInt(10000, 99999);
                    var today = new Date();
                    var OTP_timestamp = (Math.floor(today.getTime() / 1000));

                    otp(email, OTP)
                        .then((result) => {
                            OTP = (new shajs.sha1().update(`${OTP}`).digest('hex'))
                            db.promise().query(`UPDATE users  SET username= ?, password= ?, ID= ?, active='0', name= ?, email= ?, OTP= ?, OTP_timestamp= ?, OTP_attempt='0', password_attempt='0' WHERE USERNAME= ?;`, [username, password, ID, uname, email, OTP, OTP_timestamp, username]);

                            // Mock user
                            const user = {
                                username: username,
                                ID: ID
                            }

                            jwt.sign({ user }, process.env.JWT_token, { expiresIn: '3600s' }, (err, token) => {
                                if (err) {
                                    res.json({ err });
                                }
                                res.cookie('authorization', `bearer ${token}`);
                                res.cookie('active', 0);
                                //res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });
                                res.status(200).send({ msg: `account created!! welcome ${username}, please verify your OTP sent to your email` });
                            });

                        }).catch((err) => {
                            res.status(500).send({ msg: `internal server error please contact with support team` });
                            console.log(err);
                        });
                }
                else {
                    res.status(403).send({ msg: "this username already exists, try another unique username" })
                }
            });

        }
        catch (err) {
            console.log(err);
        }
    } else {
        res.status(403).send({ msg: "empty username, password, email or name is not valid" })
    }
});

// REAL CODE//
// router.post('/otp/activate', verifyToken, (req, res) => {
//     const { userOTP } = req.body;
//     authData = req.data;
//     let select = `SELECT USERNAME, ID, OTP, OTP_timestamp, OTP_attempt FROM users WHERE USERNAME= ?`;
//     db.query(select, [authData.user.username], (error, results, fields) => {
//         if (error) {
//             return console.error(error.message);
//         }
//         var OTP_attempt = results[0].OTP_attempt;
//         var validTime   = moment(results[0].OTP_timestamp).add(2, 'hours').format("YYYY-MM-DD hh:mm:ss");;
//         var timeValid   =  moment(validTime).format("X")
//         console.log(validTime);
//         if (results[0].ID === authData.user.ID) {
//             if (userOTP) {
//                 if (OTP_attempt < 6) {
//                     var today = new Date();
//                     var OTP_timestamp = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
//                     var curTime = moment(OTP_timestamp).format("X");
                    
//                     if (timeValid >= curTime) { // 2 hours in seconds
//                         if (results[0].OTP == userOTP) {
//                             let select = `UPDATE users SET active='1', OTP=NULL, OTP_timestamp=NULL, OTP_attempt='0' WHERE username = ?;`;
//                             db.query(select, [authData.user.username], (error, results, fields) => {
//                                 if (error) {
//                                     return console.error(error.message);
//                                 }
//                                 res.cookie('active', 1);
//                                 res.send({ msg: "account activated!" })
//                             });
//                         } else {
//                             OTP_attempt++;
//                             let select = `UPDATE users  SET OTP_attempt= ? WHERE USERNAME= ?;`;
//                             db.query(select, [OTP_attempt, authData.user.username], (error, results, fields) => {
//                                 if (error) {
//                                     return console.error(error.message);
//                                 } if (OTP_attempt < 3) {
//                                     res.status(403).send({ msg: "wrong OTP" });
//                                 } else {
//                                     tries = 6 - OTP_attempt;
//                                     res.status(403).send({ msg: `wrong OTP, ${tries} tries left` });
//                                 }

//                             });
//                         }
//                     } else {
//                         res.status(403).send({ msg: "OTP expired" });
//                     }
//                 } else {
//                     res.status(403).send({ msg: "maximum OTP attempt limitation exceeded" });
//                 }
//             } else {
//                 res.status(403).send({ msg: "blank OTP field is not allowed, please enter your OTP" });
//             }
//         } else {
//             res.status(400).send({ msg: "something went wrong, try to relogin with userID and password after logout" });
//         }

//     });
// }); 
// router.post('/otp/activate', verifyToken, (req, res) => {
//     const { userOTP } = req.body;
//     authData = req.data;
//     let select = `SELECT USERNAME, ID, OTP, OTP_timestamp, OTP_attempt FROM users WHERE USERNAME= ?`;
//     db.query(select, [authData.user.username], (error, results, fields) => {
//         if (error) {
//             return console.error(error.message);
//         }
//         var OTP_attempt = results[0].OTP_attempt;
//         if (results[0].ID === authData.user.ID) {
//             if (userOTP) {
//                 if (OTP_attempt < 6) {
//                     var today = new Date();
//                     if (((Math.floor(today.getTime() / 1000)) - results[0].OTP_timestamp) < 7200) { // 1 hours in seconds
//                         let newOTP = req.cookies.newOTP; // check if a new OTP has been sent
//                         let OTP = results[0].OTP; // use the old OTP by default
//                         if (newOTP) {
//                             OTP = (new shajs.sha1().update(`${newOTP}`).digest('hex')); // use the new OTP if it exists
//                         }
//                         if (OTP == userOTP) {
//                             let select = `UPDATE users SET active='1', OTP=NULL, OTP_timestamp=NULL, OTP_attempt='0' WHERE username = ?;`;
//                             db.query(select, [authData.user.username], (error, results, fields) => {
//                                 if (error) {
//                                     return console.error(error.message);
//                                 }
//                                 res.cookie('active', 1);
//                                 res.send({ msg: "account activated!" })
//                             });
//                         } else {
//                             OTP_attempt++;
//                             let select = `UPDATE users  SET OTP_attempt= ? WHERE USERNAME= ?;`;
//                             db.query(select, [OTP_attempt, authData.user.username], (error, results, fields) => {
//                                 if (error) {
//                                     return console.error(error.message);
//                                 } if (OTP_attempt < 3) {
//                                     res.status(403).send({ msg: "wrong OTP" });
//                                 } else {
//                                     tries = 6 - OTP_attempt;
//                                     res.status(403).send({ msg: `wrong OTP, ${tries} tries left` });
//                                 }

//                             });
//                         }
//                     } else {
//                         res.status(403).send({ msg: "OTP expired" });
//                     }
//                 } else {
//                     res.status(403).send({ msg: "maximum OTP attempt limitation exceeded" });
//                 }
//             } else {
//                 res.status(403).send({ msg: "blank OTP field is not allowed, please enter your OTP" });
//             }
//         } else {
//             res.status(400).send({ msg: "something went wrong, try to relogin with userID and password after logout" });
//         }

//     });
// });
router.post('/otp/activate', verifyToken, (req, res) => {
    const { userOTP } = req.body;
    authData = req.data;
    let select = `SELECT USERNAME, ID, OTP, OTP_timestamp, OTP_attempt FROM users WHERE USERNAME= ?`;
    db.query(select, [authData.user.username], (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }
      var OTP_attempt = results[0].OTP_attempt;
      var validTime = moment(results[0].OTP_timestamp).add(2, 'hours').format("YYYY-MM-DD hh:mm:ss");;
      var timeValid =  moment(validTime).format("X")
      console.log(validTime);
      if (results[0].ID === authData.user.ID) {
        if (userOTP) {
          if (OTP_attempt < 6) {
            var today = new Date();
            var OTP_timestamp = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
            var curTime = moment(OTP_timestamp).format("X");
  
            if (timeValid >= curTime) { // 2 hours in seconds
              if (results[0].OTP == userOTP) {
                let select = `UPDATE users SET active='1', OTP=NULL, OTP_timestamp=NULL, OTP_attempt='0' WHERE username = ?;`;
                db.query(select, [authData.user.username], (error, results, fields) => {
                  if (error) {
                    return console.error(error.message);
                  }
                  // res.cookie('active', 1);
                  // setTimeout(() => {
                  //     res.clearCookie('active',0);
                  // }, 30000); 
  
                  // Set timeout to call signout function after 90 seconds
                  setTimeout(() => {
                    router.get('/signout/', (req, res) => {
                      res.clearCookie('authorization');
                      res.clearCookie('active');
                      res.send('ok');
                    })
                  }, 90000);
  
                  res.send({ msg: "account activated!" })
                });
              } else {
                OTP_attempt++;
                let select = `UPDATE users  SET OTP_attempt= ? WHERE USERNAME= ?;`;
                db.query(select, [OTP_attempt, authData.user.username], (error, results, fields) => {
                  if (error) {
                    return console.error(error.message);
                  } if (OTP_attempt < 3) {
                    res.status(403).send({ msg: "wrong OTP" });
                  } else {
                    tries = 6 - OTP_attempt;
                    res.status(403).send({ msg: `wrong OTP, ${tries} tries left` });
                  }
  
                });
              }
            } else {
              res.status(403).send({ msg: "OTP expired" });
            }
          } else {
            res.status(403).send({ msg: "maximum OTP attempt limitation exceeded" });
          }
        } else {
          res.status(403).send({ msg: "blank OTP field is not allowed, please enter your OTP" });
        }
      } else {
        res.status(400).send({ msg: "something went wrong, try to relogin with userID and password after logout" });
      }
  
    });
  });
  
//COOKIE AUTO RESET//
router.post('/otp/resend', verifyToken, (req, res) => {

    let select = `SELECT ID, email FROM users WHERE USERNAME= ?`;
    db.query(select, [req.data.user.username], (error, results, fields) => {
        if (error) {
            return console.error(error.message);
        }
        if (results[0].ID === req.data.user.ID) {

            function randomInt(max, min) {
                var num = (Math.floor(Math.random() * (max - min)) + min);
                return num;
            }
            var OTP = randomInt(10000, 99999);
            var today = new Date();
            var OTP_timestamp = (Math.floor(today.getTime() / 1000));

            otp(results[0].email, OTP)
                .then((result) => {
                    OTP = (new shajs.sha1().update(`${OTP}`).digest('hex'))
                    let select = `UPDATE users  SET OTP= ?, OTP_timestamp= ?, OTP_attempt='0' WHERE USERNAME= ?;`;
                    db.query(select, [OTP, OTP_timestamp, req.data.user.username], (error, results, fields) => {
                        if (error) {
                            return console.error(error.message);
                        }
                        res.status(200).send({ msg: "OTP sent, check your your email" })
                    });
                }).catch((err) => {
                    res.status(500).send({ msg: `Internal server error please contact with support team` });
                    console.log(err);
                });
        } else {
            res.status(400).send({ msg: "Something went wrong, try to relogin with userID and password after logout" });
        }
    });
});

router.post('/signin/', (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        try {
            let select = `SELECT ID, password, password_attempt, active FROM users WHERE USERNAME= ? `;
            db.query(select, [username], (error, results, fields) => {
                if (error) {
                    return console.error(error.message);
                }
                if (results[0]) {
                    var { password_attempt } = results[0];
                    var { active } = results[0];
                    if (active === 1) { // check if account is active
                        if (password_attempt < 10) {
                            if (results[0].password === password) {

                                db.promise().query(`UPDATE users SET password_attempt= '0' WHERE username = ?`, [username]);

                                // Mock user
                                const user = {
                                    username: username,
                                    ID: results[0].ID
                                }

                                jwt.sign({ user }, process.env.JWT_token, { expiresIn: '172800s' }, (err, token) => {
                                    if (err) {
                                        res.json({ err });
                                    }
                                    res.cookie('authorization', `bearer ${token}`);
                                    res.cookie('active', results[0].active);
                                    res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000 ), httpOnly: true });
                                    res.send({ msg: `login sucessful! welcome ${username}` });
                                });

                            } else {

                                password_attempt++;
                                let select = `UPDATE users  SET password_attempt= ? WHERE USERNAME= ?`;
                                db.query(select, [password_attempt, username], (error, results, fields) => {
                                    if (error) {
                                        return console.error(error.message);
                                    }
                                    if (password_attempt === 10) {
                                        let select = `UPDATE users  SET active= '0' WHERE USERNAME= ?`;
                                        db.query(select, [username], (error, results, fields) => {
                                            if (error) {
                                                return console.error(error.message);
                                            }
                                            res.status(403).send({ msg: "Maximum password attempt exceeded, your account has been blocked" });
                                        });
                                    } else {
                                        res.status(403).send({ msg: "wrong ID or password" });
                                    }
                                });
                            }
                        }
                        else {
                            res.status(403).send({ msg: "Maximum password attempt exceeded, your account has been blocked" })
                        }
                    }
                    else {
                        res.status(403).send({ msg: "Your account has been blocked" })
                    }
                }
                else {
                    res.status(403).send({ msg: "Wrong ID or password" });
                }
            });
        }
        catch (err) {
            console.error(err);
        }
    } else {
        res.status(401).send({ msg: "Empty username or password is not valid" })
    }
});

//admin
router.post('/adminsignin/', (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        try {
            let select = `SELECT ID, password, password_attempt, active FROM users WHERE USERNAME= ? `;
            db.query(select, [username], (error, results, fields) => {
                if (error) {
                    return console.error(error.message);
                }
                if (results[0]) {
                    var { password_attempt } = results[0];
                    if (password_attempt > 20) {
                        res.status(403).send({ msg: "maximum password attempt exceeded" });
                    }
                    else {
                        if (results[0].password === password) {
                            // Reset password_attempt to zero
                            db.promise().query(`UPDATE users SET password_attempt= '0' WHERE USERNAME = ?`, [username]);

                            // Mock user
                            const user = {
                                username: username,
                                ID: results[0].ID
                            }

                            jwt.sign({ user }, process.env.JWT_token, { expiresIn: '172800s' }, (err, token) => {
                                if (err) {
                                    res.json({ err });
                                }
                                res.cookie('authorization', `bearer ${token}`);
                                res.cookie('active', results[0].active);
                                res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });
                                res.send({ msg: `login successful! welcome ${username}` });
                            });
                        } else {
                            password_attempt++;
                            let select = `UPDATE users  SET password_attempt= ? WHERE USERNAME= ?`;
                            db.query(select, [password_attempt, username], (error, results, fields) => {
                                if (error) {
                                    return console.error(error.message);
                                }
                                res.status(403).send({ msg: "wrong ID or password" });
                            });
                        }
                    }
                }
                else {
                    res.status(403).send({ msg: "wrong ID or password" });
                }
            });
        }
        catch (err) {
            console.error(err);
        }
    } else {
        res.status(401).send({ msg: "empty username or password is not valid" })
    }
});

//fetch data 
router.get('/admindashboard', function(req, res, next) {
    var query = 'select * from users';
    db.query(query, function(err, rows, fields) {
      if (err) throw err;
      //res.json(rows);
      res.render('admindashboard', { title: 'Products', products: rows});
    })
  });
  




//end admin

router.post('/test/autologin', verifyToken, (req, res) => {

    authData = req.data;
    res.json({
        message: 'relogged in',
        authData
    });

});

router.put('/update/', verifyToken, (req, res) => {

    let { password, email, newPassword, name } = req.body;

    if (password) {
        let selectPSWD = `SELECT password FROM users WHERE USERNAME= ?`;
        db.query(selectPSWD, [req.data.user.username], (err, data, fields) => {
            if (err) {
                return console.error(err.message);
            }
            if (data[0].password === password) {

                const params = [];
                let sql = ' UPDATE USERS SET ';

                if (email) {
                    sql += ' email = ?';
                    params.push(email);
                }else
                if (name) {
                    sql += ' name = ?';
                    params.push(name);
                }else
                if (newPassword) {
                    password = newPassword;
                    sql += ' password = ?';
                    params.push(password);
                }else{
                    res.status(403).send({ msg: "no expected data found" });
                    return;
                }

                sql += ' WHERE USERNAME = ?;';
                params.push( req.data.user.username);

                db.query(sql, params, (err, results, fields) => {
                    if (err) {
                        return console.error(err.message);
                    } else {
                        res.status(200).send({ msg: 'data updated sucessfully' });
                    }
                });

            } else {
                res.status(403).send({ msg: "wrong password" });
            }
        });
    } else {
        res.status(403).send({ msg: "password must be filled!" });
    }

})

router.post('/forgetpassword/otp/request', (req, res) => {
    const { username } = req.body;
    if (username) {
        db.promise().query(`SELECT email FROM users WHERE username= ?`, [username])
            .then((result) => {
                if (result[0][0]) {
                    function randomInt(max, min) {
                        var num = (Math.floor(Math.random() * (max - min)) + min);
                        return num;
                    }
                    var OTP = randomInt(10000, 99999);
                    var today = new Date();
                    var OTP_timestamp = (Math.floor(today.getTime() / 1000));

                    otp(result[0][0].email, OTP)
                        .then((result) => {
                            OTP = (new shajs.sha1().update(`${OTP}`).digest('hex'))
                            let select = `UPDATE users  SET OTP= ?, OTP_timestamp= ?, OTP_attempt='0' WHERE USERNAME= ?;`;
                            db.query(select, [OTP, OTP_timestamp, username], (error, results, fields) => {
                                if (error) {
                                    return console.error(error.message);
                                }
                                res.send({ msg: "OTP sent, check your your email" })
                            });
                        }).catch((err) => {
                            res.status(500).send({ msg: `internal server error please contact with support team` });
                            console.log(err);
                        });

                } else {
                    res.status(403).send({ msg: "account not found" })
                }
            }).catch((err) => {
                console.error(err);
            });
    } else {
        res.status(403).send({ msg: "please enter your username" })
    }
})

router.post('/forgetpassword/otp/send', (req, res) => {
    const { username, userOTP } = req.body;

    let select = `SELECT OTP, OTP_timestamp, OTP_attempt FROM users WHERE USERNAME= ?`;
    db.query(select, [username], (error, results, fields) => {
        if (error) {
            return console.error(error.message);
        }
        if (results[0]) {

            var OTP_attempt = results[0].OTP_attempt;

            if (userOTP) {
                if (OTP_attempt < 6) {
                    var today = new Date();
                    if (((Math.floor(today.getTime() / 1000)) - results[0].OTP_timestamp) < 7200) {
                        if (results[0].OTP === userOTP) {
                            const user = {
                                username: username,
                                OTP: userOTP
                            }
                            jwt.sign({ user }, process.env.JWT_token, { expiresIn: '900s' }, (err, token) => {
                                if (err) {
                                    res.json({ err });
                                }
                                res.cookie('OTPauthorization', `code: ${token}`);
                                res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });
                                res.send({ msg: `enter new password` });
                            });
                        } else {
                            OTP_attempt++;
                            let select = `UPDATE users  SET OTP_attempt= ? WHERE USERNAME= ?;`;
                            db.query(select, [OTP_attempt, username], (error, results, fields) => {
                                if (error) {
                                    return console.error(error.message);
                                } if (OTP_attempt < 3) {
                                    res.status(403).send({ msg: "wrong OTP" });
                                } else {
                                    tries = 6 - OTP_attempt;
                                    res.status(403).send({ msg: `wrong OTP, ${tries} tries left` });
                                }

                            });
                        }
                    } else {
                        res.status(403).send({ msg: "OTP expired" });
                    }
                } else {
                    res.status(403).send({ msg: "maximum OTP attempt limitation exceeded" });
                }
            } else {
                res.status(403).send({ msg: "blank OTP field is not allowed, please enter your OTP" });
            }
        } else {
            res.status(404).send({ msg: "account not found" })
        }
    });
});

router.post('/forgetpassword/newpassword', (req, res) => {

    const { cookies } = req;
    const { newPassword } = req.body;
    const bearerHeader = cookies.OTPauthorization;

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];

        jwt.verify(bearerToken, process.env.JWT_token, (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                let select = `SELECT ID, OTP, active FROM users WHERE username= ?`;
                db.query(select, [authData.user.username], (error, results, fields) => {
                    if (error) {
                        return console.error(error.message);
                    }
                    if (results[0]) {
                        if (results[0].OTP === authData.user.OTP) {
                            if (newPassword) {
                                let select = `UPDATE users  SET password= ?, OTP=NULL, OTP_timestamp=NULL, OTP_attempt='0' WHERE username= ?;`;
                                db.query(select, [newPassword, authData.user.username], (error, result, fields) => {
                                    if (error) {
                                        return console.error(error.message);
                                    }
                                    // Mock user
                                    const user = {
                                        username: authData.user.username,
                                        ID: results[0].ID
                                    }
                                    jwt.sign({ user }, process.env.JWT_token, { expiresIn: '172800s' }, (err, token) => {
                                        if (err) {
                                            res.json({ err });
                                        }
                                        res.clearCookie('OTPauthorization');
                                        res.cookie('authorization', `bearer ${token}`);
                                        res.cookie('active', results[0].active);
                                        res.status(200).send({ msg: `password changed sucessfully!` });
                                    });

                                });
                            } else {
                                res.status(403).send({ msg: `blank password is not allowed` });
                            }
                        } else {
                            res.status(403).send({ msg: `forbidden` });
                        }
                    } else {
                        res.status(403).send({ msg: `forbidden` });
                    }
                });
            }
        });

    } else {
        res.sendStatus(403);
    }


})
//Google Authencation
function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    $("#name").text(profile.getName());
    $("#email").text(profile.getEmail());
    $("#image").attr('src', profile.getImageUrl());
    $(".data").css("display", "block");
    $(".g-signin2").css("display", "none");
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        alert("You have been signed out successfully");
        $(".data").css("display", "none");
        $(".g-signin2").css("display", "block");
    });
}

router.get('/signout/', (req, res) => {
    res.clearCookie('authorization');
    res.clearCookie('active');
    res.send('ok');
})

router.post('/signout/all', verifyToken, (req, res) => {
    authData = req.data.user.username;
    db.promise().query(`UPDATE USERS SET ID= '${uuid.v4()}' WHERE USERNAME ='${authData}'`);
    res.clearCookie('authorization');
    res.clearCookie('active');
    res.send('ok');
})

//google signup

//for facebook
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'email']
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);// Here // Here you can find or create a user in your database based on the Facebook profile data
    // and pass the user object to the done callback function
  }
));



module.exports = router;