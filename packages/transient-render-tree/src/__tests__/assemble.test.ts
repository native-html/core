import { TBlock } from '../tree/TBlock';
import { TDocument } from '../tree/TDocument';
import { assembleTTree } from '../assemble';
const href = 'https://domain.com';
const htmlDocument = `
<!doctype html>
<html lang="fr">
<head>
  <title> Voici un Titre </title>
  <meta charset="latin1"></meta>
  <base href="${href}" target="_self"></base>
  <meta name="keywords" value="french"></meta>
  <link rel="author license" href="/about"></link>
</head>
<body>
  <span>Hello world!</span>
</body>
`;

describe('asssembleTTree function', () => {
  it('given a HTML document, should return an instance of TDocument which has one TBlock(body) child', () => {
    const tdoc = assembleTTree(htmlDocument);
    expect(tdoc).toBeInstanceOf(TDocument);
    expect(tdoc.children).toHaveLength(1);
    expect(tdoc.children[0]).toBeInstanceOf(TBlock);
    expect(tdoc.children[0]).toMatchObject({
      type: 'block',
      tagName: 'body',
      children: [
        {
          type: 'phrasing',
          tagName: null,
          children: [
            {
              type: 'text',
              tagName: 'span',
              data: 'Hello world!'
            }
          ]
        }
      ]
    });
  });
  describe('regarding context parsing', () => {
    it('should register html lang attrib', () => {
      const tdoc = assembleTTree('<!doctype html><html lang="fr"></html>');
      expect(tdoc.context).toMatchObject({ lang: 'fr' });
    });
    it('should register charset', () => {
      const tdoc = assembleTTree(
        '<!doctype html><html><head><meta charset="latin1"></meta></head></html>'
      );
      expect(tdoc.context).toMatchObject({ charset: 'latin1' });
    });
    it('should register and trim title', () => {
      const tdoc = assembleTTree(
        '<!doctype html><html><head><title> Voici un Titre </title></head></html>'
      );
      expect(tdoc.context).toMatchObject({ title: 'Voici un Titre' });
    });
    it('should ignore empty meta tags', () => {
      const tdoc = assembleTTree(
        '<!doctype html><html><head><meta></meta></head></html>'
      );
      expect(tdoc.context).toMatchObject({});
    });
    it('should register base with attributes', () => {
      const tdoc = assembleTTree(
        `<!doctype html><html><head><base href="${href}" target="_blank"></base></head></html>`
      );
      expect(tdoc.context).toMatchObject({
        baseHref: href,
        baseTarget: '_blank'
      });
    });
    it('should fallback to defaults when base attributes are missing', () => {
      const tdoc = assembleTTree(
        '<!doctype html><html><head><base></base></head></html>'
      );
      expect(tdoc.context).toMatchObject({
        baseHref: 'about:blank',
        baseTarget: '_self'
      });
    });
    it('should register other meta tags attribtues in the meta array', () => {
      const tdoc = assembleTTree(
        '<!doctype html><html><head><meta name="keywords" value="birds"></meta></head></html>'
      );
      expect(tdoc.context).toMatchObject({
        meta: [
          {
            name: 'keywords',
            value: 'birds'
          }
        ]
      });
    });
    it('should register link tags attributes in the link array', () => {
      const tdoc = assembleTTree(
        '<!doctype html><html><head><link rel="author license" href="/about"></link></head></html>'
      );
      expect(tdoc.context).toMatchObject({
        links: [
          {
            rel: 'author license',
            href: '/about'
          }
        ]
      });
    });
    it('it should ignore irrelevant tags', () => {
      const tdoc = assembleTTree(
        '<!doctype html><html><head><span>This tag should be ignored</span></head></html>'
      );
      expect(tdoc.context).toMatchObject({});
    });
  });
  it('should handle html snippets', () => {
    const snippet = '<div></div>';
    const tdoc = assembleTTree(snippet);
    expect(tdoc).toBeInstanceOf(TDocument);
    expect(tdoc).toMatchObject({
      type: 'document',
      tagName: 'html',
      children: [
        {
          type: 'block',
          tagName: 'body',
          children: [
            {
              type: 'block',
              tagName: 'div',
              children: []
            }
          ]
        }
      ]
    });
  });
});
