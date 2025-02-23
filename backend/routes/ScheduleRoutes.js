import express from 'express';
import { DeleteSchedule, GetAllSchedules, HandleCancel, SetSchedule } from '../controllers/ScheduleController.js';

const router = express.Router();
router.post('/setSchedule',SetSchedule);
router.get('/getAllSchedules',GetAllSchedules);
router.post('/cancel',HandleCancel);
router.post('/delete',DeleteSchedule);


export default router;





