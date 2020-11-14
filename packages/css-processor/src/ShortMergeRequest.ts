import { CSSProperties } from './processor-types';

export class ShortMergeRequest {
  public readonly properties: CSSProperties | null;
  constructor(properties: CSSProperties | null) {
    this.properties = properties;
  }

  forEach(callback: (record: CSSProperties[number]) => void) {
    this.entries().forEach(callback);
  }

  map<T>(callback: (record: CSSProperties[number]) => T) {
    return this.entries().map(callback);
  }

  entries() {
    if (this.properties == null) {
      return [];
    }
    return Object.entries(this.properties);
  }
}
