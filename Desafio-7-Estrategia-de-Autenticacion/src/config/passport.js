import passport from "passport";
import local from "passport-local"
import { MongoUserManager } from "../dao/mongo/MongoUserManager.js";
import { createHash, isValidPassword } from "../ultis/bcrypt.js";
import UserModel from '../models/user.js'

const LocalStrategy = local.Strategy
const mongoUserManager = new MongoUserManager

export const initPassport = ()=>{
    passport.use('register', new LocalStrategy(
        {
            passReqToCallback: true,
            usernameField: 'email',
        },
        async (req, username, password, done)=>{
            const { first_name, last_name, age, roll = 'user', email } = req.body
            let user = { first_name, last_name, age, roll, email, password: createHash(password) }

            try {
                let exist = await mongoUserManager.getUser(username)
                
                if(exist) {
                    console.log('el usuario ya existe')
                    return done(null, false)
                }else{
                    console.log('el usuario se creo correctamente')
                    let newUser = await mongoUserManager.addUser(user)
                    return done(null, newUser)
                }
            } catch (error) {
                console.log(error)
                return done('Error al obrener el usuario'+error)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        console.log('serializeUser')
        done(null, user._id)
    })
    
    passport.deserializeUser(async (id, done) => {
        try {
            console.log('deserializeUser')
            let user = await UserModel.findById(id)
            done(null, user)
        } catch (error) {
            done(error)
        }
    })

    passport.use('login', new LocalStrategy({usernameField: 'email'},
        async (username, password, done) => {
            console.log('login correcto')
            try {
                let user = await mongoUserManager.getUser(username)

                if (!user) {
                    console.log('usuario no existe')
                    return done(null, false)
                }

                if(!isValidPassword(user, password)){
                    console.log('datos invalidos')
                    return done(null, false)
                }
                return done(null, user)
            } catch (error) {
                return done(error)
            }
        }
    ))
}