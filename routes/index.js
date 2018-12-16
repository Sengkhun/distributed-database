import { Router } from 'express';
import { query } from '../functions/query';

const routes = Router();

routes.post('/query', async (req, res, next) => {
  
  try {

    const { sql } = req.body;
    const data = await query(sql);

    res.json({ status: 200, message: "Success", data });
    
  } catch (error) { 

		console.log("​error", error);
    res.json({ status: 500, message: error });

  }

});

export default routes;