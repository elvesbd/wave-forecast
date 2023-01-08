import { User } from '@src/models/user';

describe('Users functional tests', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  describe('When creating a new user', () => {
    it('should succesfully create a new user', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: '123456'
      }

      const response = await global.testRequest.post('/users').send(newUser);
      expect(response.status).toBe(201)
      expect(response.body).toEqual(expect.objectContaining(newUser))
    });
  });
});
