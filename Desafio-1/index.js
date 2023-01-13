class ProductManager{
    constructor(){
        this.products = []
    }
    addProduct(title, description, price, thumbnail,  stock){
        const product = {
                            title,
                            description,
                            price,
                            thumbnail,
                            stock
                        }
        
        if(this.products.length == 0){
            product.code = 1
        }else{
            product.code = this.products[this.products.length - 1].code + 1
        }
        this.products.push(product)
    }
    getProducts(){
        return this.products;
    }
    getProductById(code){
        const productById = this.products.find(product => product.code == code)
        
        productById ? productById : "Not found"
    }
}

const productManager = new ProductManager();

productManager.addProduct("titulo", "es una prueba", 500, "link", 15)
productManager.addProduct("titulo", "es una prueba", 500, "link", 15)
productManager.addProduct("titulo", "es una prueba", 500, "link", 15)
productManager.getProducts()
productManager.getProductById(4)