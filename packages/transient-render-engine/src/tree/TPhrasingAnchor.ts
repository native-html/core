import { TPhrasing, TPhrasingInit } from './TPhrasing';

export interface TPhrasingAnchorInit extends TPhrasingInit {
  href: string;
}

export class TPhrasingAnchor extends TPhrasing {
  public href: string;
  public readonly displayName: string = 'TPhrasingAnchor';
  constructor(init: TPhrasingAnchorInit) {
    super(init);
    // @ts-ignore
    this.isAnchor = true;
    this.href = init.href;
  }
}
