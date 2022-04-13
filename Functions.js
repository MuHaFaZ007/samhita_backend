const express = require("express");
var path = require('path');
const nodemailer = require("nodemailer");
const mongoose = require('mongoose');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
mongoose.connect('mongodb+srv://admin-dinesh:dineshv%406028@cluster0.muixm.mongodb.net/samhitaDB', {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});
const User = require('./models/user');
const oUser = require('./models/order');
const sgMail = require('./signup_mail_sender')
const requ = require('./msg91')
const SendOtp = require('sendotp');
const mluser = require('./models/ml_user')
const androiduser = require('./models/android_user')
const aiuser = require('./models/ai_user')
const ethicaluser = require('./models/ethical_user')
const pythonuser = require('./models/python_user')



var p_id = undefined;

const smsobject=new requ();

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



class myobject {

    async getdata() {
        const randomnumber = await getRandom(1000, 9999)
        var user = await User.findOne({
            'userid': randomnumber
        });
        if (user) {
            return this.getdata();
        }

        return randomnumber
    }

    async getdetails123(sid) {
        let rand = {}
        var user = await User.findOne({
            'userid': sid
        });
        rand['email']=user.email
        rand['phone']=user.phone;
        rand['name']=user.name;

        return rand
    }

    async getdata2() {
        const randomnumber = await getRandom(100000, 999999)
        var ouser = await oUser.findOne({
            'userid': randomnumber
        });
        if (ouser) {
            return this.getdata();
        }
        const me = await new oUser({
            userid: randomnumber
        })
        await me.save()
        return randomnumber
    }

    async checkuser(mail, phonenum) {
        var emailcheck = await User.countDocuments({
            'email': mail
        });
        var phonecheck = await User.countDocuments({
            'phone': phonenum
        });
        if (emailcheck > 0 || phonecheck > 0)
            return 0;
        return 1;
    }

    async getid() {
        var data = await this.getdata();
        return data
    }
    async getid2() {
        var data = await this.getdata2();
        return data
    }

