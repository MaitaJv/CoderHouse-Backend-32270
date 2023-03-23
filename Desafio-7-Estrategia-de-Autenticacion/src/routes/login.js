import passport from "passport"
import { Router } from "express"
import { userVali } from "../middleware/userValidation.js"
import { MongoUserManager } from "../dao/mongo/MongoUserManager.js"
import { createHash, isValidPassword } from "../ultis/bcrypt.js"

const router = Router()

const mongoUserManager = new MongoUserManager

router.get('/', (req, res) => {
    res.render('login')
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/login', passport.authenticate('login', {failureRedirect: '/auth/faillogin'}), async (req, res) => {
    const { username, password } = req.body

    try {
        if (username !== 'adminCoder@coder.com' || password !== 'adminCod3r123') {
            req.session.user = username
            req.session.admin = false
            req.session.usuario = true
            console.log('usted es usuario')
            res.redirect('http://localhost:8080/products')
        } else {
            req.session.user = username
            req.session.admin = true
            req.session.usuario = false
            console.log('usted es admin')
            res.redirect('http://localhost:8080/products')
        }
    } catch (error) {
        console.log(error)
    }
})
router.get('/faillogin', (req, res)=>{
    res.send({status: 'error', message: 'fallo el login'})
})

router.post('/register', userVali, passport.authenticate('register', {failureRedirect: '/auth/failregister'}),  async (req, res)=>{
    try {
        res.send({status: 'ok', message: 'se registro correctamente'})
    } catch (error) {
        console.log(error)
    }
})
router.get('/failregister', (req, res)=>{
    res.send({status: 'error', message: 'fallo el registro'})
})

router.post('/logout', async (req, res) => {
    try {
        req.session.destroy(err => {
            if(!err) res.redirect('http://localhost:8080/auth')
            else res.send({status:'Logout error', message: err})
        })
    } catch (error) {
        console.log(error)
    }
})


export default router