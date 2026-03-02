import { Request, Response } from 'express';
import { userService } from './service';
import { createUserSchema, updateUserSchema } from './validator';


interface UserParams {
  id: string;
}

export const userController = {
  async getById(req: Request<UserParams>, res: Response) {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
  },

  async update(req: Request<UserParams>, res: Response) {
    const parsed = updateUserSchema.parse(req.body);
    const user = await userService.updateUser(req.params.id, parsed);
    res.json(user);
  },

  async delete(req: Request<UserParams>, res: Response) {
    await userService.deleteUser(req.params.id);
    res.status(204).send();
  },

  async create(req: Request, res: Response) {
    const parsed = createUserSchema.parse(req.body);
    const user = await userService.createUser(parsed);
    res.status(201).json(user);
  },

  async getAll(req: Request, res: Response) {
    const users = await userService.getAllUsers();
    res.json(users);
  },

  async addCertification(req: Request, res: Response) {
    const { staffId, locationId } = req.body;
    
    const record = await userService.addCertification(
      staffId,
      locationId
    );
    
    res.status(201).json(record);
  }
  
};