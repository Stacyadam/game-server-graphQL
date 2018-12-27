const express = require('express');
const cors = require('cors');
const { ApolloServer, AuthenticationError } = require('apollo-server-express');
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
	context: async ({ req }) => {
		const me = await getMe(req);

		return {
			models,
			me,
			secret: process.env.SECRET
		};
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

const port = process.env.PORT || 8000;

sequelize.sync().then(() => {
	app.listen({ port }, () => {
		console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
	});
});
