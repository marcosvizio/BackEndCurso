import sessionModel from "../models/session.js";

export default class SessionsManager {

    createSession = (params) => {
        return sessionModel.create(params)
    }

    findSession = (params) => {
        return sessionModel.findOne(params)
    }

    updateSession = (email, password) => {
        return sessionModel.updateOne({email}, {$set: {password: password}})
    }

}