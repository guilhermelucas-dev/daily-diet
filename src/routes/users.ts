import { randomUUID } from 'crypto';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../database'

export async function usersRoutes(app: FastifyInstance) {

  app.post("/", async (request, reply) => {

    const createUsersBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      avatar: z.string().optional()
    });

    let sessionId = request.cookies.sessionId;


    if (!sessionId) {
      sessionId = randomUUID();

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    } 

    const { name, email, avatar } = createUsersBodySchema.parse(request.body);

    const userEmailExists = await knex('users').where({email}).first();

    if (userEmailExists) {
      return reply.status(400).send({ message: 'User alread exists' });
    }

    await knex('users').insert({
      id: randomUUID(),
      name: name,
      email: email,
      avatar: avatar,
      session_id: sessionId,
    });

    return reply.status(201).send();
  
  });

  app.get("/", async() => {

    const users = await knex('users').select('*');

    return { users };
  });
}