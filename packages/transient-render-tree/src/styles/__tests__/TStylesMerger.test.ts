import { defaultStylesConfig } from '../defaults';
import { TStyles } from '../TStyles';
import { TStylesMerger } from '../TStylesMerger';

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
          tagName: 'div'
        }).nativeTextFlow
      ).toMatchObject({
        color: 'blue'
      });
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
          tagName: 'div'
        }).nativeTextFlow
      ).toMatchObject({
        color: 'blue'
      });
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
          tagName: 'div'
        }).nativeTextFlow
      ).toMatchObject({
        color: 'blue'
      });
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
          tagName: 'div'
        }).nativeTextFlow
      ).toMatchObject({
        color: 'blue'
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
          tagName: 'div'
        }).nativeTextFlow
      ).toMatchObject({
        color: 'red'
      });
    });
    it('should retain parent flowed styles when no override exists', () => {
      const stylesMerger = new TStylesMerger({
        ...defaultStylesConfig
      });
      expect(
        stylesMerger.buildStyles(
          '',
          new TStyles(stylesMerger.compileCss('color:red;')),
          {
            className: null,
            id: null,
            tagName: null
          }
        ).nativeTextFlow
      ).toMatchObject({
        color: 'red'
      });
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
            tagName: 'div'
          }
        ).nativeTextFlow
      ).toMatchObject({
        color: 'blue'
      });
    });
  });
});
