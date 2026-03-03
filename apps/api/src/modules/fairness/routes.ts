import { Router } from 'express';
import { fairnessController } from './controller.js';

const fairnessRouter = Router();

fairnessRouter.get('/staff-hours-summary', fairnessController.staffHoursSummary);
fairnessRouter.get('/premium-shift-distribution', fairnessController.premiumShiftDistribution);

export default fairnessRouter;