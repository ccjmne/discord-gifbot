'use strict';

import parse from '../utils/parsing';

const smileys = [':smile:', ':grin:', ':thinking:', ':worried:', ':dizzy_face:']
  .map((e, i, a) => ({ face: e, space: ' '.repeat(a.length - i - 1), prefix: ' '.repeat(i) }));

export default function handle(message) {
  const [matched, supercharged, emoji] = /^!(super)?slap\s*(.*)/i.exec(parse(message)) || [];

  if (matched) {
    const user = message.mentions.users.first() || message.author;
    if (supercharged) {
      const [left, right] = !!emoji.trim() ? (([left, right]) => [left.trim(), right || left.trim()])(emoji.split(/\s+/)) : [':right_facing_fist:', ':left_facing_fist:'];
      return message.channel.send(user + '\n' + smileys.map(s => s.prefix + left + s.space + s.face + s.space + right).join('\n'));
    }

    message.channel.send(user + '\n' + smileys.map(s => s.face + s.space + (emoji.length ? emoji : ':left_facing_fist:')).join('\n'));
  }
}
