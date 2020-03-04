# @ turquoise/mock

- [@ turquoise/mock](#turquoisemock)
  - [installation](#installation)
  - [Custom model](#custom-model)
  - [File structure](#file-structure)
  - [Custom routing](#custom-routing)
  - [Extended random generator](#extended-random-generator)
  - [Middleware](#middleware)
  - [Launch configuration](#launch-configuration)
  - [Usage example](#usage-example)
  - [start a mock server](#start-a-mock-server)
  - [REST API Routes](#rest-api-routes)
    - [Plural routes](#plural-routes)
    - [Singular routes](#singular-routes)
    - [Filter](#filter)
    - [Paginate](#paginate)
    - [Sort](#sort)
    - [Slice](#slice)
    - [Operators](#operators)
    - [Full-text search](#full-text-search)
    - [Relationships](#relationships)
    - [Database](#database)
    - [Homepage](#homepage)

## installation

```shell
# Use npm
npm i @ turquoise/mock -D

# Use the Yarn 
yarn add turquoise/mock -D
```

## Custom model

Sample file `schema/api.ts`, mock rules can find at [mockjs](http://mockjs.com/)

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

## File structure

Project file structure that must be followed

```
|-- mock
    |-- routes // custom routes
    |-- schemas // schamas
    |-- random // extend mockjs Generator
    |-- middlewares // express middlewares
|-- .mockrc.ts // configuration
```

## Custom routing

Sample file `routes/user.ts`

```typescript
import { Request, Response } from "express";

export default [
  // 获取用户信息
  {
    path: "/me",
    controller: (req: Request, res: Response): void => {
      res.json({
        mobile: "@mobile",
        authorized: true, 
        withinWhiteList: true, 
        username: "xiaoming",
        role: ["admin", "test"],
      });
    }
  }
];
```



## Extended random generator

Sample file `random/ext.ts`

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

## Middleware

Sample file `middlewares/query.ts`

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

## Launch configuration

Read the project root directory by default `.mockrc.ts`

| Field    | Types of | Defaults               | description                        |
| -------- | -------- | ---------------------- | ---------------------------------- |
| port     | number   | 3000                   | Service port                       |
| delay    | number   | 0                      | Simulated network latency          |
| rewriter | object   | {"/ api / *": "/ $ 1"} | Rewrite routing                    |
| render   | function | -                      | `json-server`In the `render`method |

```typescript
export default {
  // change port
  port: 3002
}
```


## Usage example

In `package.json` use in

```js
{
   "scripts" : {
     "mock" : "turquoise-mock"
  }
}
```

## start a mock server

```shell
# Use npm
npm run mock

# Use the Yarn 
yarn run mock
```


## REST API Routes 

Based on the previous `schema/api.ts` , here are all the default routes. 

> base of [json-server](https://github.com/typicode/json-server)

### Plural routes

```
GET    /users
GET    /users/1
POST   /users
PUT    /users/1
PATCH  /users/1
DELETE /users/1
```

### Singular routes

```
GET    /profile
POST   /profile
PUT    /profile
PATCH  /profile
```

### Filter

Use `.` to access deep properties

```
GET /users?title=json-server&author=typicode
GET /users?id=1&id=2
GET /comments?author.name=typicode
```

### Paginate

Use `_page` and optionally `_limit` to paginate returned data.

In the `Link` header you'll get `first`, `prev`, `next` and `last` links.

```
GET /users?_page=7
GET /users?_page=7&_limit=20
```

*10 items are returned by default*

### Sort

Add `_sort` and `_order` (ascending order by default)

```
GET /users?_sort=views&_order=asc
GET /users/1/comments?_sort=votes&_order=asc
```

For multiple fields, use the following format:

```
GET /users?_sort=user,views&_order=desc,asc
```

### Slice

Add `_start` and `_end` or `_limit` (an `X-Total-Count` header is included in the response)

```
GET /users?_start=20&_end=30
GET /users/1/comments?_start=20&_end=30
GET /users/1/comments?_start=20&_limit=10
```

*Works exactly as [Array.slice](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) (i.e. `_start` is inclusive and `_end` exclusive)*

### Operators

Add `_gte` or `_lte` for getting a range

```
GET /users?views_gte=10&views_lte=20
```

Add `_ne` to exclude a value

```
GET /users?id_ne=1
```

Add `_like` to filter (RegExp supported)

```
GET /users?title_like=server
```

### Full-text search

Add `q`

```
GET /users?q=internet
```

### Relationships

To include children resources, add `_embed`

```
GET /users?_embed=comments
GET /users/1?_embed=comments
```

To include parent resource, add `_expand`

```
GET /comments?_expand=post
GET /comments/1?_expand=post
```

To get or create nested resources

```
GET  /users/1/comments
POST /users/1/comments
```

### Database

```
GET /db
```

### Homepage

Returns default index file or serves `./public` directory

```
GET /
```