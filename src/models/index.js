const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
	host: 'ec2-54-204-46-60.compute-1.amazonaws.com',
	dialect: 'postgres',
	dialectOptions: {
		ssl: true
	}
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

//stacy:Sakboy$%40410@localhost/postgres

postgresql: module.exports = {
	models,
	sequelize
};
