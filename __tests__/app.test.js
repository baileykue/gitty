const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/utils/github');

describe('gitty routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should redirect to the github oauth page upon login', async () => {
    const res = await request(app).get('/api/v1/github/login');

    expect(res.header.location).toMatch(
      /https:\/\/github.com\/login\/oauth\/authorize\?client_id=[\w\d]+&scope=user&redirect_uri=http:\/\/localhost:7890\/api\/v1\/github\/login\/callback/i
    );
  });

  it('should login and redirect users to /api/v1/github/', async () => {
    const res = await request
      .agent(app)
      .get('/api/v1/github/login/callback?code=42')
      .redirects(1);

    expect(res.req.path).toEqual('/api/v1/posts');
  });

  it('should log out a user', async () => {
    const agent = request.agent(app);

    const login = await agent
      .get('/api/v1/github/login/callback?code=42')
      .redirects(1);
    expect(login.req.path).toEqual('/api/v1/posts');

    const logout = await agent.delete('/api/v1/github/logout');
    expect(logout.body).toEqual({ message: 'you have been logged out' });
  });

  it('should show a logged in user all the posts', async () => {
    const agent = request.agent(app);

    let res = await agent.get('/api/v1/posts');
    expect(res.status).toEqual(401);

    await agent.get('/api/v1/github/login/callback?code=42').redirects(1);

    res = await agent.get('/api/v1/posts');
    expect(res.status).toEqual(200);
    expect(res.body).toEqual([
      {
        id: expect.any(String),
        description: 'beets, bears, battlestar galactica',
        createdAt: expect.any(String),
        userId: null,
      },
      {
        id: expect.any(String),
        description: 'straws, streisand, star wars',
        createdAt: expect.any(String),
        userId: null,
      },
    ]);
  });

  it('should allow a logged in user to create a post', async () => {
    const agent = request.agent(app);

    await agent.get('/api/v1/github/login/callback?code=42').redirects(1);

    let res = await agent.get('/api/v1/posts');
    expect(res.status).toEqual(200);

    res = await agent.post('/api/v1/posts').send({
      description: 'existance is pain',
      userId: '1',
    });

    expect(res.body).toEqual({
      id: expect.any(String),
      description: 'existance is pain',
      userId: '1',
      createdAt: expect.any(String),
    });
  });

  it('should get all the quotes', async () => {
    const res = await request(app).get('/api/v1/quotes');

    expect(res.body).toEqual([
      { author: expect.any(String), content: expect.any(String) },
      { author: expect.any(String), content: expect.any(String) },
      { author: expect.any(String), content: expect.any(String) },
    ]);
  });
});
