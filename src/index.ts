#!/usr/bin/env node

import jsonServer from 'json-server';
import Mock from 'mockjs';
import { Request, Response } from 'express';

import {
  getUserConfig,
  loadDBSchemas,
  loadRoutes,
  loadRandomExtend,
  loadMiddlewares,
} from './utils';

interface Router {
  path: string;
  method?: 'get' | 'post' | 'patch' | 'put' | 'delete';
  controller: (req: Request, res: Response) => void;
}

// 启动服务
export default async function start(): Promise<void> {
  const userConfig = getUserConfig();

  const [DBSchemas, routes, randomExtend, middlewares] = [
    loadDBSchemas('mock/schemas'),
    loadRoutes('mock/routes'),
    loadRandomExtend('mock/random'),
    loadMiddlewares('mock/middlewares'),
  ];

  if ((Mock.Random as any).extend) {
    (Mock.Random as any).extend(randomExtend);
  }

  const server = jsonServer.create();
  const router: any = jsonServer.router(Mock.mock(DBSchemas));
  const jsonServerMiddlewares = jsonServer.defaults({
    static: __dirname + '/public',
  });

  server.use(jsonServerMiddlewares);
  server.use(jsonServer.rewriter(userConfig.rewriter));
  server.use(jsonServer.bodyParser);

  middlewares.forEach((middleware: any): void => {
    server.use(middleware);
  });

  routes.forEach((router: Router): void => {
    server[router.method || 'get'](router.path, router.controller);
  });

  if (userConfig.render) {
    router.render = userConfig.render;
  }

  server.use(router);

  server.listen(userConfig.port, (): void => {
    console.log('Mock Server is running, port: ' + userConfig.port);
  });
}

start();
