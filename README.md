## express-supermock

Mock thrid party apis using superagent and express.

```javascript

// require or import
const { supermock, mock } = require('express-supermock');

// re-route all traffic from api.example.com to your mock implementation

// using an express app
mock('api.example.com', { app: myExpressApp });

// using an express router
mock('api2.example.com', { router: myExpressRouter });

// using just a simple callback
mock('api3.example.com', { handler: (req, res, next) => {...} });

```

Then use the ```supermock``` object like you would use [superagent](https://www.npmjs.com/package/superagent) or replace it using [proxyquire](https://www.npmjs.com/package/proxyquire). 

```javascript
// myModule's superagent will now re-route to your mock implementation
const myModule = proxyquire('my-module', { superagent: supermock });
```