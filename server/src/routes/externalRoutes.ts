import { Router } from 'express';
import { getMonthlyWeather } from '../controllers/externalController';

const router = Router();

router.get('/weather', getMonthlyWeather);

export default router;
