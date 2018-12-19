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
	context: async () => ({
		models,
		me: await models.User.findByLogin('rwieruch')
	})
});

server.applyMiddleware({ app, path: '/graphql' });

const port = process.env.PORT || 8000;

sequelize.sync().then(async () => {
	app.listen({ port }, () => {
		console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
	});
});
