module.exports = (sequelize, DataTypes) => {
	const Character = sequelize.define('character', {
		name: {
			type: DataTypes.STRING,
			unique: {
				msg: 'This character name has already been taken.'
			},
			validate: {
				notEmpty: {
					args: true,
					msg: 'A character must have a name.'
				},
				len: {
					args: [5, 25],
					msg: 'Name may be 5 to 25 letters only.'
				}
			}
		},
		race: {
			type: DataTypes.STRING,
			validate: {
				notEmpty: {
					args: true,
					msg: 'A character must have a race.'
				}
			}
		},
		level: {
			type: DataTypes.INTEGER,
			defaultValue: 1
		}
	});

	Character.associate = models => {
		Character.belongsTo(models.User);
	};

	return Character;
};
