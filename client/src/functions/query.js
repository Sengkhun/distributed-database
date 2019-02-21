import fetch from './axios';
import errorHandler from './errorHandler';

// ----------------------------------------

export const queryAPI = async sql => {
  
  try {
    
    const method = 'post';
    const url = `${process.env.API_URL}/query`;
    const data = { sql };

    return await fetch({ method, url, data });

  } catch (error) {
		console.log("query -> error", error);
    return errorHandler(error);
  }
  
};
