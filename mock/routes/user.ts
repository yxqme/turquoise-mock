import { Request, Response } from 'express';

export default [
  // 获取用户信息
  {
    path: '/me',
    method: 'get',
    controller: (req: Request, res: Response): void => {
      res.json({
        mobile: '@mobile',
        authorized: true, // 需要授权
        withinWhiteList: true, // 白名单
        username: 'xiaoqiang.yang',
        role: ['mercator:admin', 'test'],
        hma: true, // 是否支持高清图层
      });
    },
  },
];
