import { Bench } from 'tinybench';
import { parseBold, parseItalic, parseInlineCode } from './handwritten-parser.js';
import { parseChevrotainBold } from './chevrotain-parser.js';
import { parsePeggy } from './peggy-parser.js';

const inputs = [
    '*hello world*',
    '**bold text**',
    '*hello @user and #channel*',
    '*this is a longer bold text with more content inside*',
    '_italic text_',
    '`inline code`',
];

const bench = new Bench({ time: 2000 });

bench
    .add('Hand-written Parser', () => {
        inputs.forEach(input => {
            parseBold(input, 0);
            parseItalic(input, 0);
            parseInlineCode(input, 0);
        });
    })
    .add('Chevrotain Parser', () => {
        inputs.forEach(input => parseChevrotainBold(input));
    })
    .add('PeggyJS Parser', () => {
        inputs.forEach(input => parsePeggy(input));
    });

await bench.run();

console.log('\n=== Parser Benchmark Results ===\n');
console.table(
    bench.tasks.map(task => ({
        Parser: task.name,
        'ops/sec': Math.round(task.result?.hz ?? 0).toLocaleString(),
        'avg (ms)': task.result?.mean.toFixed(6),
        'margin': `±${task.result?.rme.toFixed(2)}%`,
    }))
);