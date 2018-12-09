'use strict';

const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRDxHCBoLZP4L-Dffg9CJUBbSb7YNk-ziutHcJc5ZEMs887scVfshbGxCJnyJHFP8V0S49YgbEJ_J0l/pub?output=tsv';
const interval = 1000 * 60 * 10; // 10 minutes

import { RxHR }                   from '@akanass/rx-http-request';
import { timer, BehaviorSubject } from 'rxjs';
import { catchError, map, mergeMap }          from 'rxjs/operators';

class Action {
  constructor(when = [], then = []) {
    this.when = when.map(s => new RegExp(s, 'i'));
    this.then = then;
  }

  static parse(line) {
    const arrow = line.indexOf('->');
    if (!~arrow) {
      throw new Error(`Invalid configuration: ${ line }`);
    }

    return new Action(line.slice(0, arrow), line.slice(arrow + 1));
  }

  toString() {
    return this.when.map(r => r.source).join() + ' -> ' + this.then.toString();
  }
}

class Character {
  constructor(names) {
    this.aka     = names.map(name => name.charAt(0).toUpperCase() + name.slice(1));
    this.name    = this.aka.shift();
    this.names   = names.map(name => new RegExp(`^${ name }$`, 'i'));
    this.actions = [];
  }

  add(action) {
    this.actions.push(action);
  }

  matchesRoles(roles) {
    return roles.map(role => role.toLowerCase()).some(role => this.names.some(name => name.test(role)));
  }

  repliesFor(message) {
    return this.actions.filter(a => a.when.some(when => when.test(message))).reduce((acc, action) => acc.concat(action.then), []);
  }
}

class CharactersCollection {
  constructor(lines) {
    this.characters = [];

    let cur, creation = true;
    lines.forEach(line => {
      if (line.length) {
        if (creation) {
          this.characters.push(cur = new Character(line));
        } else {
          cur.add(Action.parse(line));
        }
      }

      creation = line.length === 0;
    });
  }

  findFor(roles, message) {
    return this.characters.filter(c => c.matchesRoles(roles) && c.repliesFor(message).length);
  }
}

const updates = timer(0, interval).pipe(
  mergeMap(() => RxHR.get(url)),
  map(data => data.body),
  map(contents => contents.split(/\r?\n/).filter(line => !line.startsWith('#')).map(line => line.split(/\t/).filter(x => x))),
  map(lines => new CharactersCollection(lines)),
  catchError(e => console.log(e))
);

const latest = new BehaviorSubject();
updates.subscribe(latest);

export default updates;
export { latest };
