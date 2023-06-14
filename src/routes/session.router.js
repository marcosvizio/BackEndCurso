import { Router } from 'express';
import SessionsManager from '../dao/mongoDb/manager/Sessions.js';
import * as dotenv from 'dotenv';
dotenv.config()

const router = Router();
const sessionServices = new SessionsManager();
const EMAIL_ADMIN = process.env.EMAIL_ADMIN;
const PASSWORD_ADMIN = process.env.PASSWORD_ADMIN;

router.post('/register', async (req, res) => {
    try {
        const result = await sessionServices.createSession(req.body)
        res.status(200).send({status: 'success', payload: result})
    } catch (error) {
        console.log(error);
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        if (email===EMAIL_ADMIN && password===PASSWORD_ADMIN) {
            req.session.user = {
                name: `Admin`,
                email: "...",
                role: "admin"
            }
            res.status(200).send({status: 'success'})
        }
        const user = await sessionServices.findSession({email, password})
        if (!user) {
            return res.status(400).send({status: 'error', error: 'Email y/o contraseña incorrecta'})
        }
        req.session.user = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            role: user.role
        }
        res.status(200).send({status: 'success'})
    } catch (error) {
        console.log(error);
    }
})

router.post('/logout', async (req, res) => {
    try {
        req.session.destroy()
        res.status(200).send({status: 'success', message: 'Session logout complete'})
    } catch (error) {
        console.log(error)
    }
})

export default router;