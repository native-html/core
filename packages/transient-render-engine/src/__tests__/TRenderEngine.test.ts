import { TBlock } from '../tree/TBlock';
import { TDocument } from '../tree/TDocument';
import { TStyles } from '../styles/TStyles';
import { CSSProcessedProps } from '@native-html/css-processor';
import { TRenderEngine, TRenderEngineOptions } from '../TRenderEngine';
import HTMLContentModel from "../model/HTMLContentModel";

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

const defaultTTreeBuilder = new TRenderEngine();

describe('TRenderEngine > customizeHTMLModels option', () => {
  it('should allow to change a model type to block', () => {
    const specialTTreeBuilder = new TRenderEngine({
      customizeHTMLModels(models) {
        const newModels = {
          ...models,
          em: models.em.extend({ contentModel: HTMLContentModel.block })
        };
        return newModels;
      }
    });
    const ttree = specialTTreeBuilder.buildTTree(
      '<em>This should be a block!</em>'
    );
    expect(ttree.children[0].children[0]).toMatchObject({
      type: 'block',
      tagName: 'em'
    });
  });
});
describe('TRenderEngine > buildTTree method', () => {
  it('should handle special case when baseStyle.fontSize is not a number', () => {
    const specialTTreeBuilder = new TRenderEngine({
      stylesConfig: {
        baseStyle: {
          fontSize: '1em'
        }
      }
    });
    expect(
      specialTTreeBuilder.buildTTree('<span>A</span>').children[0].children[0]
        .styles.nativeTextFlow.fontSize
    ).toBe(undefined);
  });
  it('given a HTML document, should return an instance of TDocument which has one TBlock(body) child', () => {
    const tdoc = defaultTTreeBuilder.buildTTree(htmlDocument);
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
      const tdoc = defaultTTreeBuilder.buildTTree(
        '<!doctype html><html lang="fr"></html>'
      );
      expect(tdoc.context).toMatchObject({ lang: 'fr' });
    });
    it('should register charset', () => {
      const tdoc = defaultTTreeBuilder.buildTTree(
        '<!doctype html><html><head><meta charset="latin1"></meta></head></html>'
      );
      expect(tdoc.context).toMatchObject({ charset: 'latin1' });
    });
    it('should register and trim title', () => {
      const tdoc = defaultTTreeBuilder.buildTTree(
        '<!doctype html><html><head><title> Voici un Titre </title></head></html>'
      );
      expect(tdoc.context).toMatchObject({ title: 'Voici un Titre' });
    });
    it('should ignore empty meta tags', () => {
      const tdoc = defaultTTreeBuilder.buildTTree(
        '<!doctype html><html><head><meta></meta></head></html>'
      );
      expect(tdoc.context).toMatchObject({});
    });
    it('should register base with attributes', () => {
      const tdoc = defaultTTreeBuilder.buildTTree(
        `<!doctype html><html><head><base href="${href}" target="_blank"></base></head></html>`
      );
      expect(tdoc.context).toMatchObject({
        baseHref: href,
        baseTarget: '_blank'
      });
    });
    it('should fallback to defaults when base attributes are missing', () => {
      const tdoc = defaultTTreeBuilder.buildTTree(
        '<!doctype html><html><head><base></base></head></html>'
      );
      expect(tdoc.context).toMatchObject({
        baseHref: 'about:blank',
        baseTarget: '_self'
      });
    });
    it('should register other meta tags attribtues in the meta array', () => {
      const tdoc = defaultTTreeBuilder.buildTTree(
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
      const tdoc = defaultTTreeBuilder.buildTTree(
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
      const tdoc = defaultTTreeBuilder.buildTTree(
        '<!doctype html><html><head><span>This tag should be ignored</span></head></html>'
      );
      expect(tdoc.context).toMatchObject({});
    });
  });
  it('should handle html snippets', () => {
    const snippet = '<div></div>';
    const tdoc = defaultTTreeBuilder.buildTTree(snippet);
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
  describe('should have its children inherit from UA styles when enableUserAgentStyles is enabled', () => {
    const config: TRenderEngineOptions = {
      stylesConfig: {
        enableUserAgentStyles: true
      }
    };
    const customTTreeBuilder = new TRenderEngine(config);
    it('should work with em tags', () => {
      const tdoc = customTTreeBuilder.buildTTree(
        '<em>This should be italic</em>'
      );
      expect(tdoc.children[0].children[0].children[0]).toMatchObject({
        type: 'text',
        styles: {
          nativeTextFlow: {
            fontStyle: 'italic'
          }
        }
      });
    });
    it('should work with ol tags', () => {
      const tdoc = customTTreeBuilder.buildTTree('<ol><li>Sneaky</li></ol>');
      const tol = tdoc.children[0].children[0];
      expect(tol).toMatchObject({
        type: 'block',
        tagName: 'ol'
      });
      expect(tol.styles.webTextFlow.listStyleType).toBe('decimal');
    });
  });
  describe('should have its children inherit from baseStyles', () => {
    const baseStyles = new TStyles(
      new CSSProcessedProps().withProperty('fontSize', 12, {
        compatCategory: 'native',
        displayCategory: 'text',
        propagationCategory: 'flow'
      })
    );
    const expectedObject = {
      type: 'block',
      tagName: 'div',
      children: [
        {
          type: 'phrasing',
          styles: baseStyles,
          children: [
            {
              type: 'text',
              data: 'This text should inherit baseStyles'
            }
          ]
        }
      ]
    };
    const config = {
      stylesConfig: {
        baseStyle: {
          fontSize: 12
        }
      }
    };
    const customTTreeBuilder = new TRenderEngine(config);
    it('when provided a full html page markup', () => {
      const tdoc = customTTreeBuilder.buildTTree(
        '<!doctype html><html><head></head><body><div>This text should inherit baseStyles</div></body></html>'
      );
      expect(tdoc.children[0].children[0]).toMatchObject(expectedObject);
    });
    it('when provided a html snippet', () => {
      const tdoc = customTTreeBuilder.buildTTree(
        '<div>This text should inherit baseStyles</div>'
      );
      expect(tdoc.children[0].children[0]).toMatchObject(expectedObject);
    });
  });
});
