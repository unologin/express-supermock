

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
 * @param api 
 */
export function mock(
  url: string, 
  { app, handler, router }: Handler
)
{
  if(!app)
  {
    app = express();

    app.use(handler || router || (() => {}));
  }

  mocks.push({ supertest: supertest(app), host: url })
}

// TODO: find a better way to create a supertest type...
export const supermock = supertest(express());

// intercept all http methods
for(let method of methods as string[])
{
  // this is a little hacky but it does the job
  (supermock as { [k: string]: any })[method] = 
  function(url : string, callback? : supertest.CallbackHandler) : supertest.Test
  {
    let { host, pathname, search } = new URL(url);

    for(let mock of mocks)
    {
      if(mock.host === host)
      {
        return (mock.supertest  as { [k: string]: any })[method](pathname + search, callback)
        .set('Host', host)
      }
    }

    throw new Error('no mock found for ' + host);
  }
}