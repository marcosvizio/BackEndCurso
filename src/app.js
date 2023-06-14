import express from 'express';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import * as dotenv from 'dotenv';
dotenv.config();

import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';
import sessionsRouter from './routes/session.router.js';
import viewsRouter from './routes/views.router.js';

import ProductManager from './dao/mongoDb/manager/Products.js';
import registerChatHandler from './listeners/chatHandler.js';
import __dirname from './utils.js';

const app = express();

const PASSWORD = process.env.PASSWORD || "A2hr3YMhjqzkLEfq"
const PORT = process.env.PORT || 3005

const connection = mongoose.connect(`mongodb+srv://marcosfvizio:${PASSWORD}@cluster0.vdd5ngb.mongodb.net/ecommerce?retryWrites=true&w=majority`)
const server = app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
const io = new Server(server)

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(`${__dirname}/public`))

app.use(session({
    store: new MongoStore({
        mongoUrl: `mongodb+srv://marcosfvizio:${PASSWORD}@cluster0.vdd5ngb.mongodb.net/ecommerce?retryWrites=true&w=majority`,
        ttl: 3600
    }),
    secret: "ecommerceSecret",
    resave: false,
    saveUninitialized: false
}))

app.use((req, res, next) => {
    req.io = io;
    next();
})

const productManager = new ProductManager();

io.on('connection', async socket => {
    registerChatHandler(io, socket)
    const products = await productManager.getProducts();
    io.emit('products', products)
})  

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')

app.use('/api/products', productsRouter)
app.use('/api/carts', cartRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/', viewsRouter)