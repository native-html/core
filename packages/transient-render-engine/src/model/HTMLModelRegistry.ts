import lookupRecord from '../lookupRecord';
import defaultHTMLElementModels, {
  DefaultHTMLElementModels
} from './defaultHTMLElementModels';
import HTMLElementModel from './HTMLElementModel';
import { HTMLModelRecord, TagName } from './model-types';

export default class HTMLModelRegistry<E extends string> {
  private modelRecord: HTMLModelRecord<
    E | TagName
  > = defaultHTMLElementModels as HTMLModelRecord<any>;

  constructor(
    customize?: (
      defaultHTMLElementModels: DefaultHTMLElementModels
    ) => HTMLModelRecord<E | TagName>
  ) {
    if (typeof customize === 'function') {
      this.modelRecord = customize(defaultHTMLElementModels);
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
