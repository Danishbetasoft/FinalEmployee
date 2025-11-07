import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth.js';
import { employeeRouter } from './routes/employee.js';
import mailerRoutes from "./routes/mail.js";
import trackerRoutes from "./routes/track.js";
import 'reflect-metadata';
import { AppDataSource } from './DB/dataSource.js';
import { Employee } from './models/employee.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());

async function seedEmployees() {
  const employeeRepository = AppDataSource.getRepository(Employee);
  const tableExists = await AppDataSource.query(
    "SHOW TABLES LIKE 'employee';"
  );

  if (tableExists.length === 0) {
    console.log("Employee table does not exist yet. Skipping seeding.");
    return;
  }
  const existingEmployee = await employeeRepository.exist({});
  if (existingEmployee) {
    console.log('Employees already seeded.');
    return;
  }

  try {
    const response = await fetch('https://dummyjson.com/users');
    const data = await response.json();

    const employees = data.users.map((user) => ({
      username: user.username,
      email: user.email,
      password: user.password,
      status: 'pending',
      bgInfo: {},
    }));

    await employeeRepository.save(employees);
    console.log('Seeded employee data successfully!');
  } catch (error) {
    console.error('Error seeding employee data:', error);
  }
}
async function startServer() {
  try {
    await AppDataSource.initialize();
    console.log("Data Source initialized!");
    await AppDataSource.runMigrations();
    console.log("Migrations completed!");
    await seedEmployees();
    app.use('/auth', authRouter);
    app.use('/employees', employeeRouter);
    app.use('/mail', mailerRoutes);
    app.use('/', trackerRoutes);

    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server running on port ${process.env.PORT || 3000}`);
    });
  } catch (err) {
    console.error("Error occurred during DB connection", err);
  }
}
startServer();
