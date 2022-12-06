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





		// let fileObj = [];
		// req.session.load = 5;
		// fs.readFile("./productDetails.txt", "utf-8", (err, data) => {
		// 	if (!err) {
		// 		fileObj = [];
		// 		if (data.length > 0 && data[0] === '[' && data[data.length - 1] ===']')
		// 			fileObj = JSON.parse(data);		
		// 		let name = req.session.activeuser.firstName;
		// 		let productDetails = fileObj.splice(0, req.session.load)
		// 		res.render('home.ejs', { name: name, productDetails: productDetails })
		// 	}
		// })
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











	// fs.readFile("./db.txt", "utf-8", (err, data) => {
	// 	if (!err) {
	// 		let file = [], count = 0;
	// 		if (data.length > 0 && data[0] === '[' && data[data.length - 1] ===']')
	// 			file = JSON.parse(data);
	// 		file.forEach((file) => {
	// 			if (file.email == req.body.email && file.password == req.body.password) {
	// 				req.session.activeuser = file;
	// 				count++;
	// 			}
	// 		})
	// 		if (count === 0) {
	// 			res.render('login.ejs', { name : "Invalid Credential!!" })
	// 		}
	// 		else {
	// 			req.session.is_logged_in = true;
	// 			res.redirect('/')
	// 		}
	// 	}
	// })
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







	// let a = 9;
	// fs.readFile("./db.txt", "utf-8", (err, data) => {
	// 	if (!err) {
	// 		let file1 = [];
	// 		if (data.length > 0 && data[0] === '[' && data[data.length - 1] ===']')
	// 			file1 = JSON.parse(data);
	// 		file1.forEach((file1) => {
	// 			if (file1.email === req.session.activeuser.email && file1.password != req.body.changePassword && req.body.changePassword.length >= 8){
	// 				file1.password = req.body.changePassword;
	// 				a = 0;
	// 			}
	// 		})
	// 		fs.writeFile('./db.txt', JSON.stringify(file1), (err) => {
	// 			res.redirect('/')
	// 			return;
	// 		})
	// 		if(a != 0){
	// 			res.redirect('/profile')
	// 		}
	// 	}
	// })
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





		// fs.readFile("./db.txt", "utf-8", (err, data) => {
		// 	if (!err) {
		// 		let { firstName, lastName, mobile, email, password } = req.body;
		// 		let file = [], count = 0;
		// 		if (data.length > 0 && data[0] === '[' && data[data.length - 1] === ']')
		// 			file = JSON.parse(data);
		// 		for(let i = 0; i < file.length; i++){
		// 			if ((file[i].email === req.body.email) || (req.body.email === '') || (req.body.password === '')) {
		// 				count++;
		// 			}
		// 		}
		// 		let user = {
		// 			firstName: firstName,
		// 			lastName: lastName,
		// 			mobile: mobile,
		// 			email: email,
		// 			password: password,
		// 			isVerified: true,
		// 			mailToken: Date.now()%10000
		// 		}
		// 		req.session.activeuser = user;
		// 		if (count == 0) {
		// 			file.push(user);
		// 			fs.writeFile("./db.txt", JSON.stringify(file), (err) => {
		// 				/*sendEmail(email, user.mailToken, (err, data) => {
		// 					if(err){
		// 						res.render('signup.ejs', { name : 'Something went wrong.' })
		// 						return;
		// 					}
		// 				})*/
		// 				// res.render('verifyEmail.ejs', { name : "Enter OTP and verify Email!!!" })
		// 				// res.redirect('/');
		// 			})
		// 			fs.readFile("./productDetails.txt", "utf-8", (err, data) => {
		// 				if (!err) {
		// 					let fileObj1 = [], fileObjCart = {}, k;
		// 					if (data.length > 0 && data[0] === '[' && data[data.length - 1] ===']')
		// 						fileObj1 = JSON.parse(data);
		// 					// req.session.is_logged_in = true;
		// 					fs.readFile('./cartItems.txt', 'utf-8', (err, data) => {
		// 						if (!err) {
		// 							if (data.length > 0 && data[0] === '{' && data[data.length - 1] ==='}')
		// 								fileObjCart = JSON.parse(data);		
		// 							k = req.session.activeuser.email;
		// 							fileObjCart[k] = {};
		// 							fs.writeFile('./cartItems.txt', JSON.stringify(fileObjCart), (err) => {
		// 							})
		// 						}
		// 					})
		// 					res.redirect('/');
		// 				}
		// 			})
		// 		}
		// 		else {
		// 			res.render('signup.ejs', { name : "Invalid Credentials!!" })
		// 		}
		// 	}
		// })
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


    // fs.readFile("./productDetails.txt", "utf-8", (err, data) => {
    //     if(!err){	
    //         let file = [];
    //         if(data.length > 0 && data[0] === '[' && data[data.length - 1] === ']')
    //             file = JSON.parse(data);
    //         let oo = {};
    //         oo = req.body;
    //         oo.image = req.file.filename;
    //         file.push(oo);
    //         fs.writeFile("./productDetails.txt", JSON.stringify(file), (err, data) => {
    //             res.end();
    //         })
    //     }
    // })
    // res.redirect('/')
})

