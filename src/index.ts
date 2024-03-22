import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import typeDefs from './schema.ts';
import resolvers from './resolver.ts';
import PGQueries from './datasources/postgres-db.ts';

dotenv.config();

const app = express();
const port = process.env.PORT;
const httpServer = http.createServer(app);

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});
await server.start();

app.use(
  cors(),
  bodyParser.json(),
  expressMiddleware(server, {
    context: async () => {
      return {
        dataSources: {
          pgQueries: new PGQueries(),
        }
      }
    }
  }),
);

await new Promise((resolve: any) => httpServer.listen(port, resolve));
console.log(`🚀 Server ready at http://localhost:${port}`);