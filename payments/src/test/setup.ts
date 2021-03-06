import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';

declare global {
  namespace NodeJS {
    interface Global {
      signin(id?: string): string[];
    }
  }
}

jest.mock('../nats-wrapper');

process.env.STRIPE_KEY = 'sk_test_51HAclbLSCjDI1izIC6WEztl36MUVETlYCFCqnuriKr9eOhW20GeNAhviiBLcOy96R8PSXY8wWQgSQ1gwVACSBc6t00XAMqY5pX'

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KET = 'asdf';

  mongo = new MongoMemoryServer();
  const mongouri = await mongo.getUri();

  await mongoose.connect(mongouri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  //   Build a JWT payload. (id, email)

  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: ' afasina@test.com'
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KET!);

  // Build a session object (jwt: My_JWT)
  const session = { jwt: token };

  //Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  //Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string the cookie with encoded data
  return [`express:sess=${base64}`];
};