app.route('/cart').get(async (req, res) => {
	if(req.session.is_logged_in){
		let activeUser = req.session.activeuser.email;
		const cartItem = await cartItems.findOne({ email: activeUser });
		res.render('cart.ejs',  { name : req.session.activeuser.firstName, userCartData : cartItem.cart })




		// let user = req.session.activeuser.email;
		// const cartItem = await cartItems.findOne({email : user});
		// let b = Object.keys(file[user]);
		// res.render('cart.ejs',  { name : req.session.activeuser.firstName, userCartData : file[l], url : b })




		
		// let file = {};
		// fs.readFile('./cartItems.txt', 'utf-8', (err, data) => {
		// 	if(!err){
		// 		file = JSON.parse(data)
		// 	}
		// 	let l = req.session.activeuser.email;
		// 	let b = Object.keys(file[l]);
		// 	res.render('cart.ejs',  { name : req.session.activeuser.firstName, userCartData : file[l], url : b })
		// })
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


		// let pName = productDetail[id].image; 
		// console.log(cartItem);
		// if(cartItem.cart.length > 0){
		// 	for(let i = 0; i < cartItem.cart.length; i++){
		// 		if(cart[i].image === pName)
		// 			break;
		// 	}
		// }
		
		// let pp = {
		// 	productName : productDetail[id].productName, 
		// 	price: productDetail[id].price,
		// 	image: pName,
		// 	qty: 1
		// }
		
		
		
		// productDetail.cart.push(pp);
		
		
		
		
		// const addCartItem = await cartItems.findOne({ email : activeUser });
		// const addCartItemUser = await cartItems.updateOne({ email : activeUser }, { url : pName });
		// console.log(addCartItem, addCartItemUser, activeUser);
		// addCartItemUser.save();
		// const addCartItemUserDetail = await addCartItemUser.create({ url : pName }, { productName : name, image : pName, price : price, qty : 1 });



		// let id = JSON.parse(req.body.id);
		// let fileObj = [], fileObjCart5 = {}, k, pName;
		// fs.readFile("./productDetails.txt", "utf-8", (err, data) => {
		// 	if (!err) {
		// 		fileObj = [];
		// 		if (data.length > 0 && data[0] === '[' && data[data.length - 1] ===']')
		// 			fileObj = JSON.parse(data);
		// 		fs.readFile('./cartItems.txt', 'utf-8', (err, data) => {
		// 			if (!err) {
		// 				if (data.length > 0 && data[0] === '{' && data[data.length - 1] ==='}')
		// 					fileObjCart5 = JSON.parse(data);	
		// 				k = req.session.activeuser.email;
		// 				pName = fileObj[id].image;
		// 				if(fileObjCart5[k][pName] != pName || fileObjCart5[k][pName][qty] == 0){
		// 					fileObjCart5[k][pName] = {
		// 						productName : fileObj[id].productName,
		// 						image : fileObj[id].image,
		// 						price : fileObj[id].price,
		// 						// details : fileObj[id].details,
		// 						qty : 1
		// 					};
		// 					fs.writeFile('./cartItems.txt', JSON.stringify(fileObjCart5), (err) => {
		// 						res.send("Verified")
		// 					})
		// 				}
		// 			}
		// 		})
		// 	}
		// })
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








		// let qtyDelete = {};
		// fs.readFile('./cartItems.txt', 'utf-8', (err, data) => {
		// 	if(!err){
		// 		qtyDelete = JSON.parse(data);
		// 	}
		// 	let a = req.session.activeuser.email;
		// 	let b = req.body.id;
		// 	delete qtyDelete[a][b];
		// 	fs.writeFile('./cartItems.txt', JSON.stringify(qtyDelete), (err) => {
		// 		res.send();
		// 	})
		// })
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


		// let qtyIncDec = {};
		// fs.readFile('./cartItems.txt', 'utf-8', (err, data) => {
		// 	if(!err){
		// 		qtyIncDec = JSON.parse(data);
		// 	}
		// 	let a = req.session.activeuser.email, nn;
		// 	let b = req.body.id;
		// 	if(req.body.val == 0 && qtyIncDec[a][b].qty > 1){
		// 		qtyIncDec[a][b].qty -= 1;
		// 		nn = qtyIncDec[a][b].qty;
		// 	}
		// 	else if(req.body.val == 1){
		// 		qtyIncDec[a][b].qty += 1;
		// 		nn = qtyIncDec[a][b].qty;
		// 	}
		// 	else{
		// 		res.send("More than 1")
		// 	}
		// 	fs.writeFile('./cartItems.txt', JSON.stringify(qtyIncDec), (err) => {
		// 		res.send(JSON.stringify(nn));
		// 	})
		// })
	}
})

app.get('/loadMoreData', async (req, res) => {
	const productDetail = await productDetails.find({});
	let abc = productDetail.splice(req.session.load, 5);
	req.session.load += 5;
	res.json(abc);

	// let abc = [];
	// fs.readFile("./productDetails.txt", "utf-8", (err, data) => {
	// 	if (!err) {
	// 		if (data.length > 0 && data[0] === '[' && data[data.length - 1] ===']')
	// 			abc = JSON.parse(data);		
	// 		let productDetails = abc.splice(req.session.load, 5)
	// 		req.session.load += 5;
	// 		res.json(productDetails);
	// 	}
	// })
})

app.get('/getData', async (req, res) => {
	const productDetail = await productDetails.find();
	res.send(productDetail);


	// fs.readFile("./productDetails.txt", "utf-8", (err, data) => {
	// 	if (!err) {
	// 		res.send(data);
	// 	}
	// })
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