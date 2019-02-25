import { Router } from 'express';

import { 
  queryOptimizationController,
  queryController 
} from '../controllers/queryController';

const routes = Router();

routes.post('/queryOptimization', queryOptimizationController);
routes.post('/query', queryController);

export default routes;