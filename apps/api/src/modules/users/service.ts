import bcrypt from 'bcrypt';
import { userRepository } from './repository';
import { CreateUserDTO, UpdateUserDTO } from './validator';
import { AppError } from '../../shared/errors/App.error';
import { UserResponseDTO } from './types';

export const userService = {
  async createUser(data: CreateUserDTO): Promise<UserResponseDTO> {
    const existingUser = await userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new AppError('Email already exists', 409);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    });

    return this.toResponseDTO(user);
  },

  async getUserById(id: string): Promise<UserResponseDTO> {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return this.toResponseDTO(user);
  },

  async getAllUsers(): Promise<UserResponseDTO[]> {
    const users = await userRepository.findAll();
    return users.map(this.toResponseDTO);
  },

  async updateUser(id: string, data: UpdateUserDTO): Promise<UserResponseDTO> {
    const existingUser = await userRepository.findById(id);

    if (!existingUser) {
      throw new AppError('User not found', 404);
    }

    const updatedUser = await userRepository.update(id, data);

    return this.toResponseDTO(updatedUser);
  },

  async deleteUser(id: string) {
    const existingUser = await userRepository.findById(id);

    if (!existingUser) {
      throw new AppError('User not found', 404);
    }

    await userRepository.delete(id);
  },

  async addCertification(staffId: string, locationId: string) {
    return userRepository.addCertification(staffId, locationId);
  },

  async addAvailability(staffId: string, startTime: string, endTime: string) {
    // Check if staff exists
    const user = await userRepository.findById(staffId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    // Only STAFF can have availability
    if (user.role !== 'STAFF') {
      throw new AppError('Only staff can have availability windows', 400);
    }
    
    // Validate start/end times
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (start >= end) {
      throw new AppError('End time must be after start time', 400);
    }
    
    // Create availability using repository
    const availability = await userRepository.addAvailability(
      staffId,
      start,
      end
    );
    
    return availability;
  },
  
  // Get all availability windows for a staff
  async getAvailability(staffId: string) {
    return userRepository.getAvailabilityByStaff(staffId);
  },
  
  // Delete an availability window by ID
  async deleteAvailability(availabilityId: string) {
    return userRepository.deleteAvailability(availabilityId);
  },
  
  toResponseDTO(user: any): UserResponseDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  },
};