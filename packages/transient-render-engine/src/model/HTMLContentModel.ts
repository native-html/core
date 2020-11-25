enum HTMLContentModel {
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
