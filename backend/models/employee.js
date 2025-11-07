var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, CreateDateColumn, UpdateDateColumn, } from 'typeorm';
import { User } from './user.js';
let Employee = class Employee {
    id;
    username;
    email;
    password;
    status;
    created_at = new Date();
    updated_at = new Date();
    bgInfo;
    rejectionReason;
    user;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Object)
], Employee.prototype, "id", void 0);
__decorate([
    Column({ type: 'varchar', length: 255 }),
    __metadata("design:type", Object)
], Employee.prototype, "username", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, unique: true }),
    __metadata("design:type", Object)
], Employee.prototype, "email", void 0);
__decorate([
    Column({ type: 'varchar', length: 255 }),
    __metadata("design:type", Object)
], Employee.prototype, "password", void 0);
__decorate([
    Column({ type: 'varchar', length: 100, default: 'pending' }),
    __metadata("design:type", Object)
], Employee.prototype, "status", void 0);
__decorate([
    CreateDateColumn({ type: 'datetime' }),
    __metadata("design:type", Date)
], Employee.prototype, "created_at", void 0);
__decorate([
    UpdateDateColumn({ type: 'datetime' }),
    __metadata("design:type", Date)
], Employee.prototype, "updated_at", void 0);
__decorate([
    Column({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Employee.prototype, "bgInfo", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Employee.prototype, "rejectionReason", void 0);
__decorate([
    OneToOne(() => User, (user) => user.employee),
    __metadata("design:type", Object)
], Employee.prototype, "user", void 0);
Employee = __decorate([
    Entity()
], Employee);
export { Employee };
//# sourceMappingURL=employee.js.map