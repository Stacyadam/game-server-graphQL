const { gql } = require('apollo-server-express');

module.exports = gql`
	extend type Query {
		messages(cursor: String, limit: Int): [Message!]!
		message(id: ID!): Message!
	}

	extend type Mutation {
		createMessage(text: String!): Message!
		deleteMessage(id: ID!): Boolean!
	}

	type Message {
		id: ID!
		text: String!
		createdAt: String!
		user: User!
	}
`;
