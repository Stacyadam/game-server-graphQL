const uuidv4 = require('uuid/v4');

module.exports = {
	Query: {
		messages: (parent, args, { messages }) => {
			return Object.values(messages);
		},
		message: (parent, args, { messages }) => {
			const { id } = args;
			return messages[id];
		}
	},

	Mutation: {
		createMessage: (parent, args, { me }) => {
			const { text } = args;
			const id = uuidv4();

			const message = {
				id,
				text,
				userId: me.id
			};

			messages[id] = message;
			users[me.id].messageIds.push(id);

			return message;
		},

		deleteMessage: (parent, args, { messages }) => {
			const { id } = args;
			const { [id]: message, ...otherMessages } = messages;

			if (!message) {
				return false;
			}

			messages = otherMessages;

			return true;
		},

		updateMessage: (parent, args, { messages }) => {
			const { id, text } = args;
			const { [id]: message } = messages;

			message.text = text;

			return message;
		}
	},

	Message: {
		user: (message, args, { users }) => {
			return users[message.userId];
		}
	}
};
