const { gql } = require('apollo-server-express');

module.exports = gql`
	extend type Query {
		message(id: ID!): Message!
		messages: [Message!]!
	}

	extend type Mutation {
		createMessage(text: String!): Message!
		deleteMessage(id: ID!): Boolean!
		updateMessage(id: ID!, text: String!): Message!
	}

	type Message {
		id: ID!
		text: String!
		user: User!
	}
`;
