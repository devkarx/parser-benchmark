import { CstParser, createToken, Lexer } from 'chevrotain';

const Asterisk = createToken({ name: 'Asterisk', pattern: /\*/ });
const Text = createToken({ name: 'Text', pattern: /[^*]+/ });

const allTokens = [Asterisk, Text];
const BoldLexer = new Lexer(allTokens);

class BoldParser extends CstParser {
    constructor() {
        super(allTokens);
        this.performSelfAnalysis();
    }

    bold = this.RULE('bold', () => {
        this.CONSUME(Asterisk);
        this.CONSUME(Text);
        this.CONSUME2(Asterisk);
    });
}

const parser = new BoldParser();

export function parseChevrotainBold(input: string) {
    const lexResult = BoldLexer.tokenize(input);
    parser.input = lexResult.tokens;
    return parser.bold();
}