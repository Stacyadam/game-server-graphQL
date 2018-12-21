const jwt = require('jsonwebtoken');

const createToken = async (user, secret, expiresIn) => {
	const { id, email, username } = user;
	return await jwt.sign({ id, email, username }, secret, { expiresIn });
};

module.exports = {
	Query: {
		users: (parent, args, { models }) => {
			return models.User.findAll();
		},
		user: (parent, args, { models }) => {
			const { id } = args;
			return models.User.findById(id);
		},
		me: (parent, args, { models, me }) => {
			return models.User.findById(me.id);
		}
	},

	Mutation: {
		signUp: async (parent, args, { models, secret }) => {
			const { username, email, password } = args;

			const user = await models.User.create({
				username,
				email,
				password
			});

			return { token: createToken(user, secret, '30d') };
		}
	},

	User: {
		messages: (user, args, { models }) => {
			return models.Message.findAll({
				where: {
					userId: user.id
				}
			});
		}
	}
};
