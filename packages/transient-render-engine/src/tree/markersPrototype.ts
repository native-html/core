import { Markers } from './tree-types';

const markersPrototype: Markers = {
  anchor: false,
  edits: 'none',
  lang: 'en',
  olNestLevel: -1,
  ulNestLevel: -1,
  direction: 'ltr',
  extend(this: Markers) {
    return Object.create(this);
  },
  toString() {
    let print = 'Markers {\n';
    for (const key in this) {
      //@ts-ignore
      const val = this[key];
      if (typeof val !== 'function') {
        print += `  ${key}: ${JSON.stringify(val)}\n`;
      }
    }
    return print + '}';
  }
};

export default markersPrototype;
