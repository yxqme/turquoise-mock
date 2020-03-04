import { Request, Response } from 'express';

export default [
  // 获取用户信息
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
