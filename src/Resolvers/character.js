const { combineResolvers } = require('graphql-resolvers');
const { isAuthenticated, isCharacterOwner, isAdmin } = require('./authorization');

module.exports = {
	Query: {
		characters: combineResolvers(isAdmin, (parent, args, { models }) => {
			return models.Character.findAll();
		}),
		character: combineResolvers(isAuthenticated, async (parent, args, { models }) => {
			const { name } = args;
			const character = await models.Character.findOne({ where: { name } });
			if (!character) throw new Error('Character not found.');
			return character;
		})
	},

	Mutation: {
		createCharacter: combineResolvers(isAuthenticated, (parent, args, { models, me }) => {
			console.log('this is me', me);
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
