import { RedisArgument, NumberReply, Command } from '../RESP/types';

export default {
  FIRST_KEY_INDEX: 1,
  transformArguments(key: RedisArgument, increment: number) {
    return ['INCRBY', key, increment.toString()];
  },
  transformReply: undefined as unknown as () => NumberReply
} as const satisfies Command;
