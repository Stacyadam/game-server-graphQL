const { combineResolvers } = require('graphql-resolvers');
const { isAuthenticated } = require('./authorization');
const pubsub = require('../subscription');
const { EVENTS } = require('../subscription');

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
		createMessage: combineResolvers(isAuthenticated, async (parent, { text }, { me, models }) => {
			const message = await models.Message.create({
				text,
				userId: me.id
			});

			pubsub.publish('CREATED', {
				messageCreated: { message }
			});
			return message;
		}),

		deleteMessage: async (parent, { id }, { models }) => {
			return await models.Message.destroy({ where: { id } });
		}
	},

	Message: {
		user: async (message, args, { models }) => {
			return await models.User.findById(message.userId);
		}
	},

	Subscription: {
		messageCreated: {
			subscribe: () => pubsub.asyncIterator('CREATED')
		}
	}
};
