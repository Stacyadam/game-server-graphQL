module.exports = (sequelize, DataTypes) => {
	const Message = sequelize.define('message', {
		text: {
			type: DataTypes.STRING
		}
	});

	Message.associate = models => {
		Message.belongsTo(models.User);
	};

	return Message;
};
