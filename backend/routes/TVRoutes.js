import express from 'express';
import { CurrentMedia, DeleteTV, GetAllTVs, RegisterTV, validateDevice } from '../controllers/TVController.js';
const router = express.Router();
router.post('/register-tv',RegisterTV);
router.get('/all',GetAllTVs);
router.post('/delete/:tvId',DeleteTV)
router.get('/display/:tvId',CurrentMedia);



router.get("/validate-device/:deviceId", validateDevice);







export default router;