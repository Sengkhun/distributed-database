import { Router } from 'express';

import { queryController } from '../controllers/queryController';

const routes = Router();

routes.post('/query', queryController);

export default routes;