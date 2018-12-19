const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
	dialect: 'postgres'
});

const models = {
	User: sequelize.import('./User'),
	Message: sequelize.import('./Message')
};

Object.keys(models).forEach(key => {
	if ('associate' in models[key]) {
		models[key].associate(models);
	}
});

module.exports = {
	models,
	sequelize
};
