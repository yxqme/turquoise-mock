import { Router } from '../../src';

export default [
  {
    path: '/me',
    method: 'get',
    controller: (req, res): void => {
      res.json({
        mobile: 'xxx',
        role: ['admin', 'test', 'superAdmin'],
      });
    },
  },
] as Router[];
