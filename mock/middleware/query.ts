import { Request, Response, NextFunction } from 'express';

module.exports = [
  function(req: Request, res: Response, next: NextFunction): void {
    if (req.method === 'PUT') {
      req.method = 'PATCH';
    }

    // console.log("demo middleware");

    next();
  },
];
