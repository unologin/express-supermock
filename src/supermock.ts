

import supertest from 'supertest';

import express from 'express';

import methods from 'methods';

interface APIMock
{
  supertest: supertest.SuperTest<supertest.Test>,
  host: string;
}

interface Handler
{
  app?: express.Application;
  handler?: express.Handler;
  router?: express.Router;
}

// all registered api mocks
const mocks : APIMock[] = [];

/**
 * Registers a new api mock
 * @param url host to mock
 * @param param1 app, handler, or router
 * @returns void
 */
export function mock(
  url: string, 
  { app, handler, router }: Handler,
)
{
  if (!app)
  {
    app = express();

    app.use(handler || router || (() => {}));
  }

  mocks.push({ supertest: supertest(app), host: url });
}

export interface Supermock
{
  [method: string]: (
    url : string | URL,
    callback? : supertest.CallbackHandler
  ) => supertest.Test;

  (method: string, url: string | URL): supertest.Test;
}

/**
 * @param method method
 * @param url url
 * @returns same as supertest(method, url)
 */
export const supermock = function(
  method : string,
  url: string | URL,
)
{
  return (supermock as any)[method.toLowerCase()](url);
} as any as Supermock;

// intercept all http methods
for (const method of methods as string[])
{
  supermock[method] = function(
    url : string | URL,
    callback? : supertest.CallbackHandler,
  ) : supertest.Test
  {
    const { host, pathname, search } = new URL(url.toString());

    for (const mock of mocks)
    {
      if (mock.host === host)
      {
        return (mock.supertest as any)[method](pathname + search, callback)
          .set('Host', host);
      }
    }

    throw new Error('no mock found for ' + host);
  };
}
