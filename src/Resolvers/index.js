const userResolvers = require('./user');
const characterResolvers = require('./character');
const messageResolvers = require('./message');

module.exports = [userResolvers, characterResolvers, messageResolvers];
