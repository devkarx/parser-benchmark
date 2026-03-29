import MessageParser from '@rocket.chat/message-parser';

export function parsePeggy(input: string) {
    return MessageParser.parse(input);
}