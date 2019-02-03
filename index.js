const {CommandClient} = require('discord-js-command-client'); 
const config = require('./config');

const client = new CommandClient('!');



client.login(config.TOKEN);