'use strict';

import { latest as characters } from '../utils/configuration';

const b = s => `**${ s }**`;
export default function handle(message) {
  if (/^!characters/i.test(message.content)) {
    message.channel.send(characters.value.characters.map(c => c.name).join('\n'));
  }
  const [matched, name] = /^!actions\s+(.+)/i.exec(message.content) || [];
  if (matched) {
    const character = characters.value.characters.find(c => c.matchesRoles([name]));
    if (character) {
      message.channel.send({
        embed: {
          color: 3447003,
          title: character.name,
          description: `Also known as ${ character.aka.map(b).join(' or ') }`,
          fields: character.actions.map(a => ({ name: `When reading: ${ a.when.map(w => '`' + w.source+ '`').join(' or ') }`, value: `Respond with:\n${ a.then.map(t => ' - ' + t).join('\n') }` })),
          timestamp: new Date()
        }
      });
    } else {
      message.reply(`Uh-oh, no character responds to the "${ name }" role. :grimacing:`);
    }
  }
}
