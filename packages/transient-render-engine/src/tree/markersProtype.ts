import { Markers } from './tree-types';

type MarkersShape = Omit<Markers, 'extends'>;

interface TNodeDescriptor {
  tagName: string | null;
  classes: string[];
  id: string | null;
  attributes: Record<string, string>;
}

const markersProtype: Markers = {
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

export default markersProtype;
