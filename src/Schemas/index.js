const { gql } = require('apollo-server-express');

const userSchema = require('./User');
const messageSchema = require('./Message');

const baseSchema = gql`
	type Query {
		_: Boolean
	}

	type Mutation {
		_: Boolean
	}

	type Subscription {
		_: Boolean
	}
`;

module.exports = [baseSchema, userSchema, messageSchema];
