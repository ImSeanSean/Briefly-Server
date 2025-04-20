import { Elysia } from 'elysia';
import 'bun';
import accountRoute from './routes/account';
import listRoute from './routes/list';
import { transactionRoute } from './routes/transaction';

const port = Number(process.env.PORT) || 3000;

const app = new Elysia()
  .get('/', () => 'Welcome to Briefly-Server!')
  .use(accountRoute)
  .use(listRoute)
  .use(transactionRoute);

// Start the server
app.listen(port, () => {
  console.log(`🚀 Running on http://localhost:${port}`);
});
