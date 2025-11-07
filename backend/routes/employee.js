import { Router } from 'express'
import { authenticateToken } from './auth.js'
import { Employee } from '../models/employee.js'
import { AppDataSource } from '../DB/dataSource.js'
import { Role } from '../models/role.js'
import { User } from '../models/user.js'
import { sendAcceptanceEmail, sendRejectionEmail } from './AcceptRejectmail.js'

const router = Router()
const employeeRepo = AppDataSource.getRepository(Employee)
const roleRepo = AppDataSource.getRepository(Role)
const userRepo = AppDataSource.getRepository(User)

router.get('/public/:id', async (req, res) => {
  const { id } = req.params
  try {
    const employee = await employeeRepo.findOneBy({ id: parseInt(id) })
    if (!employee) return res.status(404).json({ message: 'Employee not found' })
    res.json(employee)
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/', authenticateToken, async (req, res) => {
  const { skip = 0, take = 10, sort, requireTotalCount } = req.query
  try {
    let order = { id: 'ASC' }
    if (sort) {
      try {
        const parsedSort = JSON.parse(sort)
        if (parsedSort.length) {
          const [f] = parsedSort
          order = { [f.selector]: first.desc ? 'DESC' : 'ASC' }
        }
      } catch {}
    }

    const [employees, totalCount] = await Promise.all([
      employeeRepo.find({ skip: parseInt(skip), take: parseInt(take), order }),
      requireTotalCount === 'true' ? employeeRepo.count() : Promise.resolve(undefined)
    ])

    const response = { data: employees }
    if (requireTotalCount === 'true') response.totalCount = totalCount
    res.json(response)
  } catch {
    res.status(500).json({ message: 'Server error while fetching employees' })
  }
})

router.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params
  try {
    const employee = await employeeRepo.findOneBy({ id: parseInt(id) })
    if (!employee) return res.status(404).json({ message: 'Employee not found' })
    res.json(employee)
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/', async (req, res) => {
  const { username, email, bgInfo } = req.body
  try {
    const randomPassword = Math.random().toString(36).slice(-8)
    const newEmployee = employeeRepo.create({
      username,
      email,
      password: randomPassword,
      bgInfo: bgInfo || {},
      status: 'pending'
    })
    await employeeRepo.save(newEmployee)
    res.status(201).json(newEmployee)
  } catch {
    res.status(500).json({ message: 'Server error while creating employee' })
  }
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { username, email, password, bgInfo } = req.body
  try {
    const employee = await employeeRepo.findOneBy({ id: parseInt(id) })
    if (!employee) return res.status(404).json({ message: 'Employee not found' })

    if (username !== undefined) employee.username = username
    if (email !== undefined) employee.email = email
    if (password !== undefined) employee.password = password
    if (bgInfo && typeof bgInfo === 'object') {
      employee.bgInfo = { ...(employee.bgInfo || {}), ...bgInfo }
    }

    await employeeRepo.save(employee)
    res.json(employee)
  } catch {
    res.status(500).json({ message: 'Server error while updating employee' })
  }
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const result = await employeeRepo.delete({ id: parseInt(id) })
    if (result.affected === 0) return res.status(404).json({ message: 'Employee not found' })
    res.json({ message: 'Employee deleted successfully' })
  } catch {
    res.status(500).json({ message: 'Server error while deleting employee' })
  }
})

router.put('/:id/bgInfo', async (req, res) => {
  const { id } = req.params
  const { bgInfo, status } = req.body
  try {
    const employee = await employeeRepo.findOneBy({ id: parseInt(id) })
    if (!employee) return res.status(404).json({ message: 'Employee not found' })

    if (bgInfo && typeof bgInfo === 'object') {
      const updatedBgInfo = { ...(employee.bgInfo || {}), ...bgInfo }
      if (updatedBgInfo.startDate)
        updatedBgInfo.startDate = new Date(updatedBgInfo.startDate).toISOString().split('T')[0]
      if (updatedBgInfo.endDate)
        updatedBgInfo.endDate = new Date(updatedBgInfo.endDate).toISOString().split('T')[0]
      employee.bgInfo = updatedBgInfo
    }

    if (status) employee.status = status
    await employeeRepo.save(employee)
    res.json(employee)
  } catch {
    res.status(500).json({ message: 'Server error while updating background info' })
  }
})

router.post('/:id/accept', async (req, res) => {
  const { id } = req.params
  try {
    const employee = await employeeRepo.findOne({ where: { id: parseInt(id) } })
    if (!employee) return res.status(404).json({ message: 'Employee not found' })

    let employeeRole = await roleRepo.findOne({ where: { name: 'employee' } })
    if (!employeeRole) {
      employeeRole = roleRepo.create({ name: 'employee', created_at: new Date(), updated_at: new Date() })
      await roleRepo.save(employeeRole)
    }

    const existingUser = await userRepo.findOne({ where: { email: employee.email } })
    if (existingUser) return res.status(400).json({ message: 'User already exists' })

    const userPassword = employee.password
    const newUser = userRepo.create({
      username: employee.username,
      email: employee.email,
      password: userPassword,
      role: employeeRole,
      employee: employee
    })

    await userRepo.save(newUser)

    employee.status = 'verified'
    await employeeRepo.save(employee)
    await sendAcceptanceEmail(employee)

    res.json({ employee, user: newUser })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/:id/:reason/reject', async (req, res) => {
  const { id, reason } = req.params
  try {
    const employee = await employeeRepo.findOneBy({ id: parseInt(id) })
    if (!employee) return res.status(404).json({ message: 'Employee not found' })
    employee.status = 'rejected'
    if (reason) employee.rejectionReason = reason
    await employeeRepo.save(employee)
    await sendRejectionEmail(employee, employee.rejectionReason)
    res.json(employee)
  } catch {
    res.status(500).json({ message: 'Server error on rejecting employee' })
  }
})

export const employeeRouter = router
