import { Router } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import {User} from '../models/user.js'
import { AppDataSource } from '../DB/dataSource.js';
dotenv.config();

const router = Router();

const ADMIN = { username: 'admin', password: 'admin123' };
const userRepo = AppDataSource.getRepository(User)

router.post('/login', async(req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN.username && password === ADMIN.password) {
    const token = jwt.sign({ username, role:'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ success: true, token, username, role: 'admin'});
  }
  const employee = await userRepo.findOneBy({username, password})
  if(employee){
    const token = jwt.sign({username,id:employee.id, role:'employee'},process.env.JWT_SECRET,{expiresIn:'1h'})
    return res.json({success: true, token, username, role:'employee'})
  }
  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

router.post('/logout', (req, res) => {
  return res.json({ success: true, message: 'Logged out successfully' });
});

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    req.user = user;
    if (user.role === 'employee' && req.originalUrl !== '/employee/dashboard') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  });
}

export const authRouter = router;
