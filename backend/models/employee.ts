import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.js';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id

  @Column({ type: 'varchar', length: 255 })
  username;

  @Column({ type: 'varchar', length: 255, unique: true })
  email;

  @Column({ type: 'varchar', length: 255 })
  password;

  @Column({ type: 'varchar', length: 100, default: 'pending' })
  status;

  @CreateDateColumn({ type: 'datetime' })
  created_at : Date = new Date();

  @UpdateDateColumn({ type: 'datetime' })
  updated_at : Date = new Date();

  @Column({ type: 'json', nullable: true })
  bgInfo;
 
  @Column({type:'text', nullable: true})
  rejectionReason;
  
  @OneToOne(() => User, (user) => user.employee)
  user;

}
