import express from 'express';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import { Server } from 'socket.io'
import * as dotenv from 'dotenv';
dotenv.config();

import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';
import viewsRouter from './routes/views.router.js';
import ProductManager from './dao/fileSystem/manager/productManager.js';

import registerChatHandler from './listeners/chatHandler.js';

import __dirname from './utils.js';

const productManager = new ProductManager('./products.json')

const app = express();
/* COMO ES CON FINES EDUCATIVOS DEJE LA CONTRASEÑA HARDCODEADA */
const PASSWORD = process.env.PASSWORD || "A2hr3YMhjqzkLEfq"
const connection = mongoose.connect(`mongodb+srv://marcosfvizio:${PASSWORD}@cluster0.vdd5ngb.mongodb.net/ecommerce?retryWrites=true&w=majority`)
const PORT = process.env.PORT || 3005
const server = app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
const io = new Server(server)

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(`${__dirname}/public`))

app.use((req, res, next) => {
    req.io = io;
    next();
})

io.on('connection', async socket => {
    registerChatHandler(io, socket)
    console.log('Nuevo cliente conectado!');
    const products = await productManager.getProducts();
    io.emit('products', products)
})  

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')

app.use('/api/products', productsRouter)
app.use('/api/carts', cartRouter)
app.use('/', viewsRouter)