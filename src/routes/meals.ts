import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../database';
import { randomUUID } from 'crypto';
import { checkSessionIdExists } from '../middlewares/check-session-id-existis';

export function mealsRoutes(app: FastifyInstance) {
  app.post("/", {
    preHandler: [checkSessionIdExists],
  }, async(request, reply) => {

    const createMealsBodySchema = z.object({
      user_id: z.string().uuid(),
      name: z.string(),
      description: z.string(),
      is_diet: z.boolean(),
    });

    const { user_id, name, description, is_diet } = createMealsBodySchema.parse(request.body);

    await knex('meals').insert(
      {
        id: randomUUID(),
        user_id: user_id, 
        name: name,
        description: description,
        is_diet: is_diet
      }
    );

    return reply.status(201).send();
  }); 

  app.get("/:user_id",  {
    preHandler: [checkSessionIdExists]
  } ,async(request, reply) => {

    const getUserMealsParamsSchema = z.object({
      user_id: z.string().uuid(),
    })

    const { user_id } = getUserMealsParamsSchema.parse(request.params);

    const meals = await knex('meals').where('user_id', user_id).orderBy('created_at', 'desc');

    return reply.send({ meals });
  });


  app.get("/:id/users/:user_id", { 
    preHandler: [checkSessionIdExists] 
  }, async (request, reply) => {

    const getMealParamsSchema = z.object({ 
      id: z.string().uuid(),
      user_id: z.string().uuid()
    });

    const { id, user_id } = getMealParamsSchema.parse(request.params);

    const meal = await knex('meals').where({ id: id, user_id: user_id }).first();

    if (!meal) {
      return reply.status(404).send({ error: 'Meal not found '});
    }

    return reply.send({ meal });
  })

  app.put("/:id", {preHandler: [checkSessionIdExists]}, async(request, reply) => {

    const updateMealsParamsSchema = z.object({
      id: z.string().uuid()
    });

    const { id } = updateMealsParamsSchema.parse(request.params);

    const updateMealsBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      is_diet: z.boolean(),
    })

    const { name, description, is_diet } = updateMealsBodySchema.parse(request.body);

    const meal = await knex('meals').where('id', id).first();

    if (!meal) {
      return reply.status(404).send({ error: 'Meal not found' });
    }

    await knex('meals').where('id', id).update({
      name: name,
      description: description,
      is_diet: is_diet
    });

    return reply.status(204).send();
  });

  app.delete("/:id", {preHandler: [checkSessionIdExists]}, async (request, reply) => {

    const deleteMealSchema = z.object({
      id: z.string().uuid()
    });

    const { id } = deleteMealSchema.parse(request.params);
    console.log(id);

    const meal = await knex('meals').where('id', id).first();
    console.log(meal);

    if (!meal) {
      return reply.status(404).send({ error: 'Meal not found' });
    }

    await knex('meals').where('id', id).delete();

    return reply.status(204).send();
  });
}