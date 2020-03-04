import { Request, Response } from 'express';

export default [
  {
    path: '/me',
    method: 'get',
    controller: (req: Request, res: Response): void => {
      res.json({
        mobile: 'xxx',
        role: ['admin', 'test'],
      });
    },
  },
];
