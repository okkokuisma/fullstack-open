import { Router } from 'express';
import diagnoseService from '../services/diagnoseService';

const diagnoseRouter = Router();

diagnoseRouter.get('/', (_req, res) => {
  res.send(diagnoseService.getAll());
});

export default diagnoseRouter;