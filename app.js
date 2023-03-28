const express = require('express');
const app = express();
const mongoose = require('mongoose')
const Customer = require('./models/customer')
const ejsMate = require('ejs-mate')
const path = require('path');
const Order = require('./models/order');
const methodOverride = require('method-override')

mongoose.connect('mongodb+srv://deepak_001:Ko487VoiRZVg933t@cluster0.nmspfjp.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error'))
db.once("open", () => {
    console.log('Database Connected')
})

app.use(express.json())
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended: true}))

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))

app.get('/', async(req, res) => {
    const customers = await Customer.find({})
    const orders = await Order.find({}).populate('customer')
    res.render('index', {customers, orders})
})

app.get('/customer/create', (req, res, nex) => {
    res.render('customer/new')
})

app.post('/customer/create', async(req, res, nex) => {
    const customer = new Customer(req.body.customer)
    await customer.save()
    res.redirect('/')
})

app.get('/customer/:id', async(req, res, nex) => {
    const customer = await Customer.findById(req.params.id).populate('orders')
    res.render('customer/show', {customer})
})

app.get('/customer/:id/edit', async(req, res, nex) => {
    const customer = await Customer.findById(req.params.id)
    res.render('customer/edit', {customer})
})

app.post('/customer/:id/edit', async (req, res, nex) => {
    await Customer.findByIdAndUpdate(req.params.id, {...req.body.customer})
    res.redirect('/')
})

app.delete('/customer/:id/delete', async (req, res, nex) => {
    await Customer.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

app.get('/order/new', async(req, res, nex) => {
    const customers = await Customer.find({});
    res.render('order/new', {customers})
})

app.post('/order/new', async(req, res, nex) => {
    const order = new Order(req.body.order)
    const customer = await Customer.findById(order.customer)
    customer.orders.push(order)
    await customer.save()
    await order.save()
    res.redirect('/')
})

app.get('/order/:id', async(req, res, nex) => {
    const order = await Order.findById(req.params.id).populate('customer')
    res.render('order/show', {order})
})

app.get('/order/:id/edit', async (req, res, nex) => {
    const order = await Order.findById(req.params.id).populate('customer')
    const customers = await Customer.find({});
    const cus_id = order.customer.id
    res.render('order/edit', { order, customers, cus_id })
})

app.post('/order/:id/edit', async(req, res, nex) => {
    await Order.findByIdAndUpdate(req.params.id, { ...req.body.order })
    res.redirect(`/order/${req.params.id}`)
})

app.delete('/order/:cusId/:id', async (req, res, nex) => {
    await Customer.findByIdAndUpdate(req.params.cusId, { $pull: { orders: req.params.id } })
    await Order.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

app.listen(8080, () => {
    console.log('Serving on PORT 3000');
})