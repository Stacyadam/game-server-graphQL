const { ForbiddenError } = require('apollo-server');
const { combineResolvers, skip } = require('graphql-resolvers');

const isAuthenticated = (parent, args, { me }) => (me ? skip : new ForbiddenError('Not authenticated as user.'));

const isAdmin = combineResolvers(isAuthenticated, (parent, args, { me: { role } }) =>
	role === 'ADMIN' ? skip : new ForbiddenError('Not authorized as admin.')
);

const isMessageOwner = async (parent, args, { models, me }) => {
	const { id } = args;
	const message = await models.Message.findById(id, { raw: true });

	if (message.userId !== me.id) {
		throw new ForbiddenError('Not authenticated as owner.');
	}

	return skip;
};

module.exports = {
	isAuthenticated,
	isAdmin,
	isMessageOwner
};
