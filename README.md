# @turquoise/mock

- [安装](#安装)
- [使用示例](#使用示例)
- [文件结构](#文件结构)
- [自定义路由](#自定义路由)
- [自定义模型](#自定义模型)
- [扩展随机生成器](#扩展随机生成器)
- [中间件](#中间件)
- [启动配置](#启动配置)

## 安装

```bash
# 使用 npm
npm i @turquoise/mock -D

# 使用 yarn
yarn add @turquoise/mock -D
```

## 使用示例

在 `package.json` 里使用

```json
{
  "scripts": {
    "mock": "turquoise-mock"
  }
}
```

## 文件结构

必须遵循的项目文件结构

```text
|-- mock
    |-- routes // 路由，基于express，自己写控制器
    |-- schemas // 模型, json 格式快速定义数据模型
    |-- random // 扩展Mockjs生成器
    |-- middlewares // express 中间件
|-- .mockrc.ts // 配置
```


## 自定义路由

示例文件 `routes/user.ts`

```typescript
import { Request, Response } from "express";

export default [
  // 获取用户信息
  {
    path: "/me",
    controller: (req: Request, res: Response): void => {
      res.json({
        mobile: "@mobile",
        authorized: true, // 需要授权
        withinWhiteList: true, // 白名单
        username: "xiaoming",
        role: ["admin", "test"],
      });
    }
  }
];
```

## 自定义模型

示例文件 `schema/api.ts`

```typescript
export default {
  "user|100": [
    {
      "id|+1": 1,
      name: "@cname",
      age: 4,
      mobile: "@mobile",
      createdAt: "@datetime",
      "status|1": ["enabled", "disabled"]
    }
  ]
};
```

## 扩展随机生成器

示例文件 `random/ext.ts`

```typescript
import Mock from "mockjs";

export default {
  mobile(): string {
    return Mock.mock(/^1(9|3|4|5|7|8)[0-9]{9}$/);
  },
  lon(): number {
    return Mock.Random.float(121.140308, 121.82558, 7, 8);
  },
  lat(): number {
    return Mock.Random.float(30.853426, 31.363719, 7, 6);
  }
};
```

## 中间件

示例文件 `middlewares/query.ts`

```typescript
import { Request, Response, NextFunction } from "express";

module.exports = [
  function(req: Request, res: Response, next: NextFunction): void {
    if (req.method === "PUT") {
      req.method = "PATCH";
    }

    console.log("before hook");

    next();

    console.log("after hook");
  }
];
```

## 启动配置

默认读取项目根目录的 `.mockrc.ts`

| 字段     | 类型     | 默认值                | 描述                             |
| :------- | :------- | :-------------------- | :------------------------------- |
| port     | number   | 3000                  | 服务端口                         |
| delay    | number   | 0                     | 模拟网络延迟                     |
| rewriter | object   | { "/api/\*": "/\$1" } | 重写路由                         |
| render   | function | -                     | `json-server` 里的 `render` 方法 |


```typescript
export default {
  // 更改默认端口
  port: 3002
}
```