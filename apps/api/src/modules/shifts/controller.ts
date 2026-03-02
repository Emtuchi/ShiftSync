import { Request, Response } from 'express';
import { shiftService } from './service';
import { createShiftSchema, updateShiftSchema } from './validator';

interface ShiftParams {
  id: string;
}

export const shiftController = {
  async createShift(req: Request, res: Response) {
    const parsed = createShiftSchema.parse(req.body);
    const shift = await shiftService.createShift(parsed);
    res.status(201).json(shift);
  },

  async getShiftById(req: Request<ShiftParams>, res: Response) {
    const shift = await shiftService.getShiftById(req.params.id);
    res.json(shift);
  },

  async getShifts(req: Request, res: Response) {
    const shifts = await shiftService.getShifts();
    res.json(shifts);
  },

  async updateShift(req: Request<ShiftParams>, res: Response) {
    const parsed = updateShiftSchema.parse(req.body);
    const shift = await shiftService.updateShift(req.params.id, parsed);
    res.json(shift);
  },

  async deleteShift(req: Request<ShiftParams>, res: Response) {
    await shiftService.deleteShift(req.params.id);
    res.status(204).send();
  },

  async assignStaff(req: Request<ShiftParams>, res: Response) {
    const { staffId } = req.body;
    const assignment = await shiftService.assignStaff(req.params.id, staffId);
    res.status(201).json(assignment);
  },

  async unassignStaff(req: Request<ShiftParams>, res: Response) {
    const { staffId } = req.body;
    await shiftService.unassignStaff(req.params.id, staffId);
    res.status(204).send();
  },

  async publishShift(req: Request<ShiftParams>, res: Response) {
    const shift = await shiftService.publishShift(req.params.id);
    res.json(shift);
  },

  async unpublishShift(req: Request<ShiftParams>, res: Response) {
    const shift = await shiftService.unpublishShift(req.params.id);
    res.json(shift);
  },
};