import { Bench } from 'tinybench';
import { parseBold, parseItalic, parseInlineCode } from './handwritten-parser.js';
import { parseChevrotainBold } from './chevrotain-parser.js';
import { parsePeggy } from './peggy-parser.js';

const inputs = [
    // 1. The "Happy Path" (Standard Usage)
    '*hello world*',
    '**bold text**',
    '_italic text_',
    '__strong italic__',
    '~strikethrough text~',       
    '~~double strikethrough~~',   
    '`inline code`',
    '@username',
    '#general',

    // 2. Heavy Valid Nesting (Stress testing parseInlineContent)
    '*Hello @aradhy.deokar, please check #gsoc-2026 for updates*',
    '**@user1 and @user2 are in #channel1 and #channel2**',
    '_Let us talk about @ahmed and #development_',
    '~This approach is ~~deprecated~~ but still works for @user~',  
    '**Bold and ~struck through #channel~ works**',                 

    // 3. Code Block Immunity (Testing that mentions/markup are ignored inside code)
    '`npm install @rocket.chat/apps-engine #not-a-channel`',
    '`function test() { return "**not bold**"; }`',
    '`console.log("~no strike here~");`',                           

    // 4. Pathological Backtracking / "Abuse" Cases
    '*this is a very long string that looks like it might be bold but it actually just abruptly ends without a closing asterisk',
    '_same thing here but with underscores, it just keeps going and going and going and going',
    '~a strike that just never ends and causes the parser to read to the very end of this incredibly long line', // Added
    '*****************************hello',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~world',                          
    '**bold** but then *unclosed bold',
    '~~strike~~ but then ~unclosed strike',                        

    // 5. Fake Identifiers & Boundary Testing
    '@user name with spaces', 
    '#channel-with-dashes-that-might-break-loop',
    'email@address.com', 
    '@...', 
    '#1234567890',

    // 6. Mixed Garbage (The "Cat Walked on Keyboard" test)
    '*_*_@#`*_*_@#`*_*_@#`',
    '~*~_~@#`~*~_~@#`~*~_~@#`',                                     
    '*@user _italic?_ no, just plain text*',
    'plain text plain text plain text plain text plain text plain text plain text plain text plain text plain text plain text plain text'
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