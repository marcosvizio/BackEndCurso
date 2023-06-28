import passport from "passport";
import * as dotenv from 'dotenv';
import local from "passport-local";
import GithubStrategy from "passport-github2"

import SessionsManager from "../dao/mongoDb/manager/Sessions.js";
import { createHash, validatePassword } from "../utils.js";
dotenv.config();

const LocalStrategy = local.Strategy;
const sessionServices = new SessionsManager();

const EMAIL_ADMIN = process.env.EMAIL_ADMIN;
const PASSWORD_ADMIN = process.env.PASSWORD_ADMIN;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const initializePassport = () => {

    passport.use('register', new LocalStrategy({passReqToCallback:true, usernameField:'email'},async(req, email, password, done)=>{
        const { first_name, last_name } = req.body
        const exist = await sessionServices.findSession({email})
        if (exist) done(null, false, {message:'El usuario ya existe'})
        const hashedPassword = await createHash(password);
        const user = {
            first_name,
            last_name,
            email,
            password: hashedPassword
        }
        const result = await sessionServices.createSession(user)
        done(null,result);
    }))

    passport.use('login', new LocalStrategy({usernameField:'email'},async(email,password,done)=>{
        if (email===EMAIL_ADMIN && password===PASSWORD_ADMIN) {
            const user = {
            name: `Admin`,
            email: "...",
            role: "admin",
            id: 0
             }
            return done(null,user)
        }

        let user;
        user = await sessionServices.findSession({email})
        if(!user) return done(null, false, {message:'Credentials incorrects'})

        const isValidPassword = await validatePassword(password,user.password);
        if(!isValidPassword) return done(null, false, {message:'Password invalid'})

        user = {
            id: user._id,
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            role: user.role
        }
        return done(null,user)

    })) 

    passport.use('github', new GithubStrategy({
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async(accessToken, refreshToken, profile, done)=>{
        try {
            const { name, email } = profile._json;
            const user = await sessionServices.findSession({ email })

            if (!user) {
                const newUser = {
                    first_name: name,
                    email: email,
                    password:''
                }
                const result = await sessionServices.createSession(newUser)
                done(null, result)
            }

            done(null, user)
        } catch (error) {
            done(error);
        }
    }))

    passport.serializeUser(function (user,done) {
        return done(null, user.id)
    })

    passport.deserializeUser(async function (id,done) {
        if(id===0) {
            return done(null, {
                role: 'admin',
                name: 'ADMIN'
            })
        }
        const user = await sessionServices.findSession({_id:id})
        return done(null,user)
    })

}

export default initializePassport;