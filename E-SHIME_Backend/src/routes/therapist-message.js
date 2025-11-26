import express from 'express';
const route = express.Router();
import Message from '../models/Message.js';

route.get('/therapistMessages', async (req, res) => {
  const userId = req.headers.userid;
  Message.getTherapyMessage(userId,req,res);
});


export default route;