class ProductManager {
    constructor(){
        this.products = []
    }
    addProduct = (title,description,price,thumbnail,code,stock) => {
        const product = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }
        if (this.products.length===0) {
            product.id = 1
        }else{
            product.id = this.products[this.products.length - 1].id + 1;
        }
        const productCode = this.products.find(product => product.code === code)
        if (productCode) {
            console.log("Error: El CODE del producto ingresado ya es utilizado en otro producto.");
        } else {
            console.log(`El producto: ${product.title} ha sido cargado.`)
            this.products.push(product)
        }
    }
    getProducts = () => {
        console.log(this.products);
        return this.products;
    }
    getProductById = (id) => {
        const productId = this.products.find(product => product.id === id)
        if (productId) {
            console.log(productId);
            return productId;
        }else{
            console.log("Not found!");
        }
    }
}

const productManager1 = new ProductManager;

productManager1.addProduct("Pantalon","Pantalon de jean regular",5500,"pantalon.jpg",855,15);
//El siguiente producto tiene el codigo repetido con el de arriba.
productManager1.addProduct("Remera","Remera con estampado",3500,"remera.jpg",855,10);
productManager1.addProduct("Campera","Campera reversible y de buen aislamiento",5000,"campera.jpg",256,5);
productManager1.addProduct("Zapatillas","Zapatillas de running, muy comodas y de alta calidad",7000,"zapatillas.jpg",896,20);

productManager1.getProducts();

productManager1.getProductById(3);