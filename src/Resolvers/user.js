const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');
const { combineResolvers } = require('graphql-resolvers');
const { isUser, isAdmin } = require('./authorization');

const createToken = async (user, secret, expiresIn) => {
	const { id, email, username, role } = user;
	return await jwt.sign({ id, email, username, role }, secret, { expiresIn });
};

module.exports = {
	Query: {
		users: combineResolvers(isAdmin, (parent, args, { models }) => {
			return models.User.findAll();
		}),
		user: combineResolvers(isUser, (parent, args, { models }) => {
			const { id } = args;
			return models.User.findById(id);
		})
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
		}
	},

	User: {
		characters: (user, args, { models }) => {
			return models.Character.findAll({
				where: {
					userId: user.id
				}
			});
		},
		messages: async (user, args, { models }) => {
			return await models.Message.findAll({
				where: {
					userId: user.id
				}
			});
		}
	}
};
