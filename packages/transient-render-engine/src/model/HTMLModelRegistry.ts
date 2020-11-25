import lookupRecord from '../lookupRecord';
import defaultHTMLModelRecord from './defaultHTMLModelRecord';
import HTMLElementModel from './HTMLElementModel';
import { HTMLModelRecord, TagName } from './model-types';

export default class HTMLModelRegistry<E extends string> {
  private modelRecord: HTMLModelRecord<
    E | TagName
  > = defaultHTMLModelRecord as HTMLModelRecord<any>;

  constructor(
    customize?: (
      defaultModelRecord: HTMLModelRecord
    ) => HTMLModelRecord<E | TagName>
  ) {
    if (typeof customize === 'function') {
      this.modelRecord = customize(defaultHTMLModelRecord);
    }
  }

  getElementModelFromTagName(
    tagName: E | TagName
  ): HTMLElementModel<string, any> | null {
    if (lookupRecord(this.modelRecord, tagName)) {
      return this.modelRecord[tagName];
    }
    return null;
  }
}