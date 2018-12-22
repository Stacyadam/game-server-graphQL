const jwt = require('jsonwebtoken');
const { combineResolvers } = require('graphql-resolvers');
const { UserInputError } = require('apollo-server');
const { isAdmin } = require('./authorization');

const createToken = async (user, secret, expiresIn) => {
	const { id, email, username, role } = user;
	return await jwt.sign({ id, email, username, role }, secret, { expiresIn });
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
		},

		signIn: async (parent, args, { models, secret }) => {
			const { login, password } = args;

			const user = await models.User.findByLogin(login);
			if (!user) {
				throw new UserInputError('Username or password are incorrect.');
			}

			const isValid = await user.validatePassword(password);
			if (!isValid) {
				throw new UserInputError('Username or password are incorrect.');
			}

			return { token: createToken(user, secret, '30d') };
		},

		deleteUser: combineResolvers(isAdmin, async (parent, args, { models }) => {
			const { id } = args;
			return await models.User.destroy({
				where: { id }
			});
		})
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
