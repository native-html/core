import { DomHandler, Parser, ParserOptions } from 'htmlparser2';
import { Node } from 'domhandler';

const defaultParserOptions: ParserOptions = {
  decodeEntities: true
};

export async function parseHtml(html: string, parserOptions?: ParserOptions) {
  const options = {
    ...defaultParserOptions,
    ...parserOptions
  };
  return new Promise<Node[]>((resolve, reject) => {
    const parser = new Parser(
      new DomHandler((error, documentTree) => {
        if (error) {
          reject(error);
        } else {
          resolve(documentTree);
        }
      }),
      options
    );
    parser.write(html);
    parser.end();
  });
}
