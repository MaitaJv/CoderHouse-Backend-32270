import { Router } from "express"
import { ProductManager } from "../dao/fileSystem/productManager.js"
import { CartManager } from "../dao/fileSystem/cartManager.js"
import cartsModel from "../models/carts.js"
import productsModel from "../models/products.js"

const router = Router()

const productManager = new ProductManager
const cartManager = new CartManager

router.post('/', async (req, res) => {
    //await cartManager.createCart()          // se crea un nuevo carrito {id, products: []}
    
    await cartsModel.create({products: []})

    res.send({mensaje: "carrito creado"})
})

router.get('/:cid', async (req, res) => {
    const { cid } = req.params              // se recibe cid de los parametros
    
    let arrPC = []
    try {
        //const cartProducts = await cartManager.getCartProducts(cid)     // se guarda en carProducts el arreglo de productos del carrito cuyo id sea igual a cid
    
        const cartProducts = await cartsModel.findOne({_id: cid})
        // console.log(cartProducts.products)

        await cartProducts.products.forEach( async product => {
            try {
                let producto = await productsModel.findOne({pid: product.pid})

                producto.cantidad = product.quantity
                arrPC.push(producto)

                if (arrPC.length == cartProducts.products.length) {
                    res.send(arrPC)
                }
            } catch (error) {
                console.log(error)
            }
        })


        // await cartProducts.products.forEach(async (element) => {                 // se recorre cartProducts 
        //     try {
        //         let product = await productManager.getProductById(element.id)   // se guarda en product el producto entero

        //         let product = await productsModel.findOne({_id: element._id})

        //         product.quantity = element.quantity
        //         arrPC = [...arrPC, product]             // se guardan todos los productos en arrPC

        //         if(cartProducts.length == arrPC.length) res.send(arrPC)     // cuando se haya terminado de recorrer el arreglo respondemos a la peticion con arrPC
        //     } catch (error) {
        //         console.log(error)
        //     }
        // })
    } catch (error) {
        console.log(error)
    }
    
})

router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params         // se reciben cid, pid de los parametros

    try {
        //await cartManager.uploadProduct(cid, pid)   // se sube el producto al carrito

        //----------------------------------------------------

        let carrito = await cartsModel.findOne(
            {
                cid: cid
            }
        )

        let product = carrito.products.find(product => product.pid == pid)
        
        //---------------------------------------------------

        if (product !== undefined) {
            await cartsModel.updateOne(
                {
                    cid: cid
                },
                {
                    $set:
                    {
                        'products.$[pid]': {'pid': pid, 'quantity': product.quantity + 1}
                    }
                },
                {
                    arrayFilters: 
                    [
                        {'pid.pid': pid}
                    ]
                }
            )
        }

        if (product == undefined) {
            await cartsModel.findByIdAndUpdate(cid, {$push: {'products': {pid: pid, quantity : 1}}})
        }

        //---------------------------------------------------

        // await cartsModel.findByIdAndUpdate(cid, {$push: {'products': {pid: pid, quantity : 1}}})

        //----------------------------------------------------

        // await cartsModel.updateOne(
        //     {
        //         cid: cid
        //     },
        //     {
        //         $set:
        //         {
        //             'products.$[pid]': {'pid': pid, 'quantity': 3}
        //         }
        //     },
        //     {
        //         arrayFilters: 
        //         [
        //             {'pid.pid': pid}
        //         ]
        //     }
        // )

        //-----------------------------------------------------------

        res.send({mensaje: "producto agregado al carrito"})

    } catch (error) {
        console.log(error)
    }
})

export default router