const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');

const schema = require('./Schemas');
const resolvers = require('./Resolvers');

if (process.env.NODE_ENV !== 'production') {
	require('dotenv/config');
}

const { sequelize, models } = require('./models');

const app = express();

app.use(cors());

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
	context: async () => ({
		models,
		me: await models.User.findByLogin('rwieruch'),
		secret: process.env.SECRET
	})
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
