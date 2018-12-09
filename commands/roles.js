'use strict';

import parse from '../utils/parsing';

export default function handle(message) {
  const parsed = parse(message);
  const [matched, remove, roleName] = /^!i\s?am(\s?not)?\s+(.+)$/i.exec(parsed) || [];
  if (matched) {
    const role = message.guild.roles.find(role => role.name.toLowerCase() === roleName.trim().toLowerCase());
    if (!role) {
      return message.reply(`Uh-oh! There is no "${ roleName }" role on this channel :sob:\nMaybe Hattie isn't doing her job? :thinking:`);
    }

    if (remove) {
      message.member.removeRole(role)
        .then(() => parsed.isQuiet || message.reply(`Sure! :blush:\nYou are not ${ role.name } anymore.`))
        .catch(() => message.reply(`Uh-oh, looks like I don't have the appropriate permissions :thinking:`));
    } else {
      message.member.addRole(role)
        .then(() => parsed.isQuiet || message.reply(`Sure! :blush:\nYou now are ${ role.name }!`))
        .catch(() => message.reply(`Uh-oh, looks like I don't have the appropriate permissions :thinking:`));
    }
  }
}
