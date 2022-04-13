const express = require('express')
const cors = require('cors')
var path = require('path');
const crypto    = require('crypto');
const bodyParser = require('body-parser')
const app = express()
const object = require('./Functions')
const razor = require('razorpay')
const router = require("express").Router();

app.use(cors())
app.use(bodyParser.json())


app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));


app.post('/register', (req, res) => {
    let name = req.body.name;
    let email = req.body.mailid;
    let phonenum = req.body.contactnum;
    let password = req.body.pass;
    let college = req.body.collegename;
    let depart = req.body.dept;
    let yaerstu = req.body.year;
    let myObj = new object();

    let result = {}
    result['status'] = 'success';

    let failure = {}
    failure['status'] = 'failure';

    async function a() {
        if (await myObj.update(name, email, phonenum, college, password, depart, yaerstu) == 1)
            return res.status(200).json(result);
        else
            return res.status(200).json(failure);
    }
    a();

})

var PORT = process.env.PORT || 4000;




// app.get('/paywithrazorpay',async function(req, res, next){
   
   
//     let encryptedJSON = req.query.redirect

//     let amountstr = encryptedJSON.substr(3, 3)

//     let userid = encryptedJSON.substr(encryptedJSON.length - 6, 4)
//     let type = encryptedJSON.substr(encryptedJSON.length - 2)
//     let amount=null
//     if (amountstr == 'dl*')
//         amount = 250
//     if(amountstr == 'qp-')
//         amount=750
//     if(amountstr == 'wb%')
//         amount=850
//     if(amountstr == 'yo@')
//         amount=800
//     let tax = amount * 0.0175
//     amount = parseInt(amount) + parseInt(tax)

    
   
   
   
   
//     let myObj = new object();
//     let oid=Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
//     oid+=''
//     oid+=userid
//     oid+=type
//     let rand=await myObj.getdetails123(userid)
//     console.log(rand)

// 	var postData = {
// 		"appId" : "35245fcca8b1e02599ad553c254253",
// 		"orderId" : oid,
// 		"orderAmount" : amount,
// 		"orderCurrency" : "INR",
// 		"orderNote" : "Test Order",
// 		'customerName' : rand.name,
// 		"customerEmail" : rand.email,
// 		"customerPhone" : rand.phone,
// 		"returnUrl" : /*"https://samhita-backend.herokuapp.com/response"*/"http://localhost:4000/response"
// 	},
// 	mode = "PROD",
// 	secretKey = "secretKey",
// 	sortedkeys = Object.keys(postData),
// 	url="",
// 	signatureData = "";
// 	sortedkeys.sort();
// 	for (var i = 0; i < sortedkeys.length; i++) {
// 		k = sortedkeys[i];
// 		signatureData += k + postData[k];
// 	}
// 	var signature = crypto.createHmac('sha256',secretKey).update(signatureData).digest('base64');
// 	postData['signature'] = signature;
// 	if (mode == "PROD") {
// 	  url = "https://www.cashfree.com/checkout/post/submit";
// 	} else {
// 	  url = "https://test.cashfree.com/billpay/checkout/post/submit";
// 	}
// 	console.log(postData)
// 	res.render('request',{postData : JSON.stringify(postData),url : url});
// });

app.post("/orders", async (req, res) => {
	try {
		const instance = new razor({
			key_id: "rzp_test_h3jaqLG39VxWwP",
			key_secret: "dl453MHchKT72iZeGyMMPZGZ",
		});
        if (req.body.amount == 'dl*')
            amount = 300
        if (req.body.amount == 'wb%')
            amount = 849
        if (req.body.amount == 'yo@')
            amount = 799
        console.log(amount);
		const options = {
			amount: amount * 100,
			currency: "INR",
			receipt: crypto.randomBytes(10).toString("hex"),
		};

		instance.orders.create(options, (error, order) => {
			if (error) {
				console.log(error);
				return res.status(500).json({ message: "Something Went Wrong!" });
			}
			res.status(200).json({ data: order });
		});
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error!" });
		console.log(error);
	}
});

