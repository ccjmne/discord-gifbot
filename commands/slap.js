'use strict';

import parse from '../utils/parsing';

const len = 4;

export default function handle(message) {
  const parsed = parse(message);
  const [matched, supercharged, emoji] = /^!(super)?slap\s*(.*)/i.exec(parsed) || [];

  if (matched) {
    const user = message.mentions.users.first() || message.author;
    if (supercharged) {
      const [left, right] = (([left, right]) => [left || ':right_facing_fist:', right || ':left_facing_fist:'])(emoji.split(/\s+/));
      return message.channel.send(user + '\n' + [...Array(len).keys()]
        .map(i => ({ prefix: ' '.repeat(i), infix: ' '.repeat(len - i) }))
        .map(({ prefix, infix }) => `${ prefix }${ left }${ infix }:slight_smile:${ infix }${ right }`).join('\n') +
        `\n${ ' '.repeat(len) }${ left }:dizzy_face:${ right }`);
    }

    const actual = emoji.length ? emoji : ':left_facing_fist:';
    message.channel.send(user + '\n' + [...Array(len).keys()].map(x => `:slight_smile:${ ' '.repeat(len - x) }${ actual }`).join('\n') + `\n:dizzy_face:${ actual }`);
  }
}
