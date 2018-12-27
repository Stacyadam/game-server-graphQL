const { PubSub } = require('apollo-server');

const MESSAGE_EVENTS = require('./message');

exports.EVENTS = { MESSAGE: MESSAGE_EVENTS };

module.exports = new PubSub();