app.post("/verify", async (req, res) => {
	// try {
		const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
			req.body.resp;
		const sign = razorpay_order_id + "|" + razorpay_payment_id;
		const expectedSign = crypto
			.createHmac("sha256","dl453MHchKT72iZeGyMMPZGZ")
			.update(sign.toString())
			.digest("hex");
            console.log(req.body.id+"\n"+req.body.w_id);
        let myObj = new object();
		if (razorpay_signature === expectedSign) {
            if(req.body.w_id == "s1"){
                console.log("s1");
                async function a() {
                    await myObj.payment(req.body.id, razorpay_payment_id, 1)
                }
                a();
            }
            if(req.body.w_id == "m1"){
                console.log("m1");
                async function a() {
                    await myObj.mlworkshop(req.body.id, razorpay_payment_id, 1,"TXN_SUCCESS")
                }
                a();
            }
            if(req.body.w_id == "i1"){
                console.log("i1");
                async function a() {
                    await myObj.pythonworkshop(req.body.id, razorpay_payment_id,1,"TXN_SUCCESS")
                }
                a();
            }
            if(req.body.w_id == "e1"){
                console.log("e1");
                async function a() {
                    await myObj.ethicalworkshop(req.body.id, razorpay_payment_id,1,"TXN_SUCCESS")
                }
                a();
            }
            if(req.body.w_id == "a1"){
                console.log("a1");
                async function a() {
                    await myObj.aiworkshop(req.body.id, razorpay_payment_id,1,"TXN_SUCCESS")
                }
                a();
            }
            if(req.body.w_id == "p1"){
                console.log("p1");
                async function a() {
                    await myObj.android(req.body.id, razorpay_payment_id,1,"TXN_SUCCESS")
                }
                a();
            }
			return res.status(200).json({ message: "Payment verified successfully" });

		} else {
			return res.status(400).json({ message: "Invalid signature sent!" });
		}
	// } catch (error) {
	// 	res.status(500).json({ message: "Internal Server Error!" });
	// 	console.log(error);
	// }
});
// app.post("/orders",async (req, res)=>{
//     try{
//         const instance = new razor({
//             key_id: "rzp_test_nUCXqMO9VGviQX",
//             key_secret: "vZzKDbDILXtXGgfW0mcdDd2U",
//         });
//         console.log(typeof req.body.amount);
//         const option={
//             amount : req.body.amount*10,
//             currency:"INR",
//             receipt: crypto.randomBytes(10).toString("hex"),
//         };
//         console.log("bye");
//         instance.orders.create(option,(error,order)=>{
//             if(error){
//                 console.log(error);
//                 return res.status(500).json({message:"Something went wrong"});
//             }
//             res.status(200).json({data:order});
//         });
//         console.log("ama");
//     }catch(error){
//         console.log(error);
//         console.log("inga tha da iruken");
//         res.status(500).json({message:"Internal Server Error"});
//     }
// });

// app.post("/verify",async(req,res)=>{
//     try{
//         const{
//             razorpay_order_id,
//             razorpay_payment_id,
//             razorpay_signature}= req.body;
//             const sign = razorpay_order_id + "|" + razorpay_payment_id;
//             const expectedSign = crypto.createHmac("sha256",process.env.KEY_SECRET)
//             .update(sign.toString())
//             .digest("hex");

//             if(razorpay_signature === expectedSign){
//                 return res.status(200).json({message:"Payment verified successfully"});
//             }else{
//                 return res.(400).json({message:"Invalid signature sent!"});
//             }
//         } catch(error){
//             console.log(error);
//             res.status(500).json({message:"Internal Server Error!"});
//         }
//     });

// app.post('/response',function(req, res, next){
//     let red=req.body.txStatus
//     console.log("success")
// 	var postData = {
// 	  "orderId" : req.body.orderId,
// 	  "orderAmount" : req.body.orderAmount,
// 	  "referenceId" : req.body.referenceId,
// 	  "txStatus" : req.body.txStatus,
// 	  "paymentMode" : req.body.paymentMode,
// 	  "txMsg" : req.body.txMsg,
// 	  "txTime" : req.body.txTime
// 	 },
// 	secretKey = "secretKey",

