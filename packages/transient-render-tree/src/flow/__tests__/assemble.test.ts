import { TBlock } from '../../tree/TBlock';
import { TDocument } from '../../tree/TDocument';
import { asssembleTDocument } from '../assemble';
import { href } from './shared';

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

describe('asssembleTDocument function', () => {
  it('given a HTML document, should return an instance of TDocument which has one TBlock(body) child', () => {
    const tdoc = asssembleTDocument(htmlDocument);
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
  it('should parse context', () => {
    const tdoc = asssembleTDocument(htmlDocument);
    expect(tdoc).toBeInstanceOf(TDocument);
    expect(tdoc.context).toMatchObject({
      charset: 'latin1',
      title: 'Voici un Titre',
      lang: 'fr',
      baseHref: href,
      baseTarget: '_self',
      meta: [
        {
          name: 'keywords',
          value: 'french'
        }
      ],
      links: [
        {
          rel: 'author license',
          href: '/about'
        }
      ]
    });
  });
  it('should handle html snippets', () => {
    const snippet = '<div></div>';
    const tdoc = asssembleTDocument(snippet);
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
