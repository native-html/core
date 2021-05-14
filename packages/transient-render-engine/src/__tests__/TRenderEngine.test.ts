import { findOne } from 'domutils';
import TBlockImpl from '../tree/TBlockCtor';
import TDocumentCtor from '../tree/TDocumentImpl';
import { TRenderEngine, TRenderEngineOptions } from '../TRenderEngine';
import HTMLContentModel from '../model/HTMLContentModel';
import HTMLElementModel from '../model/HTMLElementModel';
import TEmptyCtor from '../tree/TEmptyCtor';
import { rfc002Source } from '../flow/__tests__/shared';

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
    expect(ttree).toMatchSnapshot();
  });
  it('should allow to make an untranslatable element translatable', () => {
    const specialTTreeBuilder = new TRenderEngine({
      customizeHTMLModels(models) {
        const newModels = {
          ...models,
          button: models.button.extend({
            contentModel: HTMLContentModel.block
          })
        };
        return newModels;
      }
    });
    const ttree = specialTTreeBuilder.buildTTree('<button>Hello</button>');
    expect(ttree).toMatchSnapshot();
  });
  it('should allow to register custom block tags', () => {
    const specialTTreeBuilder = new TRenderEngine({
      customizeHTMLModels(models) {
        const newModels = {
          ...models,
          customtag: HTMLElementModel.fromCustomModel({
            contentModel: HTMLContentModel.block,
            tagName: 'customtag'
          })
        };
        return newModels;
      }
    });
    const ttree = specialTTreeBuilder.buildTTree(
      '<customtag>This should be a block!</customtag>'
    );
    expect(ttree).toMatchSnapshot();
  });
  describe('should allow to register custom textual tags', () => {
    const specialTTreeBuilder = new TRenderEngine({
      customizeHTMLModels(models) {
        const newModels = {
          ...models,
          customtag: HTMLElementModel.fromCustomModel({
            contentModel: HTMLContentModel.textual,
            tagName: 'customtag'
          })
        };
        return newModels;
      }
    });
    it('should translate to TText', () => {
      const ttree = specialTTreeBuilder.buildTTree(
        '<customtag>This should be a text!</customtag>'
      );
      expect(ttree).toMatchSnapshot();
    });
    it('should preserve tag when isOpaque is set to true.', () => {
      const ttree = specialTTreeBuilder.buildTTree('<customtag></customtag>');
      expect(ttree).toMatchSnapshot();
    });
  });
  describe('should allow to register custom mixed tags', () => {
    const specialTTreeBuilder = new TRenderEngine({
      customizeHTMLModels(models) {
        const newModels = {
          ...models,
          customtag: HTMLElementModel.fromCustomModel({
            contentModel: HTMLContentModel.mixed,
            tagName: 'customtag'
          })
        };
        return newModels;
      }
    });
    it('should handle mixed tags surrounding blocks like blocks', () => {
      const ttree = specialTTreeBuilder.buildTTree(
        '<customtag><div></div></customtag>'
      );
      expect(ttree).toMatchSnapshot();
    });
    it('should translate mixed tags inside phrasing with text children to TText', () => {
      const ttree = specialTTreeBuilder.buildTTree(
        '<span><customtag>hi!</customtag></span>'
      );
      expect(ttree).toMatchSnapshot();
    });
  });
});
describe('TRenderEngine > buildTTree method', () => {
  it('should handle special case when baseStyle.fontSize is not a number', () => {
    const specialTTreeBuilder = new TRenderEngine({
      dangerouslyDisableHoisting: false,
      stylesConfig: {
        baseStyle: {
          fontSize: '1rem'
        }
      }
    });
    const ttree = specialTTreeBuilder.buildTTree('<span>A</span>');
    expect(ttree).toMatchSnapshot();
  });
  it('should not provide a root fontSize when enableUserAgentStyles is set to false', () => {
    const specialTTreeBuilder = new TRenderEngine({
      stylesConfig: {
        enableUserAgentStyles: false
      }
    });
    const ttree = specialTTreeBuilder.buildTTree('<span>A</span>');
    expect(ttree).toMatchSnapshot();
  });
  it('should still parse inline CSS styles when enableUserAgentStyles is set to false', () => {
    const specialTTreeBuilder = new TRenderEngine({
      stylesConfig: {
        enableUserAgentStyles: false,
        enableCSSInlineProcessing: true
      }
    });
    const tdoc = specialTTreeBuilder.buildTTree(
      '<div style="padding-top: 1px;"/>'
    );
    expect(tdoc).toMatchSnapshot();
  });
  it('should handle the case where the root element is a body element', () => {
    const tdoc = defaultTTreeBuilder.buildTTree('<body><div></div></body>');
    expect(tdoc).toMatchSnapshot();
  });
  it('given a HTML document, should return an instance of TDocument which has one TBlock(body) child', () => {
    const tdoc = defaultTTreeBuilder.buildTTree(htmlDocument);
    expect(tdoc).toBeInstanceOf(TDocumentCtor);
    expect(tdoc.children).toHaveLength(2);
    expect(tdoc.children[0]).toBeInstanceOf(TEmptyCtor);
    expect(tdoc.children[1]).toBeInstanceOf(TBlockImpl);
    expect(tdoc).toMatchSnapshot();
  });
  describe('regarding context parsing', () => {
    it('should register html lang attrib', () => {
      const tdoc = defaultTTreeBuilder.buildTTree(
        '<!doctype html><html lang="fr"></html>'
      );
      expect(tdoc.context).toMatchObject({ lang: 'fr' });
    });
    it('should register html dir attrib', () => {
      const tdoc = defaultTTreeBuilder.buildTTree(
        '<!doctype html><html dir="rtl"></html>'
      );
      expect(tdoc.context).toMatchObject({ dir: 'rtl' });
    });
    it('should register html dir attrib when head is defined', () => {
      const tdoc = defaultTTreeBuilder.buildTTree(
        '<!doctype html><html dir="rtl"><head></head></html>'
      );
      expect(tdoc.context).toMatchObject({ dir: 'rtl' });
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
    expect(tdoc).toBeInstanceOf(TDocumentCtor);
    expect(tdoc).toMatchSnapshot();
  });
  it('should handle html snippets with multiple root nodes', () => {
    const snippet = '<div></div><div></div>';
    const tdoc = defaultTTreeBuilder.buildTTree(snippet);
    expect(tdoc).toBeInstanceOf(TDocumentCtor);
    expect(tdoc).toMatchSnapshot();
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
      expect(tdoc).toMatchSnapshot();
    });
  });
  describe('should retain own baseStyles', () => {
    const config = {
      stylesConfig: {
        baseStyle: {
          marginTop: 10
        }
      }
    };
    const customTTreeBuilder = new TRenderEngine(config);
    it('when provided a html snippet', () => {
      const tdoc = customTTreeBuilder.buildTTree('<div></div>');
      expect(tdoc).toMatchSnapshot();
      expect(tdoc.getNativeStyles().marginTop).toBe(10);
    });
  });
  describe('should have its children inherit from baseStyles', () => {
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
      expect(tdoc).toMatchSnapshot();
    });
    it('when provided a html snippet', () => {
      const tdoc = customTTreeBuilder.buildTTree(
        '<div>This text should inherit baseStyles</div>'
      );
      expect(tdoc).toMatchSnapshot();
    });
  });
  it('should support domVisitors', () => {
    const customTTreeBuilder = new TRenderEngine({
      domVisitors: {
        onText(text) {
          text.data = 'hey';
        }
      }
    });
    const tdoc = customTTreeBuilder.buildTTree(
      '<em>This text should inherit baseStyles</em>'
    );
    expect(tdoc).toMatchSnapshot();
  });
  it('should support ignoredDomTags', () => {
    const customTTreeBuilder = new TRenderEngine({
      ignoredDomTags: ['em']
    });
    const tdoc = customTTreeBuilder.buildTTree('<em></em>');
    expect(tdoc).toMatchSnapshot();
  });
  it('should support ignoreDomNode with text nodes', () => {
    const customTTreeBuilder = new TRenderEngine({
      ignoreDomNode: (node) => node.type === 'text'
    });
    const tdoc = customTTreeBuilder.buildTTree('<em>Text!</em>');
    expect(tdoc).toMatchSnapshot();
  });
  it('should support disabling hoisting', () => {
    const customTTreeBuilder = new TRenderEngine({
      dangerouslyDisableHoisting: true
    });
    expect(customTTreeBuilder.buildTTree(rfc002Source)).toMatchSnapshot();
  });
  it('should support disabling whitespace collapsing', () => {
    const customTTreeBuilder = new TRenderEngine({
      dangerouslyDisableWhitespaceCollapsing: true
    });
    expect(customTTreeBuilder.buildTTree(rfc002Source)).toMatchSnapshot();
  });
  it('should support ignoredTags', () => {
    const customTTreeBuilder = new TRenderEngine({
      ignoredDomTags: ['div']
    });
    const tdoc = customTTreeBuilder.buildTTree(
      '<article><div></div>Text</div></article>'
    );
    expect(tdoc).toMatchSnapshot();
  });
  it('should support selectDomRoot returning a child', () => {
    const customTTreeBuilder = new TRenderEngine({
      selectDomRoot(node) {
        const article = findOne(
          (elem) => elem.tagName === 'article',
          node.children as any,
          true
        );
        return article || node;
      }
    });
    const tdoc = customTTreeBuilder.buildTTree(
      '<div><article>Text</article></div>'
    );
    expect(tdoc).toMatchSnapshot();
  });
  it('should support selectDomRoot returning the passed node', () => {
    const customTTreeBuilder = new TRenderEngine({
      selectDomRoot(node) {
        return node;
      }
    });
    const tdoc = customTTreeBuilder.buildTTree(
      '<div><article>Text</article></div>'
    );
    expect(tdoc).toMatchSnapshot();
  });
  it('should support selectDomRoot returning a falsy value', () => {
    const customTTreeBuilder = new TRenderEngine({
      selectDomRoot() {
        return false;
      }
    });
    const tdoc = customTTreeBuilder.buildTTree(
      '<div><article>Text</article></div>'
    );
    expect(tdoc).toMatchSnapshot();
  });
  it('should support setMarkersForTNode', () => {
    const customTTreeBuilder = new TRenderEngine({
      setMarkersForTNode(targetMarkers) {
        //@ts-expect-error
        targetMarkers.toto = 'hello';
      }
    });
    const tdoc = customTTreeBuilder.buildTTree(
      '<div><article></article></div>'
    );
    //@ts-expect-error
    expect(tdoc.markers.toto).toBe('hello');
  });
  it('should implement getHTMLElementsModels', () => {
    const ttreeBuilder = new TRenderEngine();
    expect(ttreeBuilder.getHTMLElementsModels()).toBeDefined();
  });
});
