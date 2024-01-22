const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-requestid')());
app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let requestsResolves = {};

router.get('/subscribe', async (ctx, next) => {
  ctx.body = await new Promise((resolve) => {
    const id = ctx.state.id;
    requestsResolves[id] = resolve;

    ctx.res.on('error', () => {
      if (typeof requestsResolves[id] === 'function') {
        requestsResolves[id]();
        delete requestsResolves[id];
      }
    });
  });
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;

  if (!message) {
    ctx.throw(400, 'bad request');
  }

  const keys = Object.keys(requestsResolves);

  keys.forEach((key) => {
    requestsResolves[key](message);
  });

  requestsResolves = {};

  ctx.body = 'ok';
});

app.use(router.routes());

module.exports = app;
