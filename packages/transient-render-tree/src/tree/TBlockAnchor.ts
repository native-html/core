import { TBlock, TBlockInit } from './TBlock';

export interface TBlockAnchorInit extends TBlockInit {
  href: string;
}

export class TBlockAnchor extends TBlock {
  public href: string;
  constructor(init: TBlockAnchorInit) {
    super(init);
    this.isAnchor = true;
    this.href = init.href;
  }
}
