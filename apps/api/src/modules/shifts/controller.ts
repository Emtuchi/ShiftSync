import { Request, Response } from 'express';
import { shiftService } from './service.js';
import { createShiftSchema, updateShiftSchema } from './validator.js';

interface ShiftParams {
  id: string;
}

export const shiftController = {
  // CREATE SHIFT
  async createShift(req: Request, res: Response) {
    const parsed = createShiftSchema.parse(req.body);
    const shift = await shiftService.createShift(parsed);
    res.status(201).json({ success: true, data: shift });
  },

  async getShiftById(req: Request<ShiftParams>, res: Response) {
    const shift = await shiftService.getShiftById(req.params.id);
    res.json({ success: true, data: shift });
  },

  // GET ALL SHIFTS
  async getShifts(req: Request, res: Response) {
    const shifts = await shiftService.getShifts();
    res.json({ success: true, data: shifts });
  },

  async updateShift(req: Request<ShiftParams>, res: Response) {
    const parsed = updateShiftSchema.parse(req.body);
    const shift = await shiftService.updateShift(req.params.id, parsed);
    res.json({ success: true, data: shift });
  },

  async deleteShift(req: Request<ShiftParams>, res: Response) {
    await shiftService.deleteShift(req.params.id);
    res.status(204).send(); // No content
  },

  // ASSIGN STAFF TO SHIFT
  async assignStaff(req: Request<ShiftParams>, res: Response) {
    const { staffId } = req.body;

    if (!staffId) {
      return res.status(400).json({
        success: false,
        message: 'staffId is required in request body',
      });
    }

    const assignment = await shiftService.assignStaff(req.params.id, staffId);
    res.status(201).json({ success: true, data: assignment });
  },

  // UNASSIGN STAFF FROM SHIFT
  async unassignStaff(req: Request<ShiftParams>, res: Response) {
    const { staffId } = req.body;

    if (!staffId) {
      return res.status(400).json({
        success: false,
        message: 'staffId is required in request body',
      });
    }

    await shiftService.unassignStaff(req.params.id, staffId);
    res.status(204).send();
  },

  async publishShift(req: Request<ShiftParams>, res: Response) {
    const shift = await shiftService.publishShift(req.params.id);
    res.json({ success: true, data: shift });
  },

  async unpublishShift(req: Request<ShiftParams>, res: Response) {
    const shift = await shiftService.unpublishShift(req.params.id);
    res.json({ success: true, data: shift });
  },
};