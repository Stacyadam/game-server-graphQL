const { gql } = require('apollo-server-express');

module.exports = gql`
	extend type Query {
		character(name: String!): Character!
		characters: [Character!]!
	}

	extend type Mutation {
		createCharacter(name: String!, race: String!, level: Int): Character!
		deleteCharacter(name: String!): Boolean!
	}

	type Character {
		id: ID!
		name: String!
		race: String!
		level: Int!
		user: User!
	}
`;