//     signatureData = "";
//     let myObj = new object();
//     let oid=req.body.orderId;
//     let userid=oid.substr(oid.length-6,4)
//     let type=oid.substr(oid.length-2,1)
//     let num=oid.substr(oid.length-1)
//     if(red=='SUCCESS')
//         red='TXN_SUCCESS'
//     let success=red
//     let txn=oid
//     if (success == "TXN_SUCCESS" && type == 's') {
//         async function a() {
//             await myObj.payment(userid, txn,num)
//         }
//         a();
//     }
//     else if (type == 'm') {
//         async function a() {
//             await myObj.mlworkshop(userid, txn, num, success)
//         }
//         a();
//     }
//     else if(type=='a'){
//         async function a(){
//             console.log("hello")
//             await myObj.android(userid, txn, num, success)
//         }
//         a();
//     }
//     else if(type=='e'){
//         async function a(){
//             return
//             await myObj.ethicalworkshop(userid, txn, num, success)
//         }
//         a();
//     }
//     if(type=='i'){
//         async function a(){
//             await myObj.aiworkshop(userid, txn, num, success)
//         }
//         a();
//     }
//     if(type=='p'){
//         async function a(){
//             await myObj.pythonworkshop(userid, txn, num, success)
//         }
//         a();
//     }
    
// 	for (var key in postData) {
// 		signatureData +=  postData[key];
// 	}
// 	var computedsignature = crypto.createHmac('sha256',secretKey).update(signatureData).digest('base64');
// 	postData['signature'] = req.body.signature;
// 	postData['computedsignature'] = computedsignature;
// 	res.render('response',{postData : JSON.stringify(postData)});
// });



app.post('/login', (req, res) => {
    let email = req.body.mailid;
    let password = req.body.pass;
    let myObj = new object();
    let result = {}
    async function a() {
        result = await myObj.checkloginuser(email, password)
        if (result.islogged == 1) {

            console.log(result)
            return res.status(200).json(result);
        } else {
            console.log("fail")
            return res.status(200).json(result);
        }
    }
    a();
})



app.post('/details', (req, res) => {
    let uid = req.body.userid;

    let myObj = new object();

    let result = {}
    async function a() {
        result = await myObj.getdetails(uid)
        return res.status(200).json(result);
    }
    a();
})

app.post('/userid', (req, res) => {
    let uid = req.body.userid;

    let myObj = new object();

    let result = {}
    async function a() {
        result = await myObj.getuser(uid)
        return res.status(200).json(result);
    }
    a();
})




app.post('/mail',(req,res)=>
{
    let mailid=req.body.mailid
    let myObj=new object();
    let result={}
    async function a() {
        result = await myObj.mailcheck(mailid)
        return res.status(200).json(result);
    }
    a();
})
app.post('/onsight', (req, res) => {
    let name  = req.body.name;
    let userid=req.body.userid;
    let email=req.body.email;
    let phone=req.body.phone;
    let type=req.body.type;
    let workshop=req.body.workshop

    let red={}
    red['name']=name;
    red['email']=email
    red['phone']=phone
    red['user']=userid
    red['type']=type
    red['workshop']=workshop
    console.log("hit")
    let myObj = new object();
    let result = {}
    async function a() {
        result = await myObj.onsight(red)
        console.log(result)
        //result={}
        return res.status(200).json(result);
    }
    a();
})
app.post('/forgotpassword', (req, res) => {
    let phone = req.body.phonenumber;
    let myObj = new object();
    let result = {}
    async function a() {
        if (await myObj.forgotpass(phone) != 0) {
            result['status'] = "success"
            return res.status(200).json(result);
        } else {
            result['status'] = "failure"
            return res.status(200).json(result);
        }
    }
    a();
})

app.get('/',(req,res)=>{
    res.render('index', { title: 'RazorPay PG simulator' });
})
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))