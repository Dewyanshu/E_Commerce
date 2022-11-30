const express = require('express')
const ejs = require('ejs')
const fs = require('fs')
const session = require('express-session')
const multer = require('multer')
const upload = multer({dest: 'uploads/'})
const app = express()
const port = 3000
// const e = require('express')
// const sendEmail = require('./methods/sendEmail.js')

app.use(express.static('public'))
app.use(express.static('uploads'))
app.set('view-engine', 'ejs')
app.use(express.urlencoded({extended : true }))
app.use(express.json())

const serverStart = require('./dataBase/startServer.js')
serverStart();
const userDetails = require('./dataBase/userDetails.js')
const cartItems = require('./dataBase/cartItems.js')
const productDetails = require('./dataBase/productDetails.js')

app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
}))

app.route('/').get(async (req, res) => {
	if (req.session.is_logged_in) {
		req.session.load = 5;
		let name = req.session.activeuser.firstName;
		const fileObj = await productDetails.find({});
		const productDetail = fileObj.splice(0, req.session.load);
		res.render('home.ejs', { name: name, productDetails: productDetail })
	}
	else {
		res.render('login.ejs', {name : ""})
	}
})
.post(async (req, res) => {
	const existingUser = await userDetails.findOne({ email: req.body.email});
	if(existingUser){
		if(existingUser.password == req.body.password){
			req.session.activeuser = existingUser;
			req.session.is_logged_in = true;
			res.redirect('/')
			return;
		}
	}
	res.render('login.ejs', { name : "Invalid Credential!!" })
})

app.route('/profile').get((req, res) => {
	if(req.session.is_logged_in){
		res.render('profile.ejs', {name: req.session.activeuser.firstName, Email: req.session.activeuser.email});
	}
	else{
		res.redirect('/');
	}
})
.post(async (req, res) => {
	if(req.body.changePassword.length > 7){
		const user = await userDetails.updateOne({email : req.session.activeuser.email}, {password: req.body.changePassword});
		res.redirect('/')
		return;
	}
	else{
		res.redirect('/profile');
	}
})

app.route('/signup').get((req, res) => {
    if(req.session.is_logged_in) {
		res.redirect('/');
	}
	else{
        res.render('signup.ejs', { name : "" })
	}
})
.post(async (req, res) => {
	if (req.session.is_logged_in) {
		res.redirect('/');
	}
	else {
		const { firstName, lastName, mobile, email, password } = req.body;
		const existingUser = await userDetails.findOne({ email: email});
		if(!existingUser  && !(req.body.email === '') && !(req.body.password === '')){
				req.session.activeuser = req.body;
				const userDetail = new userDetails();
				userDetail.firstName = firstName;
				userDetail.lastName = lastName;
				userDetail.mobile = mobile;
				userDetail.email = email;
				userDetail.password = password;
				userDetail.isVerified = true;
				userDetail.save();
				const cartItem = new cartItems();
				cartItem.email = email;
				cartItem.save();
				res.redirect('/');
		}
		else{
			res.render('signup.ejs', { name : "Invalid Credentials!!" });
		}
	}
})

app.route('/73665e26tfgyusdg23tfbcdgvjyhsf73t2872').get((req, res) => {
    res.render('adminPage.ejs')
})
.post(upload.single('productImage'), (req, res) => {
	const productDetail = new productDetails();
	productDetail.productName = req.body.productName;
	productDetail.details = req.body.details;
	productDetail.price = req.body.price;
	productDetail.image = req.file.filename;
	productDetail.save();
	res.redirect('/');
})

app.route('/cart').get(async (req, res) => {
	if(req.session.is_logged_in){
		let activeUser = req.session.activeuser.email;
		const cartItem = await cartItems.findOne({ email: activeUser });
		res.render('cart.ejs',  { name : req.session.activeuser.firstName, userCartData : cartItem.cart })
	}
	else
		res.redirect('/')
})
.post(async (req, res) => {
	if(req.session.is_logged_in){
		let a = 0, id = JSON.parse(req.body.id), activeUser = req.session.activeuser.email;
		const productDetail = await productDetails.find({});
		cartItems.findOne({ email: activeUser }, function(err, data){
			let pName = productDetail[id].image;
			if(data.cart.length > 0){
				for(let i = 0; i < data.cart.length; i++){
					if(data.cart[i].image === productDetail[id].image){
						data.cart[i].qty = 1;
						a = 1;
						break;
					}
				}
			}
			if(a === 0 || data.cart.length === 0){
				let obj = {
					productName : productDetail[id].productName, 
					price: productDetail[id].price,
					image: productDetail[id].image,
					qty: 1
				}
				data.cart.push(obj);
			}
			cartItems.updateOne({ email: activeUser }, { cart: data.cart }, function(err, result){
				res.end();
			});
		});
	}
})

