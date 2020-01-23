var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const {User} = require('../models')
const checkoff = require('../config/auth')
var cron = require('node-cron');
var nodemailer = require('nodemailer');
var shell = require('shelljs')
var moment = require('moment');

/* GET users listing. */
router.post('/signup', (req, res, next) =>{
     User.findOne({where:{email:req.body.email}}).then(data=>{
           if(data){
             res.json({message:"email exist"})
           }else{
                User.create({
                  Name: req.body.name,
                  email: req.body.email,
                  Appdate: req.body.date
                       }).then(data=>{
                         res.render('index',{docs:data})
                         cron.schedule('* * * * *', () => {
                          var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                              user: 'asquat45@gmail.com',
                              pass: 'bokaro@123'
                            }
                          });
                          var mailOptions = {
                            from: 'asquat45@gmail.com',
                            to: req.body.email,
                            subject: 'Sending Email For Remainding You For Yor Appointment',
                            text: `Your are booked an appointemt with Jhon On Date ${req.body.date}`
                          };
                          transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                              console.log(error);
                            } else {
                              console.log('Email sent: ' + info.response);
                            }
                          });
                          if (shell.exec("dir").code !== 0){
                            console.log('running a task every minute');
                          }
                        });
                          }).catch(err=>{
                              res.json(err)
                          })
                        }
                      });               
});
router.get('/data',(req,res,next)=>{
  res.render('data')  
})

router.post('/login',(req,res,next)=>{
  User.findOne({where:{email:req.body.email}}).then(data=>{
    if(data.length<1){
      res.json({mesagae:'Mail not found '}) 
    }else{
      // const token = jwt.sign({
      //       email:data.email,
      //       userId:data.id
      //     },"Secrect",{
      //       expiresIn:"1h"
      //     })
       const databasetime = moment(data.Appdate).format('dddd, MMMM Do YYYY')
      res.render('data',{
        dataname:data.Name,
        dataemail:data.email,
        datadate:databasetime,
            id:data.id})
        // res.status(401).json({
        //     message:'Auth faield',
        //     token:token
        //   })
          }
        }).catch(err=>{
          res.json(err)
        })
      })

router.get('/delet/:id',checkoff,(req,res,next)=>{
  const idel = req.params.id;
  console.log(idel)
  User.destroy({where:{id:idel}}).then(data=>{
    res.send({message:"Dataa delet this One"+'  '+ data})
  });
});
module.exports = router;
