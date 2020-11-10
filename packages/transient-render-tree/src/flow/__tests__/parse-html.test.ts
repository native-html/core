import { parseHtml } from '../parse-html';

describe('parseHtml function', () => {
  it('should not throw, even when provided with a non-string argument', async () => {
    await expect(parseHtml({} as any)).resolves.toMatchObject([
      {
        type: 'text'
      }
    ]);
  });
});
