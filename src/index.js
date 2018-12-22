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
	const token = req.headers['x-token'];

	if (token) {
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
	formatError: error => {
		const message = error.message.replace('SequeilzeValdationError: ', '').replace('Validation error: ', '');

		return {
			...error,
			message
		};
	},
	context: async ({ req }) => {
		const me = await getMe(req);

		return {
			models,
			me,
			secret: process.env.SECRET
		};
	}
});

server.applyMiddleware({ app });

const port = process.env.PORT || 8000;

const runSeedData = true;

const createUsersWithMessages = async () => {
	await models.User.create(
		{
			username: 'rwieruch',
			email: 'hello@robin.com',
			password: 'rwieruch',
			role: 'ADMIN',
			messages: [
				{
					text: 'Published the Road to learn React'
				}
			]
		},
		{
			include: [models.Message]
		}
	);

	await models.User.create(
		{
			username: 'ddavids',
			email: 'hello@david.com',
			password: 'ddavids',
			messages: [
				{
					text: 'Happy to release ...'
				},
				{
					text: 'Published a complete ...'
				}
			]
		},
		{
			include: [models.Message]
		}
	);
};

sequelize.sync({ force: runSeedData }).then(async () => {
	if (runSeedData) {
		createUsersWithMessages();
	}

	app.listen({ port }, () => {
		console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
	});
});
