import { User } from '@src/models/user';
import { AuthService } from '@src/services/auth';
import { faker } from '@faker-js/faker'

describe('Users functional tests', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  describe('When creating a new user', () => {
    it('should successfully create a new user with encrypted password', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: '123456'
      }

      const response = await global.testRequest.post('/users').send(newUser);
      expect(response.status).toBe(201)
      await expect(AuthService.comparePasswords(newUser.password, response.body.password)).resolves.toBe(true)
      expect(response.body).toEqual(expect.objectContaining({
        ...newUser,
        ...{ password: expect.any(String) }
      }))
    });

    it('should return 422 when there is a validation error', async () => {
      const newUser = {
        email: 'johndoe@gmail.com',
        password: '123456'
      }

      const response = await global.testRequest.post('/users').send(newUser);
      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        code: 422,
        error: 'User validation failed: name: Path `name` is required.'
      })
    });

    it('should return 409 when the email already exists', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: '123456'
      }
      await global.testRequest.post('/users').send(newUser);

      const response = await global.testRequest.post('/users').send(newUser);
      expect(response.status).toBe(409)
      expect(response.body).toEqual({
        code: 409,
        error: 'User validation failed: email: already exists in the database.'
      })
    });
  });

  describe('When authenticating a user', () => {
    it('should generate a token for a valid user', async () => {
      const newUser = {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        password: faker.datatype.uuid()
      }
      await new User(newUser).save()
      const response = await global.testRequest
        .post('/users/authenticate')
        .send({ email: newUser.email, password: newUser.password})

      expect(response.body).toEqual(expect.objectContaining({ token: expect.any(String) }))
    });

    it('should return UNAUTHORIZED if the user with the given email is not found', async () => {
      const email = faker.internet.email()
      const password = faker.datatype.uuid()

      const response = await global.testRequest
        .post('/users/authenticate')
        .send({ email, password})

      expect(response.status).toBe(401)
    });

    it('should return UNAUTHORIZED if the user is found but the password does not match', async () => {
      const newUser = {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        password: faker.datatype.uuid()
      }
      await new User(newUser).save()
      const response = await global.testRequest
        .post('/users/authenticate')
        .send({ email: newUser.email, password: "different_password"})

      expect(response.status).toBe(401)
    });
  });
});
