export type Plain = { type: 'PLAIN_TEXT'; value: string };
export type Bold = { type: 'BOLD'; value: Array<Plain | UserMention | ChannelMention | Italic | InlineCode> };
export type Italic = { type: 'ITALIC'; value: Array<Plain | UserMention | ChannelMention | Bold | InlineCode> };
export type InlineCode = { type: 'INLINE_CODE'; value: Plain };
export type UserMention = { type: 'MENTION_USER'; value: Plain };
export type ChannelMention = { type: 'MENTION_CHANNEL'; value: Plain };