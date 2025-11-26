import express from 'express';
const route = express.Router();
import artStory from '../models/Arts.js';

route.get("/getArt", (req,res) => {
    artStory.getAll(req,res);
})



route.post("/postArt", (req,res) => {
    artStory.create(req,res);
})


export default route;