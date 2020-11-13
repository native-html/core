import { CSSProcessedProps } from '@native-html/css-processor';
import { defaultStylesConfig } from '../defaults';
import { TStyles } from '../TStyles';
import { TStylesMerger } from '../TStylesMerger';

const emptyStyles = new TStyles(new CSSProcessedProps());

describe('TStylesMerger', () => {
  describe('buildStyles method', () => {
    it('should override id styles with inline styles', () => {
      const stylesMerger = new TStylesMerger({
        ...defaultStylesConfig,
        idsStyles: {
          main: {
            color: 'red'
          }
        }
      });
      expect(
        stylesMerger.buildStyles('color: blue', null, {
          className: null,
          id: 'main',
          tagName: 'div',
          attributes: {}
        }).nativeTextFlow.color
      ).toEqual('blue');
    });
    it('should override classes styles with inline styles', () => {
      const stylesMerger = new TStylesMerger({
        ...defaultStylesConfig,
        classesStyles: {
          main: {
            color: 'red'
          }
        }
      });
      expect(
        stylesMerger.buildStyles('color: blue', null, {
          id: null,
          className: 'main',
          tagName: 'div',
          attributes: {}
        }).nativeTextFlow.color
      ).toEqual('blue');
    });
    it('should override tags styles with inline styles', () => {
      const stylesMerger = new TStylesMerger({
        ...defaultStylesConfig,
        tagsStyles: {
          div: {
            color: 'red'
          }
        }
      });
      expect(
        stylesMerger.buildStyles('color: blue', null, {
          id: null,
          className: null,
          tagName: 'div',
          attributes: {}
        }).nativeTextFlow.color
      ).toEqual('blue');
    });
    it('should override tags styles with classes styles', () => {
      const stylesMerger = new TStylesMerger({
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
      });
      expect(
        stylesMerger.buildStyles('', null, {
          id: null,
          className: 'main',
          tagName: 'div',
          attributes: {}
        }).nativeTextFlow.color
      ).toEqual('blue');
    });
    it('should ignore unregistered classes', () => {
      const stylesMerger = new TStylesMerger({
        ...defaultStylesConfig
      });
      const styles = stylesMerger.buildStyles('', null, {
        id: 'main',
        className: 'content',
        tagName: 'div',
        attributes: {}
      });
      expect(styles).toStrictEqual(emptyStyles);
    });
    it('should merge multiple classes', () => {
      const stylesMerger = new TStylesMerger({
        ...defaultStylesConfig,
        classesStyles: {
          content: {
            color: 'blue'
          },
          'content--highlight': {
            backgroundColor: 'yellow'
          }
        }
      });
      const styles = stylesMerger.buildStyles('', null, {
        id: 'main',
        className: 'content content--highlight',
        tagName: 'div',
        attributes: {}
      });
      expect(styles.nativeTextFlow).toMatchObject({
        color: 'blue'
      });
      expect(styles.nativeBlockRet).toStrictEqual({
        backgroundColor: 'yellow'
      });
    });
    it('should override leftmost classes properties with rightmost classes properties', () => {
      const stylesMerger = new TStylesMerger({
        ...defaultStylesConfig,
        classesStyles: {
          content: {
            color: 'blue'
          },
          'content--highlight': {
            color: 'green'
          }
        }
      });
      expect(
        stylesMerger.buildStyles('', null, {
          id: 'main',
          className: 'content content--highlight',
          tagName: 'div',
          attributes: {}
        }).nativeTextFlow
      ).toStrictEqual({
        color: 'green'
      });
    });
    it('should override classes styles with id styles', () => {
      const stylesMerger = new TStylesMerger({
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
      });
      expect(
        stylesMerger.buildStyles('', null, {
          id: 'main',
          className: 'content',
          tagName: 'div',
          attributes: {}
        }).nativeTextFlow
      ).toStrictEqual({
        color: 'red'
      });
    });
    it('should retain parent flowed styles when no override exists', () => {
      const stylesMerger = new TStylesMerger({
        ...defaultStylesConfig
      });
      const parentStyles = new TStyles(stylesMerger.compileCss('color:red;'));
      const styles = stylesMerger.buildStyles('', parentStyles, {
        className: null,
        id: null,
        tagName: null,
        attributes: {}
      });
      expect(styles.nativeTextFlow.color).toStrictEqual('red');
    });
    it('should override parent flowed styles when override exists', () => {
      const stylesMerger = new TStylesMerger({
        ...defaultStylesConfig,
        tagsStyles: {
          div: {
            color: 'blue'
          }
        }
      });
      expect(
        stylesMerger.buildStyles(
          '',
          new TStyles(stylesMerger.compileCss('color:red;')),
          {
            className: null,
            id: null,
            tagName: 'div',
            attributes: {}
          }
        ).nativeTextFlow.color
      ).toStrictEqual('blue');
    });
    describe('with enableUAStyles set to true', () => {
      describe('regarding <blockquote> tags', () => {
        it('should default to UA styles with margins left and right when attribute "type" is unset', () => {
          const stylesMerger = new TStylesMerger({
            ...defaultStylesConfig,
            enableUserAgentStyles: true
          });
          const processedProps = stylesMerger.buildStyles('', null, {
            className: null,
            attributes: {},
            id: null,
            tagName: 'blockquote'
          });
          expect(processedProps.nativeBlockRet).toStrictEqual({
            marginBottom: 16,
            marginTop: 16,
            marginLeft: 40,
            marginRight: 40
          });
        });
        it('should default to UA styles with left border gray when attribute "type" is set to "cite"', () => {
          const stylesMerger = new TStylesMerger({
            ...defaultStylesConfig,
            enableUserAgentStyles: true
          });
          const processedProps = stylesMerger.buildStyles('', null, {
            className: null,
            attributes: {
              type: 'cite'
            },
            id: null,
            tagName: 'blockquote'
          });
          expect(processedProps.nativeBlockRet).toStrictEqual({
            borderLeftWidth: 2,
            borderLeftColor: 'gray',
            marginBottom: 16,
            marginTop: 16,
            marginLeft: 40,
            marginRight: 40
          });
        });
      });
      describe('regarding tags which have no default UA tags', () => {
        it('should default to empty styles', () => {
          const stylesMerger = new TStylesMerger({
            ...defaultStylesConfig,
            enableUserAgentStyles: true
          });
          const processedProps = stylesMerger.buildStyles('', null, {
            className: null,
            attributes: {},
            id: null,
            tagName: 'div'
          });
          expect(processedProps.nativeBlockFlow).toStrictEqual({});
          expect(processedProps.nativeBlockRet).toStrictEqual({});
        });
      });
      describe('regarding <a> tags', () => {
        it('should default to null UA styles when attribute "href" is unset', () => {
          const stylesMerger = new TStylesMerger({
            ...defaultStylesConfig,
            enableUserAgentStyles: true
          });
          const processedProps = stylesMerger.buildStyles('', null, {
            className: null,
            attributes: {},
            id: null,
            tagName: 'a'
          });
          expect(processedProps.nativeTextFlow).toStrictEqual({});
          expect(processedProps.nativeTextRet).toStrictEqual({});
        });
        it('should default to UA styles with color blue and uderlined text when attribute "href" is set', () => {
          const stylesMerger = new TStylesMerger({
            ...defaultStylesConfig,
            enableUserAgentStyles: true
          });
          const processedProps = stylesMerger.buildStyles('', null, {
            className: null,
            attributes: {
              href: ''
            },
            id: null,
            tagName: 'a'
          });
          expect(processedProps.nativeTextFlow).toStrictEqual({
            color: 'blue'
          });
          expect(processedProps.nativeTextRet).toStrictEqual({
            textDecorationLine: 'underline',
            textDecorationColor: 'blue'
          });
        });
        it('should have UA styles when attribute "href" is set overriden by user tag styles', () => {
          const stylesMerger = new TStylesMerger({
            ...defaultStylesConfig,
            enableUserAgentStyles: true,
            tagsStyles: {
              a: {
                color: 'red',
                textDecorationColor: 'red'
              }
            }
          });
          const processedProps = stylesMerger.buildStyles('', null, {
            className: null,
            attributes: {
              href: ''
            },
            id: null,
            tagName: 'a'
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
