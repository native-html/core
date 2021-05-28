/**
 * The **content model** associated with a tag determines how this tag should
 * be translated in the Transient Render Tree.
 */
// eslint-disable-next-line no-shadow
export enum HTMLContentModel {
  /**
   * Translatable to TBlock.
   */
  block = 'block',
  /**
   * Translatable to TPhrasing and TText
   */
  textual = 'textual',
  /**
   * Translatable to TBlock, TPhrasing and TText
   */
  mixed = 'mixed',
  /**
   * Translatable to TEmpty
   */
  none = 'none'
}

export default HTMLContentModel;
