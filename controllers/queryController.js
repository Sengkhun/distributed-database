import response from './response';
import { query } from '../functions/query';

export const queryController = async (req, res, next) => {
  
  try {

    const { sql } = req.body;
    const data = await query(sql);

    response(res, { data });
    
  } catch (error) { 
		console.log("​error", error);
    next(error);
  }

};
