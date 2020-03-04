# @ turquoise/mock

- [@ turquoise/mock](#turquoisemock)
  - [installation](#installation)
  - [Usage example](#usage-example)
  - [File structure](#file-structure)
  - [Custom routing](#custom-routing)
  - [Custom model](#custom-model)
  - [Extended random generator](#extended-random-generator)
  - [Middleware](#middleware)
  - [Launch configuration](#launch-configuration)

## installation

```
# Use npm
npm i @ turquoise / mock -D

# Use the Yarn 
the Yarn Turquoise @ the Add / mock -D
```

## Usage example

In `package.json`use in

```
{
   " scripts " : {
     " mock " : " turquoise-mock "
  }
}
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

```
import { Request , Response } from  " express " ;

export  default [
   // Get user information
  {
    path: " / me " ,
     controller : ( req :  Request , res :  Response ) :  void  => {
       res . json ({
        mobile: " @mobile " ,
        authorized: true , // Requires authorization 
        withoutWhiteList: true , // Whitelist 
        username: " xiaoming " ,
        role: [ " admin " , " test " ],
      });
    }
  }
];
```

## Custom model

Sample file `schema/api.ts`

```
export  default {
   " user | 100 " : [
    {
      " id | +1 " : 1 ,
      name: " @cname " ,
      age: 4 ,
      mobile: " @mobile " ,
      createdAt: " @datetime " ,
       " status | 1 " : [ " enabled " , " disabled " ]
    }
  ]
};
```

## Extended random generator

Sample file `random/ext.ts`

```
import  Mock  from  " mockjs " ;

export  default {
  mobile () :  string {
     return  Mock . mock ( / ^ 1 (9 | 3 | 4 | 5 | 7 | 8) [ 0-9 ] {9} $ / );
  },
  lon () :  number {
     return  Mock . Random . float ( 121.140308 , 121.82558 , 7 , 8 );
  },
  lat () :  number {
     return  Mock . Random . float ( 30.853426 , 31.363719 , 7 , 6 );
  }
};
```

## Middleware

Sample file `middlewares/query.ts`

```
import { Request , Response , NextFunction } from  " express " ;

Module1 . Exports  = [
   function ( REQ :  the Request , RES :  the Response , Next :  NextFunction ) :  void {
     IF ( REQ . Method  ===  " the PUT " ) {
       REQ . Method  =  " the PATCH " ;
    }

    console . log ( " before hook " );

    next ();

    console . log ( " after hook " );
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

```
export  default {
   // Change the default port 
  port: 3002 
}
```
