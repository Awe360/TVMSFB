import express from 'express';
import {UploadMedia,FetchLatestMedia, SaveMedia, RecentMedia, FetchMediaBYID, DeleteMedia, DisplayToTV, StoreMedia } from '../controllers/MediaController.js';
import multer from 'multer';
const router = express.Router();
// Multer setup for file uploads using memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });
router.get('/fetch-media/:tvId', FetchLatestMedia);
router.post('/upload',upload.single('media'), UploadMedia);
router.post('/save', SaveMedia);
router.get('/recent-media',RecentMedia);
router.get('/find-media/:mediaID',FetchMediaBYID);
router.post('/deleteMedia',DeleteMedia)
router.post('/display-to-tv',DisplayToTV);
router.post('/store',StoreMedia);


export default router;

