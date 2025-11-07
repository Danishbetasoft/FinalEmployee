import 'reflect-metadata';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Employee } from '../models/employee.js';
import { MailRecord } from '../models/mailRecords.js';
import { MailEvent } from '../models/mailEvent.js';
import { User } from '../models/user.js';
import { Role } from '../models/role.js';

dotenv.config('./backend/.env' );

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'usemy_db',
  synchronize: false,
  logging: true,
  entities: [Employee, MailRecord, MailEvent, User, Role],
  migrations: ['./migrations/*.js']


});
