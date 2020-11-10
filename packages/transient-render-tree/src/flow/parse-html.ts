import { DomHandler, Parser, ParserOptions } from 'htmlparser2';
import { DomHandlerOptions, Node } from 'domhandler';

const defaultParserOptions: ParserOptions = {
  decodeEntities: true
};

export async function parseHtml(
  html: string,
  domHandlerOptions?: DomHandlerOptions,
  parserOptions?: ParserOptions
) {
  const options = {
    ...defaultParserOptions,
    ...parserOptions
  };
  return new Promise<Node[]>((resolve) => {
    const parser = new Parser(
      new DomHandler((_error, documentTree) => {
        resolve(documentTree);
      }, domHandlerOptions),
      options
    );
    parser.write(html);
    parser.end();
  });
}
