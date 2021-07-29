import { servService } from '../services';

export const serviceController = {
  async createService(req, res) {
    const newService = await servService.createService(req.body);
    res.status(newService.status).json(newService);
  },
  async getServices(req, res) {
    const services = await servService.getServices();
    res.status(services.status).json(services);
  }
}