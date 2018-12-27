const express = require('express');
const cors = require('cors');
const { ApolloServer, AuthenticationError } = require('apollo-server-express');
const http = require('http');
const jwt = require('jsonwebtoken');

const schema = require('./Schemas');
const resolvers = require('./Resolvers');

if (process.env.NODE_ENV !== 'production') {
	require('dotenv/config');
}

const { sequelize, models } = require('./models');

const app = express();

app.use(cors());

const getMe = async req => {
	let token = req.headers.authorization;

	if (token) {
		token = token.replace('Bearer ', '');
		try {
			return await jwt.verify(token, process.env.SECRET);
		} catch (error) {
			throw new AuthenticationError('Your session has expired. Please sign in again.');
		}
	}
};

const server = new ApolloServer({
	typeDefs: schema,
	resolvers,
	context: async ({ req, connection }) => {
		if (connection) {
			return {
				models
			};
		}
		if (req) {
			const me = await getMe(req);

			return {
				models,
				me,
				secret: process.env.SECRET
			};
		}
	},
	formatError: error => {
		const message = error.message.replace('SequeilzeValdationError: ', '').replace('Validation error: ', '');

		return {
			...error,
			message
		};
	},
	//enable GraphQL playground in production
	introspection: true,
	playground: true
});

server.applyMiddleware({ app });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const port = process.env.PORT || 8000;

sequelize.sync().then(() => {
	httpServer.listen({ port }, () => {
		console.log(`Apollo Server on http://localhost:${port}/graphql`);
	});
});
