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
  loadMiddlewares,
} from './utils';

interface Router {
  path: string;
  method?: 'get' | 'post' | 'patch' | 'put' | 'delete';
  controller: (req: Request, res: Response) => void;
}

let server: Server;
let sockets: Socket[] = [];

// 启动服务
export default function boot() {
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

  const app = jsonServer.create();
  const router: any = jsonServer.router(Mock.mock(DBSchemas));
  const jsonServerMiddlewares = jsonServer.defaults({
    static: __dirname + '/public',
  });

  app.use(jsonServerMiddlewares);
  app.use(jsonServer.rewriter(userConfig.rewriter));
  app.use(jsonServer.bodyParser);

  middlewares.forEach((middleware: any) => {
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
    console.log('Mock Server is running, port: ' + userConfig.port);
  });

  server.on('connection', socket => {
    sockets.push(socket);
  });
}

boot();

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
