const { combineResolvers } = require('graphql-resolvers');
const { isAuthenticated, isCharacterOwner, isAdmin } = require('./authorization');

module.exports = {
	Query: {
		messages: async (parent, args, { models }) => {
			return await models.Message.findAll();
		},
		message: async (parent, { id }, { models }) => {
			return await models.Message.findById(id);
		}
	},

	Mutation: {
		createMessage: async (parent, { text }, { me, models }) => {
			console.log('this is me', me);
			return await models.Message.create({
				text,
				userId: me.id
			});
		},

		deleteMessage: async (parent, { id }, { models }) => {
			return await models.Message.destroy({ where: { id } });
		}
	},

	Message: {
		user: async (message, args, { models }) => {
			return await models.User.findById(message.userId);
		}
	}
};
