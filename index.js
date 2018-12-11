'use strict';

if(!process.env.DISCORD_TOKEN) {
  throw new Error('Environment variable DISCORD_TOKEN not set');
}

const client = new(require('discord.js').Client)();

import { latest as characters } from './utils/configuration';

import handleCharacters from './commands/characters';
import handleReactions from './commands/reactions';
import handleRoles from './commands/roles';

import parse from './utils/parsing';

const random = (collection) => collection[Math.floor(Math.random() * collection.length)];

client.on('ready', () => {
  console.log('Bot ready.');
});

client.on('message', message => {
  if (message.author.bot) {
    return;
  }

  const character = random(characters.value.findFor(message.member.roles.map(role => role.name), message.content));
  if (character) {
    const response = random(character.repliesFor(message.content));
    message.channel.guild.members.find(m => m.user.id === client.user.id).setNickname(character.name).then(() => message.channel.send(response));
  }

  handleCharacters(message);
  handleReactions(message);
  handleRoles(message);

  if (parse(message).needsDeletion) {
    message.delete();
  }
});

client.on('messageDelete', message => {
  if (message.author.bot) {
    return;
  }

  if (message.author.id === '487275265228013568') {
    message.channel.send(`**Hattie** just "sneakily" attempted to **delete** her message that said:\`\`\`\n${ message.content }\`\`\`\n***SHAME ON YOU, HATTIE!!!*** :rage:`);
  }
});

client.login(process.env.DISCORD_TOKEN);
