import express from 'express';
import * as dotenv from 'dotenv'
dotenv.config()
import productsRouter from './routes/products.router.js'
import cartRouter from './routes/cart.router.js'

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api/products', productsRouter)
app.use('/api/carts', cartRouter)

const PORT = process.env.PORT || 3005

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));