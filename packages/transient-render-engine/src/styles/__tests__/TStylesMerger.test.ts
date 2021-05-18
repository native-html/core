import { CSSProcessedProps } from '@native-html/css-processor';
import HTMLModelRegistry from '../../model/HTMLModelRegistry';
import markersProtype from '../../tree/markersProtype';
import { defaultStylesConfig } from '../defaults';
import { TStyles } from '../TStyles';
import { TStylesMerger } from '../TStylesMerger';

const emptyStyles = new TStyles(new CSSProcessedProps());

const modelRegistry = new HTMLModelRegistry();

describe('TStylesMerger', () => {
  describe('buildStyles method', () => {
    it('should override id styles with inline styles', () => {
      const stylesMerger = new TStylesMerger(
        {
          ...defaultStylesConfig,
          idsStyles: {
            main: {
              color: 'red'
            }
          }
        },
        modelRegistry
      );
      expect(
        stylesMerger.buildStyles('color: blue', null, {
          classes: [],
          id: 'main',
          tagName: 'div',
          attributes: {},
          markers: Object.create(markersProtype)
        }).nativeTextFlow.color
      ).toEqual('blue');
    });
    it('should override classes styles with inline styles', () => {
      const stylesMerger = new TStylesMerger(
        {
          ...defaultStylesConfig,
          classesStyles: {
            main: {
              color: 'red'
            }
          }
        },
        modelRegistry
      );
      expect(
        stylesMerger.buildStyles('color: blue', null, {
          id: null,
          classes: ['main'],
          tagName: 'div',
          attributes: {},
          markers: Object.create(markersProtype)
        }).nativeTextFlow.color
      ).toEqual('blue');
    });
    it('should override tags styles with inline styles', () => {
      const stylesMerger = new TStylesMerger(
        {
          ...defaultStylesConfig,
          tagsStyles: {
            div: {
              color: 'red'
            }
          }
        },
        modelRegistry
      );
      expect(
        stylesMerger.buildStyles('color: blue', null, {
          id: null,
          classes: [],
          tagName: 'div',
          attributes: {},
          markers: Object.create(markersProtype)
        }).nativeTextFlow.color
      ).toEqual('blue');
    });
    it('should override tags styles with classes styles', () => {
      const stylesMerger = new TStylesMerger(
        {
          ...defaultStylesConfig,
          tagsStyles: {
            div: {
              color: 'red'
            }
          },
          classesStyles: {
            main: {
              color: 'blue'
            }
          }
        },
        modelRegistry
      );
      expect(
        stylesMerger.buildStyles('', null, {
          id: null,
          classes: ['main'],
          tagName: 'div',
          attributes: {},
          markers: Object.create(markersProtype)
        }).nativeTextFlow.color
      ).toEqual('blue');
    });
    it('should ignore unregistered classes', () => {
      const stylesMerger = new TStylesMerger(
        {
          ...defaultStylesConfig
        },
        modelRegistry
      );
      const styles = stylesMerger.buildStyles('', null, {
        id: 'main',
        classes: ['content'],
        tagName: 'div',
        attributes: {},
        markers: Object.create(markersProtype)
      });
      expect(styles).toStrictEqual(emptyStyles);
    });
    it('should merge multiple classes', () => {
      const stylesMerger = new TStylesMerger(
        {
          ...defaultStylesConfig,
          classesStyles: {
            content: {
              color: 'blue'
            },
            'content--highlight': {
              backgroundColor: 'yellow'
            }
          }
        },
        modelRegistry
      );
      const styles = stylesMerger.buildStyles('', null, {
        id: 'main',
        classes: ['content', 'content--highlight'],
        tagName: 'div',
        attributes: {},
        markers: Object.create(markersProtype)
      });
      expect(styles.nativeTextFlow).toMatchObject({
        color: 'blue'
      });
      expect(styles.nativeBlockRet).toStrictEqual({
        backgroundColor: 'yellow'
      });
    });
    it('should override leftmost classes properties with rightmost classes properties', () => {
      const stylesMerger = new TStylesMerger(
        {
          ...defaultStylesConfig,
          classesStyles: {
            content: {
              color: 'blue'
            },
            'content--highlight': {
              color: 'green'
            }
          }
        },
        modelRegistry
      );
      expect(
        stylesMerger.buildStyles('', null, {
          id: 'main',
          classes: ['content', 'content--highlight'],
          tagName: 'div',
          attributes: {},
          markers: Object.create(markersProtype)
        }).nativeTextFlow
      ).toStrictEqual({
        color: 'green'
      });
    });
    it('should override classes styles with id styles', () => {
      const stylesMerger = new TStylesMerger(
        {
          ...defaultStylesConfig,
          idsStyles: {
            main: {
              color: 'red'
            }
          },
          classesStyles: {
            content: {
              color: 'blue'
            }
          }
        },
        modelRegistry
      );
      expect(
        stylesMerger.buildStyles('', null, {
          id: 'main',
          classes: ['content'],
          tagName: 'div',
          attributes: {},
          markers: Object.create(markersProtype)
        }).nativeTextFlow
      ).toStrictEqual({
        color: 'red'
      });
    });
    it('should retain parent flowed styles when no override exists', () => {
      const stylesMerger = new TStylesMerger(
        {
          ...defaultStylesConfig
        },
        modelRegistry
      );
      const parentStyles = new TStyles(
        stylesMerger.compileInlineCSS('color:red;')
      );
      const styles = stylesMerger.buildStyles('', parentStyles, {
        classes: [],
        id: null,
        tagName: null,
        attributes: {},
        markers: Object.create(markersProtype)
      });
      expect(styles.nativeTextFlow.color).toStrictEqual('red');
    });
    it('should override parent flowed styles when override exists', () => {
      const stylesMerger = new TStylesMerger(
        {
          ...defaultStylesConfig,
          tagsStyles: {
            div: {
              color: 'blue'
            }
          }
        },
        modelRegistry
      );
      expect(
        stylesMerger.buildStyles(
          '',
          new TStyles(stylesMerger.compileInlineCSS('color:red;')),
          {
            classes: [],
            id: null,
            tagName: 'div',
            attributes: {},
            markers: Object.create(markersProtype)
          }
        ).nativeTextFlow.color
      ).toStrictEqual('blue');
    });
    describe('with enableUAStyles set to true', () => {
      describe('regarding <blockquote> tags', () => {
        it('should default to UA styles with margins left and right when attribute "type" is unset', () => {
          const stylesMerger = new TStylesMerger(
            {
              ...defaultStylesConfig,
              enableUserAgentStyles: true
            },
            modelRegistry
          );
          const processedProps = stylesMerger.buildStyles('', null, {
            classes: [],
            attributes: {},
            id: null,
            tagName: 'blockquote',
            markers: Object.create(markersProtype)
          });
          expect(processedProps.nativeBlockRet).toStrictEqual({
            marginBottom: 16,
            marginTop: 16,
            marginLeft: 30,
            marginRight: 30
          });
        });
        it('should default to UA styles with left border gray when attribute "type" is set to "cite"', () => {
          const stylesMerger = new TStylesMerger(
            {
              ...defaultStylesConfig,
              enableUserAgentStyles: true
            },
            modelRegistry
          );
          const processedProps = stylesMerger.buildStyles('', null, {
            classes: [],
            attributes: {
              type: 'cite'
            },
            id: null,
            tagName: 'blockquote',
            markers: Object.create(markersProtype)
          });
          expect(processedProps.nativeBlockRet).toStrictEqual({
            borderLeftWidth: 2,
            borderLeftColor: '#CCC',
            marginBottom: 16,
            marginTop: 16,
            marginLeft: 30,
            marginRight: 30
          });
        });
      });
      describe('regarding tags which have no default UA tags', () => {
        it('should default to empty styles', () => {
          const stylesMerger = new TStylesMerger(
            {
              ...defaultStylesConfig,
              enableUserAgentStyles: true
            },
            modelRegistry
          );
          const processedProps = stylesMerger.buildStyles('', null, {
            classes: [],
            attributes: {},
            id: null,
            tagName: 'div',
            markers: Object.create(markersProtype)
          });
          expect(processedProps.nativeBlockFlow).toStrictEqual({});
          expect(processedProps.nativeBlockRet).toStrictEqual({});
        });
      });
      it('should override UA styles with inline styles', () => {
        const stylesMerger = new TStylesMerger(
          {
            ...defaultStylesConfig,
            enableUserAgentStyles: true
          },
          modelRegistry
        );
        const processedProps = stylesMerger.buildStyles(
          'margin-top: 0;',
          null,
          {
            classes: [],
            attributes: {},
            id: null,
            tagName: 'p',
            markers: Object.create(markersProtype)
          }
        );
        expect(processedProps.nativeBlockRet.marginTop).toBe(0);
      });
      describe('regarding <a> tags', () => {
        it('should default to null UA styles when attribute "href" is unset', () => {
          const stylesMerger = new TStylesMerger(
            {
              ...defaultStylesConfig,
              enableUserAgentStyles: true
            },
            modelRegistry
          );
          const processedProps = stylesMerger.buildStyles('', null, {
            classes: [],
            attributes: {},
            id: null,
            tagName: 'a',
            markers: Object.create(markersProtype)
          });
          expect(processedProps.nativeTextFlow).toStrictEqual({});
          expect(processedProps.nativeTextRet).toStrictEqual({});
        });
        it('should default to UA styles with color #245dc1 (pale blue) and underlined text when attribute "href" is set', () => {
          const stylesMerger = new TStylesMerger(
            {
              ...defaultStylesConfig,
              enableUserAgentStyles: true
            },
            modelRegistry
          );
          const processedProps = stylesMerger.buildStyles('', null, {
            classes: [],
            attributes: {
              href: ''
            },
            id: null,
            tagName: 'a',
            markers: Object.create(markersProtype)
          });
          expect(processedProps.nativeTextFlow).toStrictEqual({
            color: '#245dc1'
          });
          expect(processedProps.nativeTextRet).toStrictEqual({
            textDecorationLine: 'underline',
            textDecorationColor: '#245dc1'
          });
        });
        it('should have UA styles when attribute "href" is set overridden by user tag styles', () => {
          const stylesMerger = new TStylesMerger(
            {
              ...defaultStylesConfig,
              enableUserAgentStyles: true,
              tagsStyles: {
                a: {
                  color: 'red',
                  textDecorationColor: 'red'
                }
              }
            },
            modelRegistry
          );
          const processedProps = stylesMerger.buildStyles('', null, {
            classes: [],
            attributes: {
              href: ''
            },
            id: null,
            tagName: 'a',
            markers: Object.create(markersProtype)
          });
          expect(processedProps.nativeTextFlow).toStrictEqual({
            color: 'red'
          });
          expect(processedProps.nativeTextRet).toStrictEqual({
            textDecorationLine: 'underline',
            textDecorationColor: 'red'
          });
        });
      });
    });
  });
});
