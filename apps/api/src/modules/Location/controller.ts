import { Request, Response } from 'express';
import { locationService } from './service.js';
import { createLocationSchema, updateLocationSchema } from './validator.js';

export const locationController = {
  async create(req: Request, res: Response) {
    const parsed = createLocationSchema.parse(req.body);
    const location = await locationService.createLocation(parsed);
    res.status(201).json(location);
  },

  async getById(req: Request<{ id: string }>, res: Response) {
    const location = await locationService.getLocationById(req.params.id);
    res.json(location);
  },

  async getAll(req: Request, res: Response) {
    const locations = await locationService.getAllLocations();
    res.json(locations);
  },

  async update(req: Request<{ id: string }>, res: Response) {
    const parsed = updateLocationSchema.parse(req.body);
    const location = await locationService.updateLocation(req.params.id, parsed);
    res.json(location);
  },

  async delete(req: Request<{ id: string }>, res: Response) {
    await locationService.deleteLocation(req.params.id);
    res.status(204).send();
  },
};