const fs = require('fs')

class ProductManager {

    constructor(){
        this.path = './products.json'
    }

    async addProduct(title, description, price, thumbnail, code, stock){
        try{
            const product = {
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            }
            
            if(fs.existsSync(this.path)){     //si el archivo existe se pushea el producto

                let data = await fs.promises.readFile(this.path, 'utf-8') //data en JSON
                let dataJS = JSON.parse(data)                             //data en JS

                product.id = dataJS[dataJS.length - 1].id + 1             //agrego id
                dataJS.push(product)

                console.log(product)

                await fs.promises.writeFile(this.path, `${JSON.stringify(dataJS)}`, 'utf-8')        //se escribe en el archivo los productos en JSON

            }else{                           //si el archivo NO existe se crea uno
                product.id = 1
                const arrProducts = [product]

                await fs.promises.writeFile(this.path, `${JSON.stringify(arrProducts)}`, 'utf-8')   //se crea el archivo con el producto en JSON
            }
        }
        catch(err) {
            return console.log(err);
        }
    }

    async getProducts(){
        try{
            let data = await fs.promises.readFile(this.path, 'utf-8')
            let dataJS = JSON.parse(data)

            return console.log(dataJS);
        }
        catch(err) {
            return console.log(err);
        }
    }

    async getProductById(id){
        try {
            let data = await fs.promises.readFile(this.path, 'utf-8')
            let dataJS = JSON.parse(data)

            const productById = dataJS.find(product => product.id == id)

            return console.log(productById);
        } catch (error) {
            return console.log(error);
        }
    }

    async updateProduct(){

    }

    async deleteProduct(){
        
    }
}

const productManager = new ProductManager()

/// DE ESTA FORMA NO FUNCIONA -------------------------------------------------------------

// productManager.addProduct("titulo", "es una prueba", 500, "link", 200, 15)
// productManager.addProduct("titulo 2", "es una prueba", 500, "link", 200, 15)
// productManager.addProduct("titulo 3", "es una prueba", 500, "link", 200, 15)
// productManager.getProducts()
// productManager.getProductById(2)


/// DE ESTA FORMA FUNCIONA -------------------------------------------------------------

productManager.addProduct("titulo", "es una prueba", 500, "link", 200, 15)

setTimeout(()=>{
    productManager.addProduct("titulo 2", "es una prueba", 500, "link", 200, 15)
},1000)

setTimeout(()=>{
    productManager.addProduct("titulo 3", "es una prueba", 500, "link", 200, 15)
},2000)

setTimeout(()=>{
    productManager.getProducts()
},3000)

setTimeout(()=>{
    productManager.getProductById(2)
},4000)