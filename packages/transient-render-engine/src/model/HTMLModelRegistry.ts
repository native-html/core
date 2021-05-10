import lookupRecord from '../lookupRecord';
import defaultHTMLElementModels, {
  DefaultHTMLElementModels
} from './defaultHTMLElementModels';
import HTMLElementModel from './HTMLElementModel';
import { HTMLModelRecord, TagName } from './model-types';

export default class HTMLModelRegistry<E extends string> {
  public readonly modelRecords: HTMLModelRecord<
    E | TagName
  > = defaultHTMLElementModels as HTMLModelRecord<any>;

  constructor(
    customize?: (
      defaultHTMLElementModels: DefaultHTMLElementModels
    ) => HTMLModelRecord<E | TagName>
  ) {
    if (typeof customize === 'function') {
      this.modelRecords = customize(defaultHTMLElementModels);
    }
  }

  getElementModelFromTagName(
    tagName: E | TagName
  ): HTMLElementModel<string, any> | null {
    if (lookupRecord(this.modelRecords, tagName)) {
      return this.modelRecords[tagName];
    }
    return null;
  }
}
