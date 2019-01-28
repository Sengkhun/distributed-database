import response from './response';
import { query, queryOptimization } from '../functions/query';

export const queryController = async (req, res, next) => {
  
  try {

    const { sql } = req.body;
    const data = await queryOptimization(sql);
    // const data = await query(sql);

    response(res, { data });
    
  } catch (error) { 
		console.log("​error", error);
    next(error);
  }

};
