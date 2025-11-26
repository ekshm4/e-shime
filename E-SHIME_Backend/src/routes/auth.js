import express from 'express';
const route = express.Router();
import User from '../models/User.js';



route.post("/login", (req,res) => {
    const {email, password} = req.body;
    User.verifyuser(res,email,password);
})



route.post("/signup", (req,res) => {
    const {username,email, password} = req.body;
    User.create(res,username,email,password);
})



export default route;