const { combineResolvers } = require('graphql-resolvers');
const { isAuthenticated, isCharacterOwner, isAdmin } = require('./authorization');

module.exports = {
	Query: {
		characters: combineResolvers(isAdmin, (parent, args, { models }) => {
			return models.Character.findAll();
		}),
		character: combineResolvers(isAuthenticated, isCharacterOwner, (parent, args, { models, me }) => {
			const { id } = args;
			return models.Character.findById(id);
		})
	},

	Mutation: {
		createCharacter: combineResolvers(isAuthenticated, (parent, args, { models, me }) => {
			const { name, race } = args;
			return models.Character.create({
				name,
				race,
				userId: me.id
			});
		}),

		deleteCharacter: combineResolvers(isAuthenticated, isCharacterOwner, (parent, args, { models }) => {
			const { name } = args;
			return models.Character.destroy({ where: { name } });
		})
	},

	Character: {
		user: (message, args, { models }) => {
			return models.User.findById(message.userId);
		}
	}
};
