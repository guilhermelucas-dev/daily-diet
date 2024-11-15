import { it, afterAll, beforeAll, describe, beforeEach, expect } from "vitest";
import { execSync } from 'node:child_process';
import request from "supertest";
import { app } from "../src/app";

describe("Meals routes", () => {
  beforeAll( async () => {
    await app.ready();
  });

  afterAll( async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all');
    execSync('npm run knex migrate:latest');
  });

  it('shoud be able to create a new meal', async () => {

    const createUserResponse = await request(app.server)
    .post('/users')
    .send({
      name: 'maria',
      email: 'maria@gmail.com',
     }).expect(201);

     const cookies = createUserResponse.get('Set-Cookie');

     const getUserResponse = await request(app.server).get('/users').set('Cookie', cookies).expect(200);

     const user_id = getUserResponse.body.users[0].id;

    await request(app.server)
     .post('/meals')
     .set('Cookie', cookies)
     .send({
        user_id: user_id,
        name: 'Breakfast',
        description: "It's a breakfast",
        is_diet: true,
        date: new Date(),   
     }).expect(201);
  });

  it('Shold be able to list all meals from a user', async () => {
    const createUserResponse = await request(app.server)
    .post('/users')
    .send({
      name: 'maria',
      email: 'maria@gmail.com',
     }).expect(201);

     const cookies = createUserResponse.get('Set-Cookie');

     const getUserResponse = await request(app.server).get('/users').set('Cookie', cookies).expect(200);

     const user_id = getUserResponse.body.users[0].id;

    await request(app.server)
     .post('/meals')
     .set('Cookie', cookies)
     .send({
        user_id: user_id,
        name: 'Breakfast',
        description: "It's a breakfast",
        is_diet: true,
        date: new Date(),   
     }).expect(201);

     await request(app.server)
     .post('/meals')
     .set('Cookie', cookies)
     .send({
        user_id: user_id,
        name: 'lunch',
        description: "It's a lunch",
        is_diet: true,
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1), // 1 day after   
     }).expect(201);

     await request(app.server).get(`/meals/${user_id}`).set('Cookie', cookies).expect(200);
  });

  it("should be able to gat a specifi meal", async () => {
    const createUserResponse = await request(app.server)
    .post('/users')
    .send({
      name: 'maria',
      email: 'maria@gmail.com',
     }).expect(201);

     const cookies = createUserResponse.get('Set-Cookie');

     const getUserResponse = await request(app.server).get('/users').set('Cookie', cookies).expect(200);

     const user_id = getUserResponse.body.users[0].id;

    await request(app.server)
     .post('/meals')
     .set('Cookie', cookies)
     .send({
        user_id: user_id,
        name: 'Breakfast',
        description: "It's a breakfast",
        is_diet: true,
        date: new Date(),   
     }).expect(201);

     await request(app.server)
     .post('/meals')
     .set('Cookie', cookies)
     .send({
        user_id: user_id,
        name: 'lunch',
        description: "It's a lunch",
        is_diet: true,
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1), // 1 day after   
     }).expect(201);

     const listUserMeals = await request(app.server).get(`/meals/${user_id}`).set('Cookie', cookies).expect(200);

     const mealId = listUserMeals.body.meals[0].id;

     await request(app.server).get(`/meals/${mealId}/users/${user_id}`).set('Cookie', cookies).expect(200);

  });

  it('should be able to update a meal from a user', async () => {
    const createUserResponse = await request(app.server)
    .post('/users')
    .send({
      name: 'maria',
      email: 'maria@gmail.com',
     }).expect(201);

     const cookies = createUserResponse.get('Set-Cookie');

     const getUserResponse = await request(app.server).get('/users').set('Cookie', cookies).expect(200);

     const user_id = getUserResponse.body.users[0].id;

    await request(app.server)
     .post('/meals')
     .set('Cookie', cookies)
     .send({
        user_id: user_id,
        name: 'Breakfast',
        description: "It's a breakfast",
        is_diet: true,
        date: new Date(),   
     }).expect(201);

     await request(app.server)
     .post('/meals')
     .set('Cookie', cookies)
     .send({
        user_id: user_id,
        name: 'lunch',
        description: "It's a lunch",
        is_diet: true,
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1), // 1 day after   
     }).expect(201);

     const listUserMeals = await request(app.server).get(`/meals/${user_id}`).set('Cookie', cookies).expect(200);

     const mealId = listUserMeals.body.meals[0].id;

     await request(app.server).put(`/meals/${mealId}`).set('Cookie', cookies).send({
      name: 'Dinner',
      description: "It's a dinner",
      is_diet: true,
      date: new Date(),
     }).expect(204);
  });


  it("Shoud be able to delete a meal from a user", async () => {
    const createUserResponse = await request(app.server)
    .post('/users')
    .send({
      name: 'maria',
      email: 'maria@gmail.com',
     }).expect(201);

     const cookies = createUserResponse.get('Set-Cookie');

     const getUserResponse = await request(app.server).get('/users').set('Cookie', cookies).expect(200);

     const user_id = getUserResponse.body.users[0].id;

    await request(app.server)
     .post('/meals')
     .set('Cookie', cookies)
     .send({
        user_id: user_id,
        name: 'Breakfast',
        description: "It's a breakfast",
        is_diet: true,
        date: new Date(),   
     }).expect(201);

     await request(app.server)
     .post('/meals')
     .set('Cookie', cookies)
     .send({
        user_id: user_id,
        name: 'lunch',
        description: "It's a lunch",
        is_diet: true,
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1), // 1 day after   
     }).expect(201);

     const listUserMeals = await request(app.server).get(`/meals/${user_id}`).set('Cookie', cookies).expect(200);

     const mealId = listUserMeals.body.meals[0].id;

     await request(app.server).delete(`/meals/${mealId}`).set('Cookie', cookies).expect(204);
  });   

     it('should be able to get metrics from a user', async () => {
      const createUserResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'maria',
        email: 'maria@gmail.com',
       }).expect(201);
  
       const cookies = createUserResponse.get('Set-Cookie');
  
       const getUserResponse = await request(app.server).get('/users').set('Cookie', cookies).expect(200);
  
       const user_id = getUserResponse.body.users[0].id;
  
      await request(app.server)
       .post('/meals')
       .set('Cookie', cookies)
       .send({
          user_id: user_id,
          name: 'Breakfast',
          description: "It's a breakfast",
          is_diet: true,
          date: new Date('2024-11-13 08:00:00'),   
       }).expect(201);
  
       await request(app.server)
       .post('/meals')
       .set('Cookie', cookies)
       .send({
          user_id: user_id,
          name: 'lunch',
          description: "It's a lunch",
          is_diet: false,
          date: new Date('2024-11-13 12:00:00')
       }).expect(201);

       await request(app.server)
       .post('/meals')
       .set('Cookie', cookies)
       .send({
          user_id: user_id,
          name: 'Snack',
          description: "It's a snack",
          is_diet: true,
          date: new Date('2024-11-13 15:00:00')
       }).expect(201);

       await request(app.server)
       .post('/meals')
       .set('Cookie', cookies)
       .send({
          user_id: user_id,
          name: 'Dinner',
          description: "It's a dinner",
          is_diet: true,
          date: new Date('2024-11-13 20:00:00')
       }).expect(201);

       await request(app.server)
       .post('/meals')
       .set('Cookie', cookies)
       .send({
          user_id: user_id,
          name: 'Breakfast',
          description: "It's a breakfast",
          is_diet: true,
          date: new Date('2024-11-14 08:00:00')
       }).expect(201);
  
      const metricsResponse = await request(app.server).get(`/meals/metrics/${user_id}`).set('Cookie', cookies).expect(200);

       expect(metricsResponse.body).toEqual({
        totalMeals: 5,
        totalMealsOnDiet: 4,
        totalMealsOffDiet: 1,
        bestOnDietSequence: 3,
      });

    });
});