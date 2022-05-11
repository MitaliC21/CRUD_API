const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Product = require('./model/product.js')
const methodoverride = require('method-override');

//connecting mongodb to express using mongoose
mongoose.connect('mongodb://localhost:27017/toDos',{useNewUrlParser:true, useUnifiedTopology:true})
    .then(() => {
    console.log("Database Connected")
    })
    .catch(err => {
    console.log("MOngo error")
    console.log(err)
    })

app.use(express.urlencoded({extended: true}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')
app.use(methodoverride('_method'));

app.get('/products', async(req,res) => {
    const products = await Product.find({});
    res.render('products/index',{products});
})

app.get('/products/new', (req,res) => {
    res.render('products/new')
})

app.post('/products', async(req,res) => {
    const newProduct = new Product(req.body);
    console.log(newProduct);
    await newProduct.save()
    res.redirect(`/products/${newProduct._id}`);
})

app.get('/products/:id', async(req,res) => {
    const {id} = req.params;
    const product = await Product.findById(id)
    res.render('products/show', {product});
})

app.get('/products/:id/edit', async(req,res) => {
    const {id} = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', {product});
})

app.put('/products/:id', async(req,res) => {
    const {id} = req.params;
    const product = await Product.findByIdAndUpdate(id,req.body,{runValidators:true});
    res.redirect(`/products/${product._id}`);
})

app.delete('/products/:id', async(req,res) => {
    const {id} = req.params;
    const product = await Product.findByIdAndDelete(id);
    res.redirect('/products');
})

app.listen(3000, (req,res) => {
    console.log("Listening on port 3000")
})