#!/usr/bin/env node

import jsonServer from 'json-server';
import Mock from 'mockjs';
import { Server } from 'http';
import { Socket } from 'net';
import { Request, Response } from 'express';
import chokidar from 'chokidar';

import {
  sourcePath,
  getUserConfig,
  loadDBSchemas,
  loadRoutes,
  loadRandomExtend,
  loadMiddleware,
} from './utils';

export interface Router {
  path: string;
  method?: 'get' | 'post' | 'patch' | 'put' | 'delete';
  controller: (req: Request, res: Response) => void;
}

let server: Server;
let sockets: Socket[] = [];

// 启动服务
export function boot() {
  const userConfig = getUserConfig();

  const [DBSchemas, routes, randomExtend, middleware] = [
    loadDBSchemas('mock/schemas'),
    loadRoutes('mock/routes'),
    loadRandomExtend('mock/random'),
    loadMiddleware('mock/middleware'),
  ];

  if ((Mock.Random as any).extend) {
    (Mock.Random as any).extend(randomExtend);
  }

  const app = jsonServer.create();
  const router: any = jsonServer.router(Mock.mock(DBSchemas));
  const jsonServerMiddleware = jsonServer.defaults({
    static: __dirname + '/public',
  });

  app.use(jsonServerMiddleware);
  app.use(jsonServer.rewriter(userConfig.rewriter));
  app.use(jsonServer.bodyParser);

  middleware.forEach((middleware: any) => {
    app.use(middleware);
  });

  routes.forEach((router: Router) => {
    app[router.method || 'get'](router.path, router.controller);
  });

  if (userConfig.render) {
    router.render = userConfig.render;
  }

  app.use(router);

  server = app.listen(userConfig.port, () => {
    console.log('Mock Server is running, http://localhost:' + userConfig.port);
  });

  server.on('connection', socket => {
    sockets.push(socket);
  });
}

export function watcher() {
  const watcher = chokidar.watch(sourcePath);

  watcher.on('change', path => {
    Object.keys(require.cache).forEach(function(id) {
      if (path === id) {
        delete require.cache[id];
      }
    });

    sockets.forEach(socket => {
      if (socket.destroyed === false) {
        socket.destroy();
      }
    });

    sockets = [];

    server.close(() => {
      boot();
    });
  });
}
