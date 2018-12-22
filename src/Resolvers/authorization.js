const { ForbiddenError } = require('apollo-server');
const { skip } = require('graphql-resolvers');

const isAuthenticated = (parent, args, { me }) => (me ? skip : new ForbiddenError('Not authenticated as user.'));

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

module.exports = {
	isAuthenticated,
	isCharacterOwner
};
