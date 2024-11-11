import fastify from "fastify";
import { usersRoutes } from "./routes/users";
import cookie from '@fastify/cookie';
import { mealsRoutes } from "./routes/meals";

const app = fastify();

app.register(cookie);

app.register(usersRoutes, {
  prefix: 'users'
});

app.register(mealsRoutes, {
  prefix: 'meals'
})

// app.get('/hello', () => {
//   return 'Hello Word';
// });

app.listen({
  port: 3333,
}).then(() => {
  console.log("HTTP Server is Running!");
})