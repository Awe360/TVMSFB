import express from 'express';
import {ValidateAdmin,RegisterAdmin, Login, CheckAuth, ForgotPassword, ResetPassword, Logout, SaveProfile, ChangePassword, UpdatePhoto, GetAllAdmin, DeleteAdmin, BlockAdmin, UnblockAdmin} from '../controllers/AdminController.js';

import { verifyToken } from '../middleware/verifyToken.js';
const router = express.Router();
router.post('/validate-admin',ValidateAdmin);
router.post('/register',RegisterAdmin);
router.get('/get-all-admin',GetAllAdmin)
router.post('/login',Login)
router.post('/logout',Logout)
router.post('/check-auth',verifyToken,CheckAuth)
router.post('/forgot-password',ForgotPassword)
router.post('/reset-password/:token',ResetPassword)
router.post('/profile/save-profile',SaveProfile)
router.post('/profile/change-password',ChangePassword)
router.post('/profile/update-photo',UpdatePhoto)
router.post('/delete',DeleteAdmin),
router.post('/block-admin',BlockAdmin)
router.post('/unblock-admin',UnblockAdmin)
export default router;