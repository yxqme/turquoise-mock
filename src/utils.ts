import { existsSync } from 'fs';
import path, { join } from 'path';
import slash from 'slash';
import glob from 'glob';
import { Request, Response } from 'express';

export const cwd = process.cwd();
export const CONFIG_FILES = ['.mockrc.js', '.mockrc.ts'];
export const sourcePath = [...CONFIG_FILES, 'mock/**'].map(file =>
  slash(join(cwd, file))
);

require('@babel/register')({
  presets: [
    require.resolve('@babel/preset-typescript'),
    [
      require.resolve('@babel/preset-env'),
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
  plugins: [['@babel/plugin-proposal-class-properties', { loose: true }]],
  extensions: ['.js', '.ts'],
  only: sourcePath,
  babelrc: false,
  cache: false,
});

interface Config {
  port: number;
  rewriter: {
    [key: string]: string;
  };
  render?: (req: Request, res: Response) => void;
}

const defaultConfig: Config = {
  port: 3000,
  rewriter: {
    '/api/*': '/$1',
  },
};

export function getExistFile({
  cwd,
  files,
  returnRelative,
}: {
  cwd: string;
  files: string[];
  returnRelative: boolean;
}): string | void {
  for (const file of files) {
    const absFilePath = join(cwd, file);
    if (existsSync(absFilePath)) {
      return returnRelative ? file : absFilePath;
    }
  }
}

function testDefault(obj: any): any {
  return obj.default || obj;
}

// 获取用户配置
export function getUserConfig(): Config {
  const configFile = getExistFile({
    cwd,
    files: CONFIG_FILES,
    returnRelative: false,
  });

  if (configFile) {
    const userConfig = testDefault(require(configFile));

    return {
      ...defaultConfig,
      ...userConfig,
    };
  }

  return defaultConfig;
}

// 加载并处理文件
export function loadFiles(pathname: string, callback: (content: any) => void) {
  const files = glob.sync(path.resolve(pathname, '**.+(t|j)s'));
  files.forEach(file => {
    if (/\.[j|t]s/.test(file)) {
      const content = testDefault(require(path.resolve(cwd, file)));
      callback(content);
    }
  });
}

// 加载接口模型
export function loadDBSchemas(pathname: string) {
  let schemas: { [key: string]: any } = {};
  loadFiles(pathname, content => {
    if (typeof content === 'object') {
      schemas = {
        ...schemas,
        ...content,
      };
    } else {
      throw new Error('schemas config format error');
    }
  });
  return schemas;
}

// 加载路由
export function loadRoutes(pathname: string) {
  let routes: any[] = [];
  loadFiles(pathname, content => {
    if (Array.isArray(content)) {
      routes = routes.concat(content);
    } else {
      throw new Error('routes config format error');
    }
  });
  return routes;
}

// 加载 mockjs 扩展
export function loadRandomExtend(pathname: string) {
  let randomExtend: { [key: string]: any } = {};
  loadFiles(pathname, (content): void => {
    if (typeof content === 'object') {
      randomExtend = {
        ...randomExtend,
        ...content,
      };
    } else {
      throw new Error('randomExtend config format error');
    }
  });
  return randomExtend;
}

// 加载中间件
export function loadMiddleware(pathname: string) {
  let middleware: any[] = [];
  loadFiles(pathname, content => {
    if (Array.isArray(content)) {
      middleware = middleware.concat(content);
    } else {
      throw new Error('middleware config format error');
    }
  });
  return middleware;
}
