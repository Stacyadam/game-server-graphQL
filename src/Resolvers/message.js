const { combineResolvers } = require('graphql-resolvers');
const { isAuthenticated, isMessageOwner } = require('./authorization');

module.exports = {
	Query: {
		messages: (parent, args, { models }) => {
			return models.Message.findAll();
		},
		message: (parent, args, { models }) => {
			const { id } = args;
			return models.Message.findById(id);
		}
	},

	Mutation: {
		createMessage: combineResolvers(isAuthenticated, (parent, args, { models, me }) => {
			const { text } = args;
			return models.Message.create({
				text,
				userId: me.id
			});
		}),

		deleteMessage: combineResolvers(isAuthenticated, isMessageOwner, (parent, args, { models }) => {
			const { id } = args;
			return models.Message.destroy({ where: { id } });
		}),

		updateMessage: (parent, args, { models }) => {
			const { id, text } = args;
			return models.Message.update({ text }, { where: { id } });
		}
	},

	Message: {
		user: (message, args, { models }) => {
			return models.User.findById(message.userId);
		}
	}
};
