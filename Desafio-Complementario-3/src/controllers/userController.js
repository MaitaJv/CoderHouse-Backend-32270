import jwt from 'jsonwebtoken'
import { request } from "express"
import { createHash, isValidPassword } from "../ultis/bcrypt.js"
import UserService from "../services/userService.js"
import config from '../config/env.js';

const userService = new UserService

class UserController{
    rollSwitch = async (req = request, res) => {
        req.session.premium = !req.session.premium
        console.log(req.session.premium)
        res.send({message: 'Roll Cambiado'})
    }

    changePassword = async (req = request, res) => {
        const { email, password } = req.body

        try {
            console.log('email: ', email)
            let user = await userService.getUser(email)

            console.log('user: ', user)
            if (isValidPassword(user, password)) res.send('no puede colocar la contraseña anterior')
            console.log('logre pasar')
            await userService.updateUser(email, createHash(password))
            res.send('contraseña cambiada')
        } catch (error) {
            console.log(error)
        }
    }

    renderChangePassword = async (req = request, res) => {
        const {token} = req.params
        try {
            jwt.verify(token, config.privateKey, (error)=>{
                if(error){
                    res.redirect('http://localhost:8080/api/mail')
                }
                res.render('changePassword')
            })
        } catch (error) {
            console.log(error)
        }
    }
}

export default UserController