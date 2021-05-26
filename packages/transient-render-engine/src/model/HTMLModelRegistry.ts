import internalHTMLElementModels, {
  DefaultHTMLElementModelsStatic
} from './defaultHTMLElementModels';
import HTMLElementModel from './HTMLElementModel';
import { HTMLModelRecord, TagName } from './model-types';

export default class HTMLModelRegistry<E extends string> {
  public readonly modelRecords: HTMLModelRecord<E | TagName> =
    internalHTMLElementModels as HTMLModelRecord<any>;

  constructor(
    customize?: (
      defaultHTMLElementModels: DefaultHTMLElementModelsStatic
    ) => HTMLModelRecord<E | TagName>
  ) {
    if (typeof customize === 'function') {
      this.modelRecords = customize(internalHTMLElementModels);
    }
  }

  getElementModelFromTagName(
    tagName: E | TagName
  ): HTMLElementModel<string, any> | null {
    if (tagName in this.modelRecords) {
      return this.modelRecords[tagName];
    }
    return null;
  }
}
