const { ForbiddenError } = require('apollo-server');
const { combineResolvers, skip } = require('graphql-resolvers');

const isAuthenticated = (parent, args, { me }) => {
	if (!me) {
		throw new ForbiddenError('Not authenticated as user.');
	}
	return skip;
};

const isAdmin = combineResolvers(isAuthenticated, (parent, args, { me: { role } }) =>
	role === 'ADMIN' ? skip : new ForbiddenError('Not authorized as admin.')
);

const isCharacterOwner = async (parent, args, { models, me }) => {
	const { name } = args;
	const character = await models.Character.find({ where: { name }, raw: true });

	if (!character) {
		throw new Error('Character not found.');
	}

	if (character.userId !== me.id) {
		throw new ForbiddenError('Not authenticated as owner.');
	}

	return skip;
};

const isUser = combineResolvers(isAuthenticated, async (parent, args, { models, me }) => {
	const { id } = args;
	const user = await models.User.findById(id);

	if (!user) {
		throw new Error('User not found.');
	}

	if (user.id !== me.id) {
		throw new ForbiddenError('Not authenticated as User.');
	}

	return skip;
});

module.exports = {
	isAuthenticated,
	isCharacterOwner,
	isAdmin,
	isUser
};
