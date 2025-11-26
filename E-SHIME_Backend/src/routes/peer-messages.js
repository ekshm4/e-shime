import express from 'express';
const route = express.Router();
import Message from '../models/Message.js';

route.get('/messages', async (req, res) => {
  Message.getMessage(req,res);
});


export default route;