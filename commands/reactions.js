'use strict';

import parse from '../utils/parsing';

const reactions = {};

export default function handle(message) {
  const parsed = parse(message);
  const [matched, remove, emoji] = /^!react\s*(?:(not)|(.*))/i.exec(parsed) || [];

  if (matched) {
    const user = message.mentions.users.first() || message.author;
    if (remove) {
      if (reactions[user.id]) {
        if (!parsed.isQuiet) { message.reply(`Sure! :blush:\nNo more ${ reactions[user.id] } for ${ user.id === message.author.id ? 'you' : user.username }.`); }
        delete reactions[user.id];
      }
    } else {
      reactions[user.id] = emoji.trim();
      if (!parsed.isQuiet) { message.reply(`Sure! :blush:\n${ user.id === message.author.id ? `You are such a lovely ${ reactions[user.id] }!` : `${ user.username } is a total ${ reactions[user.id] }-face!`}`); }
    }
  }

  if (reactions[message.author.id]) {
    if(!parsed.needsDeletion) {
      message.react(reactions[message.author.id])
        .catch(() => (delete reactions[message.author.id], message.reply(`Uh-oh, I can only react with emojis! :grimacing:`)));
    }
  }
}
