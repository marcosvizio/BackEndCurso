import { Router } from 'express';
import passport from "passport";
import SessionManager from "../dao/mongoDb/manager/Sessions.js"
import { createHash, validatePassword } from "../utils.js"

const sessionService = new SessionManager()

const router = Router();

router.post('/register', passport.authenticate('register',{failureRedirect:'/api/sessions/registerFail', failureMessage: true}),async (req, res) => {
    try {
        res.status(200).send({status:'success',message:'Registered'})
    } catch (error) {
        console.log(error);
    }
})

router.get('/registerFail', (req,res) => {
    try {
        res.status(400).send({status:'error', error:req.session.messages})
    } catch (error) {
        console.log(error);
    }
})

router.post('/login', passport.authenticate('login',{failureRedirect:'/api/sessions/loginFail', failureMessage: true}),async (req, res) => {
    try {
        req.session.user = {
            name: req.user.name,
            role: req.user.role,
            email: req.user.email
        }
        res.status(200).send({status: 'success'})
    } catch (error) {
        console.log(error);
    }
})

router.get('/loginFail', (req, res)=>{
    try {
        if(req.session.messages.length > 4) return res.status(400).send({message:'Bloquear los intentos!'}) 
        res.status(400).send({status:'error', error:req.session.messages})
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

router.get('/github', passport.authenticate('github'), (req, res)=>{

})

router.get('/githubcallback', passport.authenticate('github'), async (req, res) => {
    try {
        const user = req.user;
        console.log(user);
        req.session.user = {
            id: user.id,
            name: user.first_name,
            role: user.role,
            email: user.email
        }
        res.status(200).send({status:'success', messagge:'Logged with GitHub'})
    } catch (error) {
        console.log(error);
    }
})

router.post('/restorePassword', async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await sessionService.findSession({email})
        if(!user) return res.status(400).send({status: 'error', error:"User doesn't exist"})
        const isSamePassword = await validatePassword(password, user.password)
        if (isSamePassword) return res.status(400).send({status: 'error', error:"Cannot replace password with the current password"})
        const newHashedPassword = await createHash(password)
        await sessionService.updateSession(email, newHashedPassword)
        res.status(200).send({status: 'success'})
    } catch (error) {
        console.log(error);
    }
})

export default router;