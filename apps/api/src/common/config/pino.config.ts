import type { Request } from 'express';
import type { Params } from 'nestjs-pino';

export const pinoConfig = (): Params => ({
  pinoHttp: {
    name: 'HelloHardware',
    transport: {
      target: 'pino-pretty',
      options: {
        singleLine: true,
        colorized: true,
        levelFirst: true,
        autoLogging: false,
        translateTime: 'dd-mm-yyyy, HH:MM:ss',
      },
    },
    serializers: {
      req: (request: Request) => {
        return {
          id: request.id,
          method: request.method,
          url: request.url,
          params: request.params,
          host: request.headers.host,
          authorization: request.headers.authorization,
          cookie: request.headers.cookie,
        };
      },
    },
  },
});
