import express from 'express';
import { getProcessStagesList, getProcessStageDetail } from '../src/controllers/process_stages/index.js';

const router = express.Router();

router.get('/api/process-stages/list', getProcessStagesList);
router.post('/api/process-stages/list', getProcessStagesList);
router.get('/api/process-stages/detail', getProcessStageDetail);

export default router;