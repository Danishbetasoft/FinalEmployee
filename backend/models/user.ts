import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.js';
import { Employee } from './employee.js';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id;

  @Column({ type: 'varchar', length: 255, unique: true })
  username;

  @Column({ type: 'varchar', length: 255, unique: true })
  email;

  @Column({ type: 'varchar', length: 255 })
  password;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date= new Date();

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date= new Date();

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role;

  @OneToOne(() => Employee, (employee) => employee.user, { cascade: true, eager: true })
  @JoinColumn({ name: 'employee_id' })
  employee;
}
