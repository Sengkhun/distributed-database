import fetch from './axios';
import errorHandler from './errorHandler';

// ----------------------------------------

export const queryAPI = async (fragmentation, sql) => {
  
  try {
    
    const method = 'post';
    const url = `${process.env.API_URL}/query`;
    const data = { fragmentation, sql };

    return await fetch({ method, url, data });

  } catch (error) {
		console.log("query -> error", error);
    return errorHandler(error);
  }
  
};

// ----------------------------------------

export const queryOptimizationAPI = async (fragmentation, sql) => {
  
  try {
    
    const method = 'post';
    const url = `${process.env.API_URL}/queryOptimization`;
    const data = { fragmentation, sql };

    return await fetch({ method, url, data });

  } catch (error) {
		console.log("query -> error", error);
    return errorHandler(error);
  }
  
};
