const express = require('express');
const Router = express.Router();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('dotenv').config();
const youremail = process.env.EMAIL;
const password = process.env.PASSWORD;
// Import Model
const useremail = mongoose.model('useremail');
const upload = mongoose.model('upload');


// Routes

Router.get('/', (req, res) => {
    res.render('index');
});

// 02 POST email to database
Router.post('/subscribe', (req, res) => {
    // Check wheather email is already exist
    useremail.findOne({ email: req.body.email })
        .then(emailfound => {
            if (emailfound) {
                console.log('email is already registerd');
                res.json({ error: "email is already registerd." })
            } else {
                const newuseremail = new useremail({
                    email: req.body.email
                });
                newuseremail.save(function (err, data) {
                    if (err) throw err;
                    // res.json({ msg: "You are suscribed successfully" })
                    res.render('index', {
                        data: data,
                        msg: "Your are suscribed successfully.."
                    })
                })
            }
        })
        .catch(err => console.log(err));


});

// 03 Upload and send email 
Router.post('/upload', (req, res) => {
    const newUpload = new upload({
        text: req.body.text
    });
    newUpload.save(function (err, data) {
        if (err) {
            console.log(err);
        } else {
            useremail.find({}, function (err, subscribers) {
                if (err) {
                    console.log(err)
                } else {
                    let mailList = [];
                    subscribers.forEach(function (users) {
                        mailList.push(users.email);
                        return mailList;
                    });
                    // create reusable transporter object using the default SMTP transport
                    // Create an output variable for email
                    const output = `
                    <h3> This is an Email From sakorisakori.com</h3>
                    <h6> A private initiative from Partha Pratim Garg </h6>
                    <p> ${req.body.text}</p>`
                    let transporter = nodemailer.createTransport({
                        service: 'gmail',
                        port: 587,
                        secure: false, // true for 465, false for other ports
                        auth: {
                            user: youremail, // generated ethereal user
                            pass: password  // generated ethereal password
                        },
                        tls: {
                            rejectUnauthorized: false
                        }
                    });
                    // setup email data with unicode symbols
                    let mailOptions = {

                        from: '"sakorisakori.com" <polestar2020im@gmail.com>', // sender address
                        to: mailList, // list of receivers
                        subject: 'A Job Advertise Website', // Subject line
                        text: 'Hello world?', // plain text body
                        // html: "<h1> Email is Recived </h1>" // html body
                        html: output
                    };
                    // send mail with defined transport object
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                        console.log('Message sent: %s', info.messageId);
                        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                        res.render('index', { msg: 'Email has been sent' });
                    });
                } // else bracket ends here
            })
        } // Else bracket ends here..
    })

});



module.exports = Router