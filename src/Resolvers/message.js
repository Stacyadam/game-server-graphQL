module.exports = {
	Query: {
		messages: async (parent, args, { models }) => {
			return await models.Message.findAll();
		},
		message: async (parent, args, { models }) => {
			const { id } = args;
			return await models.Message.findById(id);
		}
	},

	Mutation: {
		createMessage: async (parent, args, { models, me }) => {
			const { text } = args;
			return await models.Message.create({
				text,
				userId: me.id
			});
		},

		deleteMessage: async (parent, args, { models }) => {
			const { id } = args;
			return await models.Message.destroy({ where: { id } });
		},

		updateMessage: async (parent, args, { models }) => {
			const { id, text } = args;
			return await models.Message.update({ text }, { where: { id } });
		}
	},

	Message: {
		user: async (message, args, { models }) => {
			return await models.User.findById(message.userId);
		}
	}
};
