import { TBlockAnchor } from './TBlockAnchor';
import { TPhrasing, TPhrasingInit } from './TPhrasing';

export interface TPhrasingAnchorInit extends TPhrasingInit {
  href: string;
}

export class TPhrasingAnchor extends TPhrasing {
  public href: string;
  constructor(init: TPhrasingAnchorInit) {
    super(init);
    this.isAnchor = true;
    this.href = init.href;
  }

  newEmpty(): TPhrasingAnchor {
    return new TPhrasingAnchor(
      this.cloneInitParams(this.emptyParams({ href: this.href }))
    );
  }

  toBlock() {
    this.trimLeft();
    this.trimRight();
    return new TBlockAnchor(
      this.cloneInitParams<TPhrasingAnchorInit>({ href: this.href })
    );
  }
}
