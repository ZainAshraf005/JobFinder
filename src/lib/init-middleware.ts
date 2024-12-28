import Cors from 'cors';
import type { NextApiRequest, NextApiResponse } from 'next';

// Middleware initializer function
export function initMiddleware(middleware: any) {
  return (req: NextApiRequest, res: NextApiResponse) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result: any) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

// Configure CORS
export const cors = initMiddleware(
  Cors({
    origin: '*', // Allow all origins (adjust in production)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  })
);