app.post('/delete', (req, res) => {
	if(req.session.is_logged_in){
		let activeUser = req.session.activeuser.email;
		let id = req.body.id;
		cartItems.findOne({ email: activeUser }, (err, data)=> {
			for(let i = 0; i < data.cart.length; i++){
				if(data.cart[i].image === id){
					data.cart.splice(i, 1);
					cartItems.updateOne({ email: activeUser }, { cart: data.cart }, function(err, result){
						res.send();
					});
					break;
				}
			}
		});
	}
})

app.post('/qty', async (req, res) => {
	if(req.session.is_logged_in){
		let activeUser = req.session.activeuser.email;
		let id = req.body.id, nn;
		cartItems.findOne({ email: activeUser }, (err, data) => {
			for(let i = 0; i < data.cart.length; i++){
				if(data.cart[i].image === id){
					if(req.body.val == 0 && data.cart[i].qty > 1){
						data.cart[i].qty -= 1;
						nn = data.cart[i].qty;
					}
					else if(req.body.val == 1){
						data.cart[i].qty += 1;
						nn = data.cart[i].qty;
					}
				 	else{
						res.send("More than 1")
					}
					cartItems.updateOne({ email: activeUser }, { cart: data.cart }, function(err, result){
						res.send(JSON.stringify(nn));
					});
					break;
				}
			}
		});
	}
})

app.get('/loadMoreData', async (req, res) => {
	const productDetail = await productDetails.find({});
	let abc = productDetail.splice(req.session.load, 5);
	req.session.load += 5;
	res.json(abc);
})

app.get('/getData', async (req, res) => {
	const productDetail = await productDetails.find();
	res.send(productDetail);
})

/*app.route('/verifyEmail').get((req, res) => {
	if(req.session.is_logged_in)
		res.redirect('/');
	else
		res.render('verifyEmail.ejs', { name : "Enter OTP and verify Email!!!" })
})
.post((req, res) => {
	let a =0;
	fs.readFile("./db.txt", "utf-8", (err, data) => {
		let p = [];
		if (data.length > 0 && data[0] === '[' && data[data.length - 1] === ']'){
			p = JSON.parse(data);
			for(let i = 0; i < p.length; i++){
				if(p[i].mailToken == req.body.OTP && p[i].email == req.body.email && p[i].password == req.body.password){
					p[i].isVerified = true;
					a=8;
					req.session.activeuser = p[i];
					fs.writeFile("./db.txt", JSON.stringify(p), (err) => {
						res.end();
					})
					fs.readFile("./productDetails.txt", "utf-8", (err, data) => {
						if (!err) {
							let fileObj1 = [], fileObjCart = {}, k;
							if (data.length > 0 && data[0] === '[' && data[data.length - 1] ===']')
								fileObj1 = JSON.parse(data);
							req.session.is_logged_in = true;


							fs.readFile('./cartItems.txt', 'utf-8', (err, data) => {
								if (!err) {
									if (data.length > 0 && data[0] === '{' && data[data.length - 1] ==='}')
										fileObjCart = JSON.parse(data);		
									k = req.session.activeuser.email;
									fileObjCart[k] = {};
									fs.writeFile('./cartItems.txt', JSON.stringify(fileObjCart), (err) => {
									})
								}
							})
							res.redirect('/');
						}
					})
				}
			}
		}
		if(a!=8)
		{
			res.render('verifyEmail.ejs', { name : "Enter OTP and verify Email!!!" })
		}
	})
})*/

app.get('/logout', (req, res) => {
    p = 0;
	load = 5;
    req.session.destroy();
    res.redirect('/')
})

app.get('*', (req, res) => {
    res.end('404 Found : No such URL exist')
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})