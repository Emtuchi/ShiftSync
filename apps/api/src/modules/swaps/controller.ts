import { Request, Response } from 'express';
import { swapService } from './service';

interface SwapParams {
  id: string;
}

export const swapController = {
  async requestSwap(req: Request, res: Response) {
    const { originalAssignmentId, targetStaffId } = req.body;

    const swap = await swapService.requestSwap(
      originalAssignmentId,
      targetStaffId
    );

    res.status(201).json(swap);
  },

  async acceptSwap(req: Request<SwapParams>, res: Response) {
    const swapId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { staffId } = req.body;

    const swap = await swapService.acceptSwap(swapId, staffId);

    res.json(swap);
  },

  async approveSwap(req: Request<SwapParams>, res: Response) {
    const swapId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const result = await swapService.approveSwap(swapId);

    res.json(result);
  },
};