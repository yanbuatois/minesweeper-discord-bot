const {CommandClient} = require('discord-js-command-client'); 
const config = require('./config');
const {testNumberMine} = require('./numbers');

const client = new CommandClient('!');
const minesweeper = require('minesweeper');
client.enableHelp = false;

client.registerCommand('minesweeper', async (message, commandName, args) => {
  try {
    const argcommande = args.map(elt => parseInt(elt));
    const valide = argcommande.every(valeur => valeur === undefined || !isNaN(valeur));
    if(!valide) {
      await message.reply('Your parameters must be numbers.');
      return;
    }
    const rows = argcommande[0] || 10;
    const cols = argcommande[1] || 10;
    const mines = argcommande[2] || 15;
    if(rows > 99 || rows <= 0)  {
      await message.reply('Rows number is too high or too low. Please type 1 to 99.');
      return;
    }
    if(cols > 99 || cols <= 0) {
      await message.reply('Columns number is too high or too low. Please type 1 to 99.');
      return;
    }
    if(mines <= 0 || mines > (cols*rows)) {
      await message.reply(`Mine number is too high or too low. Please type 1 to the cases amount (here ${cols*rows}).`);
    }
    const mineArray = minesweeper.generateMineArray({
      rows,
      cols,
      mines,
    });
    const board = new minesweeper.Board(mineArray);
    const grid = board.grid();
    const chars = grid.map(elt => elt.map(casemine => '||:' + testNumberMine(casemine) + ':||'));
    const lignes = chars.map(elt => elt.join(''));
    
    let taille = 0;
    let envoi = '';
    const messages = [];
    for(const ligne of lignes) {
      const ajout = ligne + '\n';
      taille += ajout.length;
      if(taille < 1500) {
        envoi += ajout;
      }
      else {
        messages.push(envoi);
        taille = ajout.length;
        envoi = ajout;
      }
    }
    if(envoi.length > 0) {
      messages.push(envoi);
    }

    for(const post of messages) {
      await message.channel.send(post);
    }
  }
  catch(error) {
    console.error(error);
    message.reply('An error occured : ' + error.message)
      .catch(() => {
       console.log("Message non-délivré."); 
      });
  }
}, {
  dmAllowed: true,
  usageMessage: '%f [columns] [rows] [mines]',
  minArgs: 0,
  helpMessage: 'Lance une partie de démineur.',
  maxArgs: 3,
});

client.login(config.TOKEN);

client.on('ready', () => {
  console.log('ready !');
});