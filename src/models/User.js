const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('user', {
		username: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
			validate: {
				notEmpty: {
					args: true,
					msg: 'User must have a username.'
				}
			}
		},
		email: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
			validate: {
				notEmpty: true,
				isEmail: true
			}
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
				len: [7, 42]
			}
		}
	});

	User.associate = models => {
		User.hasMany(models.Character, { onDelete: 'CASCADE' });
	};

	User.beforeCreate(async user => {
		user.password = await user.generatePasswordHash();
	});

	User.prototype.generatePasswordHash = async function() {
		const saltRounds = 10;
		return await bcrypt.hash(this.password, saltRounds);
	};

	User.prototype.validatePassword = async function(password) {
		return await bcrypt.compare(password, this.password);
	};

	User.findByLogin = async login => {
		let user = await User.findOne({
			where: { username: login }
		});

		if (!user) {
			user = await User.findOne({
				where: { email: login }
			});
		}

		return user;
	};

	return User;
};
