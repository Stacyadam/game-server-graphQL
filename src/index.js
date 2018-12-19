const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');

const schema = require('./Schemas');
const resolvers = require('./Resolvers');

const { users, messages } = require('./mocks');
require('./models');
const { sequelize } = require('./models');

const app = express();

app.use(cors());

const server = new ApolloServer({
	typeDefs: schema,
	resolvers,
	context: {
		users,
		messages,
		me: users[1]
	}
});

server.applyMiddleware({ app, path: '/graphql' });

const port = process.env.PORT || 8000;

sequelize.sync().then(async () => {
	app.listen({ port }, () => {
		console.log(`Apollo Server running on port ${port}/graphql`);
	});
});
