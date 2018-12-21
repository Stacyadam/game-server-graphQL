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
		createMessage: (parent, args, { models, me }) => {
			const { text } = args;
			return models.Message.create({
				text,
				userId: me.id
			});
		},

		deleteMessage: (parent, args, { models }) => {
			const { id } = args;
			return models.Message.destroy({ where: { id } });
		},

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
