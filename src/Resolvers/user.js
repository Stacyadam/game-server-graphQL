module.exports = {
	Query: {
		users: (parent, args, { users }) => {
			return Object.values(users);
		},
		user: (parent, args, { users }) => {
			const { id } = args;
			return users[id];
		},
		me: (parent, args, { me }) => {
			return me;
		}
	},

	User: {
		messages: (user, args, { messages }) => {
			return Object.values(messages).filter(message => message.userId === user.id);
		}
	}
};
