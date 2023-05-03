import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io'
import * as dotenv from 'dotenv';
import __dirname from './utils.js';
import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';
import viewsRouter from './routes/views.router.js';
import ProductManager from '../productManager.js';
dotenv.config();

const productManager = new ProductManager('./products.json')

const app = express();
const PORT = process.env.PORT || 3005
const server = app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
const io = new Server(server)

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(`${__dirname}/public`))

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')

app.use('/api/products', productsRouter)
app.use('/api/carts', cartRouter)
app.use('/', viewsRouter)

app.use((req, res, next) => {
    req.io = io;
    next();
})

io.on('connection', async socket => {
    console.log('Nuevo cliente conectado!');
    const products = await productManager.getProducts();
    io.emit('products', products)
})