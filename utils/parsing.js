'use strict';

const cleanup = message => message.content.replace(/<@\d{18}>/g, '').replace(/\s*(--|—).*$/, '');

export default function parse(message) {
  const options = (/\s*(?:--|—)(.*)$/.exec(message.content) || [null, ''])[1].split(/(\s|--|—)+/).map(s => s.trim());
  return Object.assign(cleanup(message), {
    isQuiet: options.some(s => s === 'quiet'),
    needsDeletion: options.some(s => s === 'delete')
  });
}
