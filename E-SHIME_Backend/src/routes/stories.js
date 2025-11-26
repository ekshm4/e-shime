import express from 'express';
const route = express.Router();
import Story from '../models/Story.js';


route.get("/getStories", (req,res) => {
    Story.getAll(req,res);
})

route.post("/postStories", (req,res) => {
    Story.create(req,res);
})


export default route;