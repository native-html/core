import { TBlockAnchor } from './TBlockAnchor';
import { TPhrasing, TPhrasingInit } from './TPhrasing';

export interface TPhrasingAnchorInit extends TPhrasingInit {
  href: string;
}

export class TPhrasingAnchor extends TPhrasing implements TPhrasingAnchorInit {
  public href: string;
  constructor(init: TPhrasingAnchorInit) {
    super({
      ...init
    });
    this.isAnchor = true;
    this.href = init.href;
  }

  newEmpty(): TPhrasingAnchor {
    return new TPhrasingAnchor({ href: this.href });
  }

  toBlock() {
    this.trimLeft();
    this.trimRight();
    return new TBlockAnchor(this);
  }
}
