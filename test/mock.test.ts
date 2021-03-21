

import { supermock, mock } from '../src/supermock';

import express from 'express';
import { assert } from 'chai';

// simple express handler function
mock('google.com', { handler: (req, res) => res.send('Google') });

// setup with a router
// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/example1', (req, res) => res.send('Route1'));
router.post('/example2', (req, res) => res.send('Route2'));

mock('unolog.in', { router });

// setup with an express app
const app = express();

app.use(router);
app.get('/example3', (req, res) => res.send('Route3'));

mock('example.com', {app});

describe('per host mocking', () => 
{
  it('express handler function', async () => 
  {
    const { text } = await supermock.post(
      'https://google.com/auihwd?auwzgd=lawh',
    ).send();

    assert.strictEqual(text, 'Google');
  });

  it('express router', async () => 
  {
    const { text } = await supermock.post('https://unolog.in/example1').send();

    assert.strictEqual(text, 'Route1');

    const { text: text2 } = await supermock.post(
      'https://unolog.in/example2',
    ).send();

    assert.strictEqual(text2, 'Route2');
  });

  it('express router', async () => 
  {
    const { text } = await supermock.post(
      'https://example.com/example1',
    ).send();

    assert.strictEqual(text, 'Route1');

    const { text: text2 } = await supermock.post(
      'https://example.com/example2',
    ).send();

    assert.strictEqual(text2, 'Route2');

    const { text: text3 } = await supermock.get(
      'https://example.com/example3',
    ).send();

    assert.strictEqual(text3, 'Route3');
  });

});

describe('calling superagent as a function', () => 
{
  it('returns mocked results', async () => 
  {
    const { text } = await supermock(
      'POST',
      new URL('https://google.com/auihwd?auwzgd=lawh'),
    ).send();

    assert.strictEqual(text, 'Google');
  });

});
