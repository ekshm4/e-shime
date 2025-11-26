import express from 'express';
const route = express.Router();
import MoodLog from "../models/MoodLog.js"


route.get("/getMoodLogs", (req,res) => {
    const userId = req.headers.userid
    MoodLog.getByUserId(userId,res);
});

route.post('/postMoodLogs', (req,res) => {
    MoodLog.create(req,res);
})



export default route;