    async update(p_name, mail, phonenum, p_college, p_password, deptname, yearstu) {
        if (await this.checkuser(mail, phonenum) == 0) {
            return 0;
        }
        p_id = await this.getid()
        const me = new User({
            userid: p_id,
            name: p_name,
            email: mail,
            phone: phonenum,
            college: p_college,
            password: p_password,
            dept: deptname,
            year: yearstu
        })
        await me.save()

        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "samhita2k22@gmail.com",
              pass: "samhitalokkie@1999"
            }
          });
          
          var str = "Hello! "+p_name+ " Thank You for your registration!";
          var mailOptions = {
            from: '"SAMHITA 22"<samhita2k22@gmail.com>',
            to: mail,
            subject: "Samhita 2022 - User Registration",
            html: 'Greetings from the Team Samhita! Thank you for Registering.You can buy your tickets for events and workshop in samhita.org.in  Get your Tickets now! For Queries please contact respective event coordinators. <br> <img src="https://drive.google.com/thumbnail?id=1ndzBbN1rm32X46iCWAm71j7W08vwgvNu&sz=w200-h200"> <br><br> Thanks and regards,<br> Team Samhita <br> '
            /*attachements: [{
                filename: 'samhita22_logo.png',
                path: __dirname+'/samhita22_logo.png',
                cid: "samhita22_logo"
            }]*/
          };
        
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          }); 

       /* await sgMail.send({
            to: mail,
            from: {
                email: 'admin@samhita.org.in',
                name: 'Samhita MIT'
            },
            templateId: 'd-9e4b0e1019f044b192a6987caee1ea36',
            dynamic_template_data: {
                name: p_name
            }
        })*/
        await smsobject.otp(p_name, phonenum)



        return 1;
    }


    async checkloginuser(mail, p_password) {
        var login = {}
        var emailcheck = await User.findOne({
            'email': mail
        });

        if (emailcheck) {
            const passwordindb = emailcheck.password;
            if (passwordindb != p_password) {
                login['islogged'] = "pass_wrong"
                return login;
            }

            login['islogged'] = 1
            login['userid'] = emailcheck.userid
            login['name'] = emailcheck.name
            return login


        }
        login['islogged'] = "email_not"
        return login
    }


    async getdetails(userid) {
        var login = {}
        var det = await User.findOne({
            'userid': userid
        });

        login['userid'] = det.userid
        login['phone'] = det.phone
        login['name'] = det.name
        login['college'] = det.college
        login['dept'] = det.dept
        login['year'] = det.year
        login['mailid'] = det.email
        login['status'] = det.status
        login['workshopstatus'] = {}
        login['pp']=0
        login['workshopstatus']['workshop'] = []
        if (det.workshopstatus==0)
        {
            login['pp']=1
        }
        if(det.workshopstatus>0&&det.workshopstatus!=10)
        {
            var res = {
                'name': 'Placement Training and Resume Building Workshop',
                'numberoftickets': '1',
                'date': 'April 23, 11 AM - 2:30 PM',
                'location':'RLHC Conference Hall'
            }
            login['workshopstatus']['workshop'].push(res)
        
            var res = {
                'name': 'Data Science Workshop',
                'numberoftickets': '1',
                'date': 'April 25, 4:30 PM - 5:30 PM',
                'location':'ONLINE'
            }
            login['workshopstatus']['workshop'].push(res)
        }
        // if(det.workshopstatus==10)
        // {
        //     var res = {
        //         'name': 'Placement Training Workshop by GeeksforGeeks',
        //         'numberoftickets': '1',
        //         'date': 'January 31, 1:00 PM - 4:00 PM',
        //         'location':'Rajam Hall '
        //     }
        //     login['workshopstatus']['workshop'].push(res)
        // }


        var mldet = await mluser.findOne({
            'userid': userid
        })
        if (mldet) {


            let status = mldet.status;
            let tickets
            if (status == 1) {
                tickets = mldet.tickets
                var res = {
                    'name': 'Machine Learning and Deep Learning Workshop',
                    'numberoftickets': tickets,
                    'date': 'April 23, 9:30 AM - 4 PM',
                    'location':'CT DEPT Conference Hall'
                }
                login['workshopstatus']['workshop'].push(res)
            }
        }
        
        var mldet = await androiduser.findOne({
            'userid': userid
        })
        if (mldet) {
            let status = mldet.status;
            if (status == 1) {
                let tickets = mldet.tickets
                var res = {
                    'name': 'Blockchain Workshop',
                    'numberoftickets': tickets,
                    'date': 'April 24, 9:30 AM - 4:30 PM',
                    'location':'KVN Seminar Hall(EI DEPT)'
                }
                login['workshopstatus']['workshop'].push(res)
            }
        }
        var mldet = await pythonuser.findOne({
            'userid': userid
        })
        if (mldet) {
            let status = mldet.status;
            if (status == 1) {
                let tickets = mldet.tickets
                var res = {
                    'name': 'Cloud Computing with AWS',
                    'numberoftickets': tickets,
                    'date': 'April 24, 9:30 AM - 4 PM',
                    'location':'CT DEPT Conference Hall'
                }
                login['workshopstatus']['workshop'].push(res)
            }
        }
        var mldet = await ethicaluser.findOne({
            'userid': userid
        })
        if (mldet) {
            let status = mldet.status
            if (status == 1) {
                let tickets = mldet.tickets
                var res = {
                    'name': 'Ethical Hacking & Cybersecurity Workshop',
                    'numberoftickets': tickets,
                    'date': 'April 24, 9:30 AM - 4 PM',
                    'location':'RLHC Conference Hall'
                }
                login['workshopstatus']['workshop'].push(res)
            }
        }
        var mldet = await aiuser.findOne({
            'userid': userid
        })
        if (mldet) {
            let status = mldet.status
            if (status == 1) {
               let tickets = mldet.tickets
                var res = {
                    'name': 'UI/UX Bootcamp using React Native',
                    'numberoftickets': tickets,
                    'date': 'April 23, 9:30 AM - 4 PM',
                    'location':'KVN Seminar Hall(EI DEPT)'
                }
                login['workshopstatus']['workshop'].push(res)
            }
        }
        console.log(login)
        return login
    }
    async payment(userid, txn,num) {
        var det = await User.findOne({
            'userid': userid
        });
        let name =det.name
        let phone=det.phone
        let mail=det.email
        let clg=det.college
        await User.findOne({
            userid: userid
        }, function(err, doc) {

            doc.status = 1
            doc.txnid = txn
            if(num==9)
            doc.workshopstatus = 10
            else
            doc.workshopstatus = 1 
            doc.save();
        });

        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "samhita2k22@gmail.com",
              pass: "samhitalokkie@1999"
            }
          });
          
        //   var str = "Hello! "+p_name+ " Thank You for your registration!";
          var mailOptions = {
            from: '"SAMHITA 22"<samhita2k22@gmail.com>',
            to: mail,
            subject: "Samhita 2022 - User Registration",
            html: '<img src="https://drive.google.com/thumbnail?id=1ndzBbN1rm32X46iCWAm71j7W08vwgvNu&sz=w200-h200"> <br> Samhita Ticket!',
            /*attachements: [{
                filename: 'samhita22_logo.png',
                path: __dirname+'/samhita22_logo.png',
                cid: "samhita22_logo"
            }]*/
          };
        
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });

        /*await sgMail.send({
            to: mail,
            from: {
                email: 'admin@samhita.org.in',
                name: 'Samhita MIT'
            },
            templateId: 'd-f4be981118444ad0a4970b21abbc3a7d',
            dynamic_template_data: {
                name: name,
                userid:userid
            }
        })*/
        await smsobject.samhitaticket(userid,name,phone,clg)
    }

    async forgotpass(phone) {

        var det = await User.findOne({
            'phone': phone
        });
        if (det) {
            var name = det.name;
            var password = det.password

            const sendOtp = new SendOtp('sendotp', 'Hey ' + name + ' your password for samhita account is ' + password + ". Thanks for registering with team samhita visit samhita.org.in for more details or contact 7598130276  (request status  is {{otp}} )");
            sendOtp.send("91" + phone, "SAMITA", function(error, data) {
                console.log(data);
            });
        } else {
            return 0;
        }
    }
    async mlworkshop(userid, txn, numoftickets, status) {
        var det = await User.findOne({
            'userid': userid
        });
        var phone = det.phone
        var name = det.name
        var email = det.email
        var clg=det.college
        var mldet = await mluser.findOne({
            'userid': userid
        })
       // console.log(mldet)
        if (!mldet) {
         //   console.log("hi")
            const ml = await new mluser({
                userid: userid,
                name: name,
                email: email,
                phone: phone,
                txnid:[]
            })
            await ml.save()
        }
        if (status == "TXN_SUCCESS") {
            await mluser.findOne({
                userid: userid
            }, function(err, doc) {
                doc.status = 1
                doc.txnid.push(txn + '(suc)')
                doc.tickets = parseInt(doc.tickets) + parseInt(numoftickets)
                doc.save();
            });
            var transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                  user: "samhita2k22@gmail.com",
                  pass: "samhitalokkie@1999"
                }
              });
              
            //   var str = "Hello! "+p_name+ " Thank You for your registration!";
              var mailOptions = {
                from: '"SAMHITA 22"<samhita2k22@gmail.com>',
                to: mail,
                subject: "Samhita 2022 - User Registration",
                html:  'Greetings from the Team Samhita! Thank you for Registering Machine Learning and Deep Learning Workshop.<br> Date: April 23 <br> Time: 9:30 AM - 4 PM <br> For Queries please contact Workshop coordinator Bharath (7338938606)  <br><br> <img src="https://drive.google.com/thumbnail?id=1ndzBbN1rm32X46iCWAm71j7W08vwgvNu&sz=w200-h200"> <br> Thanks and regards,<br> Team Samhita <br>',
                /*attachements: [{
                    filename: 'samhita22_logo.png',
                    path: __dirname+'/samhita22_logo.png',
                    cid: "samhita22_logo"
                }]*/
              };
            
              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log("Email sent: " + info.response);
                }
              });
    
            await smsobject.mlworkshop(userid,name,phone,clg)
           
        } else {
            await mluser.findOne({
                userid: userid
            }, function(err, doc) {
                doc.txnid.push(txn + '(fail)')
                doc.save();
            });

          
        }
    }

    async android(userid, txn, numoftickets, status) {
        var det = await User.findOne({
            'userid': userid
        });

        var phone = det.phone
        var name = det.name
        var email = det.email
        var clg=det.college
        console.log("hi")
        var mldet = await androiduser.findOne({
            'userid': userid
        })
        if (!mldet) {
            let ml = await new androiduser({
                userid: userid,
                name: name,
                email: email,
                phone: phone,
                txnid:[]
            
            })
            await ml.save()
        }

        if (status == "TXN_SUCCESS") {
            await androiduser.findOne({
                userid: userid
            }, function(err, doc) {
                doc.status = 1
                doc.txnid.push(txn + '(suc)')
                doc.tickets = parseInt(doc.tickets) + parseInt(numoftickets)
                doc.save();
            });
            var transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                  user: "samhita2k22@gmail.com",
                  pass: "samhitalokkie@1999"
                }
              });
              
            //   var str = "Hello! "+p_name+ " Thank You for your registration!";
              var mailOptions = {
                from: '"SAMHITA 22"<samhita2k22@gmail.com>',
                to: mail,
                subject: "Samhita 2022 - User Registration",
                html:  'Greetings from the Team Samhita! Thank you for Registering Blockchain Workshop.<br> Date: April 24 <br> Time: 9:30 AM - 4:30 PM <br> For Queries please contact Workshop coordinator Madhusudhan (6379624413)  <br><br> <img src="https://drive.google.com/thumbnail?id=1ndzBbN1rm32X46iCWAm71j7W08vwgvNu&sz=w200-h200"> <br> Thanks and regards,<br> Team Samhita <br>',
                /*attachements: [{
                    filename: 'samhita22_logo.png',
                    path: __dirname+'/samhita22_logo.png',
                    cid: "samhita22_logo"
                }]*/
              };
            
              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log("Email sent: " + info.response);
                }
              });
    
            await smsobject.androidworkshop(userid,name,phone,clg)
          //  await ml.save()
        } else {
            await androiduser.findOne({
                userid: userid
            }, function(err, doc) {
                doc.txnid.push(txn + '(fail)')
                doc.save();
            });
        //    await ml.save()
        }
    }
    async aiworkshop(userid, txn, numoftickets, status) {
        var det = await User.findOne({
            'userid': userid
        });
        var phone = det.phone
        var name = det.name
        var email = det.email
        var clg=det.college
        var mldet = await aiuser.findOne({
            'userid': userid
        })
        if (!mldet) {
            const ml = await new aiuser({
                userid: userid,
                name: name,
                email: email,
                phone: phone,
                txnid:[]

            })
            await ml.save()
        }
        if (status == "TXN_SUCCESS") {
            await aiuser.findOne({
                userid: userid
            }, function(err, doc) {
                doc.status = 1
                doc.txnid.push(txn + '(suc)')
                doc.tickets = parseInt(doc.tickets) + parseInt(numoftickets)
                doc.save();
            });
            var transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                  user: "samhita2k22@gmail.com",
                  pass: "samhitalokkie@1999"
                }
              });
              
            //   var str = "Hello! "+p_name+ " Thank You for your registration!";
              var mailOptions = {
                from: '"SAMHITA 22"<samhita2k22@gmail.com>',
                to: mail,
                subject: "Samhita 2022 - User Registration",
                html:  'Greetings from the Team Samhita! Thank you for Registering UI/UX Bootcamp using React Native Workshop.<br> Date: April 23 <br> Time: 9:30 AM - 4 PM <br> For Queries please contact Workshop coordinator Madhusudhan (6379624413)  <br><br> <img src="https://drive.google.com/thumbnail?id=1ndzBbN1rm32X46iCWAm71j7W08vwgvNu&sz=w200-h200"> <br> Thanks and regards,<br> Team Samhita <br>',
                /*attachements: [{
                    filename: 'samhita22_logo.png',
                    path: __dirname+'/samhita22_logo.png',
                    cid: "samhita22_logo"
                }]*/
              };
            
              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log("Email sent: " + info.response);
                }
              });
    
            await smsobject.aiworkshop(userid,name,phone,clg)
        } else {
            await aiuser.findOne({
                userid: userid
            }, function(err, doc) {
                doc.txnid.push(txn + '(fail)')
                doc.save();
            });

        }

    }

    async ethicalworkshop(userid, txn, numoftickets, status) {
        var det = await User.findOne({
            'userid': userid
        });
        var phone = det.phone
        var name = det.name
        var email = det.email
        var clg=det.college
        var mldet = await ethicaluser.findOne({
            'userid': userid
        })
        if (!mldet) {
            const ml = await new ethicaluser({
                userid: userid,
                name: name,
                email: email,
                phone: phone,
                txnid:[]
            })
            await ml.save()
        }

        if (status == "TXN_SUCCESS") {
            await ethicaluser.findOne({
                userid: userid
            }, function(err, doc) {
                doc.status = 1
                doc.txnid.push(txn + '(suc)')
                doc.tickets = parseInt(doc.tickets) + parseInt(numoftickets)
                doc.save();
            });
            var transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                  user: "samhita2k22@gmail.com",
                  pass: "samhitalokkie@1999"
                }
              });
              
            //   var str = "Hello! "+p_name+ " Thank You for your registration!";
              var mailOptions = {
                from: '"SAMHITA 22"<samhita2k22@gmail.com>',
                to: mail,
                subject: "Samhita 2022 - User Registration",
                html:  'Greetings from the Team Samhita! Thank you for Registering Ethical Hacking and Cybersecurity Workshop.<br> Date: April 24 <br> Time: 9:30 AM - 4 PM <br> For Queries please contact Workshop coordinator Hariharan S (9500020859)  <br><br> <img src="https://drive.google.com/thumbnail?id=1ndzBbN1rm32X46iCWAm71j7W08vwgvNu&sz=w200-h200"> <br> Thanks and regards,<br> Team Samhita <br>',

                /*attachements: [{
                    filename: 'samhita22_logo.png',
                    path: __dirname+'/samhita22_logo.png',
                    cid: "samhita22_logo"
                }]*/
              };
            
              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log("Email sent: " + info.response);
                }
              });
    
            await smsobject.ethicalworkshop(userid,name,phone,clg)

        } else {
            await ethicaluser.findOne({
                userid: userid
            }, function(err, doc) {
                doc.txnid.push(txn + '(fail)')
                doc.save();
            });

        }
    }

    async pythonworkshop(userid, txn, numoftickets, status) {
        var det = await User.findOne({
            'userid': userid
        });
        var phone = det.phone
        var name = det.name
        var email = det.email
        var clg=det.college
        var mldet = await pythonuser.findOne({
            'userid': userid
        })
        if (!mldet) {
            const ml = await new pythonuser({
                userid: userid,
                name: name,
                email: email,
                phone: phone,
                txnid:[]

            })
            await ml.save()
        }

        if (status == "TXN_SUCCESS") {
            await pythonuser.findOne({
                userid: userid
            }, function(err, doc) {
                doc.status = 1
                doc.txnid.push(txn + '(suc)')
                doc.tickets = parseInt(doc.tickets) + parseInt(numoftickets)
                doc.save();
            });
            var transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                  user: "samhita2k22@gmail.com",
                  pass: "samhitalokkie@1999"
                }
              });
              
            //   var str = "Hello! "+p_name+ " Thank You for your registration!";
              var mailOptions = {
                from: '"SAMHITA 22"<samhita2k22@gmail.com>',
                to: mail,
                subject: "Samhita 2022 - User Registration",
                html:  'Greetings from the Team Samhita! Thank you for Registering Cloud Computing with AWS.<br> Date: April 24 <br> Time: 9:30 AM - 4 PM <br> For Queries please contact Workshop coordinator Bharath (7338938606)  <br><br> <img src="https://drive.google.com/thumbnail?id=1ndzBbN1rm32X46iCWAm71j7W08vwgvNu&sz=w200-h200"> <br> Thanks and regards,<br> Team Samhita <br>',

                /*attachements: [{
                    filename: 'samhita22_logo.png',
                    path: __dirname+'/samhita22_logo.png',
                    cid: "samhita22_logo"
                }]*/
              };
            
              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log("Email sent: " + info.response);
                }
              });
    
            await smsobject.pythonworkshop(userid,name,phone,clg)

        } else {
            await pythonuser.findOne({
                userid: userid
            }, function(err, doc) {
                doc.txnid.push(txn + '(fail)')
                doc.save();
            });

        }
    }
    async getuser(userid)
    {
        userid+=''
        let match;
        if(userid.length==4)
            match='userid'
        else if(userid.includes("."))
            match='email'
        else
            match='phone'
        var det,mldet,aidet,ethicaldet,pythondet,androiddet
        console.log(match,' ',userid)
        if(match=='userid'){
        det = await User.findOne({ 'userid' : userid });    
        mldet = await mluser.findOne({ 'userid' : userid });
        aidet = await aiuser.findOne({ 'userid' : userid });
        ethicaldet = await ethicaluser.findOne({ 'userid' : userid });
        pythondet = await pythonuser.findOne({ 'userid' : userid });
        androiddet = await androiduser.findOne({ 'userid' : userid });
        }

        if(match=='phone')
        {
        det = await User.findOne({ 'phone' : userid });    
        mldet = await mluser.findOne({ 'phone' : userid });
        aidet = await aiuser.findOne({ 'phone' : userid });
        ethicaldet = await ethicaluser.findOne({ 'phone' : userid });
        pythondet = await pythonuser.findOne({ 'phone' : userid });
        androiddet = await androiduser.findOne({ 'phone' : userid });
        }
        if(match=='email')
        {
            console.log("sd")
        det = await User.findOne({ 'email' : userid });    
        mldet = await mluser.findOne({ 'email' : userid });
        aidet = await aiuser.findOne({ 'email' : userid });
        ethicaldet = await ethicaluser.findOne({ 'email' : userid });
        pythondet = await pythonuser.findOne({ 'email' : userid });
        androiddet = await androiduser.findOne({ 'email' : userid });
        }
        if(!det)
            return {}
        var phone = det.phone
        var name = det.name
        var email = det.email
        var clg=det.college

        var object={}

        var status=det.status

        status+=''
        var res=[];
        if(status=="1")
        { 
            if(det.workshopstatus==10)
                res.push("Paid for Events and Placement Workshop (Evening Batch)")
            else if(det.workshopstatus==1)
                res.push("Paid for Events and Placement Workshop (Morning Batch)")
            else
                res.push("Paid for Events")
        }

        object['phone']=phone
        object['name']=name
        object['clg']=clg
        object['email']=email

        //console.log(mldet)
        var mlstatus,aistatus,ethicalstatus,pythonstatus,androidstatus
        if(mldet)
            mlstatus=mldet.status+''
        if(aidet)
            aistatus=aidet.status+''
        if(ethicaldet)
            ethicalstatus=ethicaldet.status+''
        if(pythondet)
            pythonstatus=pythondet.status+''
        if(androiddet)
            androidstatus=androiddet.status+''

        if(mlstatus=="1")
        {
            res.push("Paid for Machine Learning Workshop and number of tickets "+mldet.tickets)
        }
        if(aistatus=="1")
        {
            res.push("Paid for Artificial Intelligence Workshop and number of tickets "+aidet.tickets)
        }
        if(ethicalstatus=="1")
        {
            res.push("Paid for Ethical Hacking Workshop and number of tickets "+ethicaldet.tickets)
        }
        if(pythonstatus=="1")
        {
            res.push("Paid for Python Workshop and number of tickets "+pythondet.tickets)
        }
        if(androidstatus=="1")
        {
            res.push("Paid for Android Workshop and number of tickets "+androiddet.tickets)
        }

        object['detail']=res

        return object
    }
    async mailcheck(email)
    {
        console.log(email)
        var det = await User.findOne({ 'email' : email });
        
        let res={}


        if(det)
        {
            res['issign']=1
        res['name']=det.name
        res['mailid']=det.email
        res['phone']=det.phone
        res['userid']=det.userid
        }
         
        else
            res['issign']=0
        
        return res
    }

    async onsight(details)
    {
        console.log("hiihih")
        let name=details.name
        let mailid=details.email
        let phone=details.phone
        let sid;
        if(details.user==null)
            sid=await this.getid()
        else
            sid=details.user
        var det = await User.findOne({ 'email' : mailid });
        if(!det)
    {
        console.log("ff")
        const me = new User({
        userid: sid,
        name: name,
        email: mailid,
        phone: phone,
        password: "samhita",
        status:0
    })
    await me.save()
         }
       
        
        let type=details.type
        let status=12;
        if(type=='ep1')
            status=1
        if(type=='ep0')
            status=10
        if(type=='enp')
            status=0

        console.log(status)
        if(status!=12)
        {
            var det = await User.findOne({ 'email' : mailid });
            if(det)
            {
                console.log(det)
                await User.findOne({
                    'email' : mailid
                }, function(err, doc) {
                    doc.status = 1
                    doc.workshopstatus=status
                    doc.save();
                });
            }
            else{
            const me = new User({
            userid: sid,
            name: name,
            email: mailid,
            phone: phone,
            password: "samhita",
            status:1,
            workshopstatus:status
        })
        await me.save()
             }
             await sgMail.send({
                to: mailid,
                from: {
                    email: 'admin@samhita.org.in',
                    name: 'Samhita MIT'
                },
                templateId: 'd-f4be981118444ad0a4970b21abbc3a7d',
                dynamic_template_data: {
                    name: name,
                    userid:sid
                }
            })
            await smsobject.samhitaticket(sid,name,phone,"")
    
            }

        let work;
        type=details.workshop
        let po={}
        po['status']="success"
        if(type=='none'){
         console.log(po)
            return po;
        }
        //console.log(type)
        if(type.charAt(1)=='m')
             {
                 let num=parseInt(type.charAt(2))
                    const ml = await new mluser({
                        userid: sid,
                        name: name,
                        email: mailid,
                        phone: phone,
                        tickets:num,
                        status:1,
                        txnid:["onsight"]
                    })
                    await ml.save()
                    await sgMail.send({
                        to: mailid,
                        from: {
                            email: 'admin@samhita.org.in',
                            name: 'Samhita MIT'
                        },
                        templateId: 'd-cb451690a9e5426d86daf069fa8421e7',
                        dynamic_template_data: {
                            name: name,
                            userid:mailid
                        }
                    })
                    await smsobject.mlworkshop(sid,name,phone,"")
             }

             if(type.charAt(1)=='y')
             {
                 let num=parseInt(type.charAt(2))
                    const ml = await new pythonuser({
                        userid: sid,
                        name: name,
                        email: mailid,
                        phone: phone,
                        tickets:num,
                        status:1,
                        txnid:["onsight"]
                    })
                    await ml.save()
                    await sgMail.send({
                        to: mailid,
                        from: {
                            email: 'admin@samhita.org.in',
                            name: 'Samhita MIT'
                        },
                        templateId: 'd-64c4a52be5734dff8197228b573e8cdf',
                        dynamic_template_data: {
                            name: name,
                            userid:sid
                        }
                    })
                    await smsobject.pythonworkshop(sid,name,phone,"")
        
                
             }

             if(type.charAt(1)=='i')
             {
                 let num=parseInt(type.charAt(2))
                    const ml = await new aiuser({
                        userid: sid,
                        name: name,
                        email: mailid,
                        phone: phone,
                        tickets:num,
                        status:1,
                        txnid:["onsight"]
                    })
                    await ml.save()
                    await sgMail.send({
                        to: mailid,
                        from: {
                            email: 'admin@samhita.org.in',
                            name: 'Samhita MIT'
                        },
                        templateId: 'd-d9499dc39db7407ca7880cad775e8218',
                        dynamic_template_data: {
                            name: name,
                            userid:sid
                        }
                    })
                    await smsobject.aiworkshop(sid,name,phone,"")
             }

             if(type.charAt(1)=='a')
             {
                 let num=parseInt(type.charAt(2))
                    const ml = await new mluser({
                        userid: sid,
                        name: name,
                        email: mailid,
                        phone: phone,
                        tickets:num,
                        status:1,
                        txnid:["onsight"]
                    })
                    await ml.save()
                    await sgMail.send({
                        to: mailid,
                        from: {
                            email: 'admin@samhita.org.in',
                            name: 'Samhita MIT'
                        },
                        templateId: 'd-4be92285735344e3b84b5cb2c9a8fee8',
                        dynamic_template_data: {
                            name: name,
                            userid:sid
                        }
                    })
                    await smsobject.androidworkshop(sid,name,phone,"")
             }
             return po
        







    }








        


    }




module.exports = myobject




// let myObj=new myobject()
// async function a() {
//     if (await myObj.checkloginuser('gowtha0276bin@gmail.com','a') == 1)
//         console.log("suc")
//     else
//         console.log("fai")
// }
// a();