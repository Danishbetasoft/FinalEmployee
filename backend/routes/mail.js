import { Router } from 'express';
import type { Request, Response } from 'express';
import { MailService } from "../services/mailcontroller.js";

const router = Router();
const mailcontroller = new MailService();

router.post("/send", (req: Request, res: Response) => mailcontroller.sendMail(req, res));

export default router;
