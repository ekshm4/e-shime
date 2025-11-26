import express from 'express';
const route = express.Router();
import poetryStory from '../models/Poetry.js';

route.get("/getPoetry", (req,res) => {
    poetryStory.getAll(req,res);
})



route.post("/postPoetry", (req,res) => {
    poetryStory.create(req,res);
})


export default route;