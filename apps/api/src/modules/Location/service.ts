import { locationRepository } from './repository.js';
import { AppError } from '../../shared/errors/App.error.js';
import { CreateLocationDTO, UpdateLocationDTO } from './validator.js';
import { LocationResponseDTO } from './types.js';

export const locationService = {
  async createLocation(data: CreateLocationDTO): Promise<LocationResponseDTO> {
    const location = await locationRepository.create(data);
    return this.toResponseDTO(location);
  },

  async getLocationById(id: string): Promise<LocationResponseDTO> {
    const location = await locationRepository.findById(id);

    if (!location) {
      throw new AppError('Location not found', 404);
    }

    return this.toResponseDTO(location);
  },

  async getAllLocations(): Promise<LocationResponseDTO[]> {
    const locations = await locationRepository.findAll();
    return locations.map(this.toResponseDTO);
  },

  async updateLocation(id: string, data: UpdateLocationDTO) {
    const existing = await locationRepository.findById(id);

    if (!existing) {
      throw new AppError('Location not found', 404);
    }

    const updated = await locationRepository.update(id, data);
    return this.toResponseDTO(updated);
  },

  async deleteLocation(id: string) {
    const existing = await locationRepository.findById(id);

    if (!existing) {
      throw new AppError('Location not found', 404);
    }

    await locationRepository.delete(id);
  },

  toResponseDTO(location: any): LocationResponseDTO {
    return {
      id: location.id,
      name: location.name,
      address: location.address,
      createdAt: location.createdAt,
    };
  },
};