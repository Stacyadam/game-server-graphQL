module.exports = (sequelize, DataTypes) => {
	const Message = sequelize.define('message', {
		text: {
			type: DataTypes.STRING,
			validate: {
				notEmpty: {
					args: true,
					msg: 'A message must have a text.'
				}
			}
		}
	});

	Message.associate = models => {
		Message.belongsTo(models.User);
	};

	return Message;
};
