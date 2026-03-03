import { Request, Response } from 'express';
import { fairnessService } from './service';

export const fairnessController = {
  async staffHoursSummary(req: Request, res: Response) {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) return res.status(400).json({ error: 'startDate and endDate required' });

    const summary = await fairnessService.getStaffHoursSummary(new Date(startDate as string), new Date(endDate as string));
    res.json(summary);
  },

  async premiumShiftDistribution(req: Request, res: Response) {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) return res.status(400).json({ error: 'startDate and endDate required' });

    const distribution = await fairnessService.getPremiumShiftDistribution(
      new Date(startDate as string),
      new Date(endDate as string)
    );

    res.json(distribution);
  },
};