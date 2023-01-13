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

                await fs.promises.writeFile(this.path, `${JSON.stringify(dataJS, null, 2)}`, 'utf-8')        //se escribe en el archivo los productos en JSON

            }else{                           //si el archivo NO existe se crea uno
                product.id = 1
                const arrProducts = [product]

                await fs.promises.writeFile(this.path, `${JSON.stringify(arrProducts, null, 2)}`, 'utf-8')   //se crea el archivo con el producto en JSON
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

    async updateProduct(id, obj){
        try {
            let data = await fs.promises.readFile(this.path, 'utf-8')
            let dataJS = JSON.parse(data)

            let productById = dataJS.find(product => product.id == id)

            productById = obj
            productById.id = id

            dataJS.splice((id - 1), 1, productById)

            console.log(dataJS)

            await fs.promises.writeFile(this.path, `${JSON.stringify(dataJS, null, 2)}`, 'utf-8')
        } catch (error) {
            return console.log(error);
        }
    }

    async deleteProduct(id){
        let data = await fs.promises.readFile(this.path, 'utf-8')
        let dataJS = JSON.parse(data)

        dataJS.splice((id - 1), 1)

        let contador = 1

        dataJS.forEach(product => {
            product.id = contador++
        })

        await fs.promises.writeFile(this.path, `${JSON.stringify(dataJS, null, 2)}`, 'utf-8')
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

let remplazo =  {
                    title: "Remplazo",
                    description: "obj actualizado",
                    price: 500,
                    thumbnail: "link",
                    code : 200,
                    stock: 15
                }

productManager.addProduct("titulo", "es una prueba", 500, "link", 200, 15)

setTimeout(()=>{
    productManager.addProduct("titulo 2", "es una prueba", 500, "link", 200, 15)
},100)

setTimeout(()=>{
    productManager.addProduct("titulo 3", "es una prueba", 500, "link", 200, 15)
},200)

setTimeout(()=>{
    productManager.getProducts()
},300)

setTimeout(()=>{
    productManager.getProductById(2)
},400)

setTimeout(()=>{
    productManager.updateProduct(1, remplazo)
},500)

setTimeout(()=>{
    productManager.deleteProduct(4)
},600)