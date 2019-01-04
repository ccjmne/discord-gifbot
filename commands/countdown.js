'use strict';

import parse from '../utils/parsing';

const vacation = new Date('May 11, 2000');
vacation.setFullYear(new Date().getFullYear());

export default function handle(message) {
  const [matched] = /^!(count\s*down|vacation|holidays?)/i.exec(parse(message)) || [];
  if (vacation <= new Date()) {
    vacation.setFullYear(new Date().getFullYear() + 1);
  }

  if (matched) {
    const user = message.mentions.users.first() || message.author;
    message.channel.send(user + `\nOnly ${ Math.floor((vacation - new Date()) / 1000 / 86400) } days 'till it's OUTER BANKS TIME AGAIN !!! :tada:`);
  }
}
