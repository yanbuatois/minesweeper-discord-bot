const {CommandClient} = require('discord-js-command-client'); 
const config = require('./config');
const {testNumberMine} = require('./numbers');

const client = new CommandClient('!');
const minesweeper = require('minesweeper');
client.enableHelp = false;

/**
 * Permet de répondre à un message en anticipant le problème des permissions.
 * @param {MessageEvent} originalMessage Message auquel répondre.
 * @param {string} messageToReply Message à envoyer
 * @returns {Promise<any>} Promesse correspondant à l'envoi d'une réponse.
 */
function sendMessage(originalMessage, messageToReply) {
  let retour = null;
  if(messageToReply !== '' && (originalMessage.channel.type === 'dm' || originalMessage.channel.type === 'group' || originalMessage.channel.memberPermissions(client.user).has("SEND_MESSAGES"))) {
    retour = originalMessage.channel.send(messageToReply);
  }

  return retour;
}

client.registerCommand('minesweeper', async (message, commandName, args) => {
  try {
    const argcommande = args.map(elt => parseInt(elt));
    const valide = argcommande.every(valeur => valeur === undefined || !isNaN(valeur));
    if(!valide) {
      await sendMessage(message, 'Your parameters must be numbers.');
      return;
    }
    const rows = argcommande[0] || 10;
    const cols = argcommande[1] || 10;
    const mines = argcommande[2] || 15;
    if(rows > config.MAXROWS || rows <= config.MINROWS)  {
      await sendMessage(message, `Rows number is too high or too low. Please type ${config.MINROWS} to ${config.MAXROWS}.`);
      return;
    }
    if(cols > config.MAXCOLS || cols <= config.MINCOLS) {
      await sendMessage(message, `Columns number is too high or too low. Please type a value between ${config.MINCOLS} to ${config.MAXCOLS}.`);
      return;
    }
    if(mines <= 0 || mines > (cols*rows)) {
      await sendMessage(message, `Mine number is too high or too low. Please type a value between 1 to the cases amount (here ${cols*rows}).`);
      return;
    }
    const mineArray = minesweeper.generateMineArray({
      rows,
      cols,
      mines,
    });
    const board = new minesweeper.Board(mineArray);
    const grid = board.grid();
    const chars = grid.map(elt => elt.map(casemine => '||:' + testNumberMine(casemine) + ':|| '));
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
      await sendMessage(message, post);
    }
  }
  catch(error) {
    console.error(error);
    sendMessage(message, 'An error occured : ' + error.message)
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