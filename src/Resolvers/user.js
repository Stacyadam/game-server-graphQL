module.exports = {
	Query: {
		users: async (parent, args, { models }) => {
			return await models.User.findAll();
		},
		user: async (parent, args, { models }) => {
			const { id } = args;
			return await models.User.findById(id);
		},
		me: async (parent, args, { models, me }) => {
			return await models.User.findById(me.id);
		}
	},

	User: {
		messages: async (user, args, { models }) => {
			return await models.Message.findAll({
				where: {
					userId: user.id
				}
			});
		}
	}
};
