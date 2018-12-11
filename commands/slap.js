'use strict';

import parse from '../utils/parsing';

const len = 5;

export default function handle(message) {
  const parsed = parse(message);
  const [matched, emoji] = /^!slap\s*(.*)/i.exec(parsed) || [];

  if (matched) {
    const actual = emoji.length ? emoji : ':left_facing_fist:';
    const user = message.mentions.users.first() || message.author;
    message.channel.send(user + '\n' + [...Array(len).keys()].map(x => `:slight_smile:${ ' '.repeat(len - x) }${ actual }`).join('\n') + `\n:dizzy_face:${ actual }`);
  }
}
