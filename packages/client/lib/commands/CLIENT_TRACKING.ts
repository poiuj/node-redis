import { RedisArgument, SimpleStringReply, Command } from '../RESP/types';
import { RedisVariadicArgument } from './generic-transformers';

interface CommonOptions {
  REDIRECT?: number;
  NOLOOP?: boolean;
}

interface BroadcastOptions {
  BCAST?: boolean;
  PREFIX?: RedisVariadicArgument;
}

interface OptInOptions {
  OPTIN?: boolean;
}

interface OptOutOptions {
  OPTOUT?: boolean;
}

export type ClientTrackingOptions = CommonOptions & (
  BroadcastOptions |
  OptInOptions |
  OptOutOptions
);

export default {
  FIRST_KEY_INDEX: undefined,
  IS_READ_ONLY: true,
  transformArguments<M extends boolean>(
    mode: M,
    options?: M extends true ? ClientTrackingOptions : never
  ) {
    const args: Array<RedisArgument> = [
      'CLIENT',
      'TRACKING',
      mode ? 'ON' : 'OFF'
    ];

    if (mode) {
      if (options?.REDIRECT) {
        args.push(
          'REDIRECT',
          options.REDIRECT.toString()
        );
      }

      if (isBroadcast(options)) {
        args.push('BCAST');

        if (options?.PREFIX) {
          if (Array.isArray(options.PREFIX)) {
            for (const prefix of options.PREFIX) {
              args.push('PREFIX', prefix);
            }
          } else {
            args.push('PREFIX', options.PREFIX);
          }
        }
      } else if (isOptIn(options)) {
        args.push('OPTIN');
      } else if (isOptOut(options)) {
        args.push('OPTOUT');
      }

      if (options?.NOLOOP) {
        args.push('NOLOOP');
      }
    }

    return args;
  },
  transformReply: undefined as unknown as () => SimpleStringReply<'OK'>
} as const satisfies Command;

function isBroadcast(options?: ClientTrackingOptions): options is BroadcastOptions {
  return (options as BroadcastOptions)?.BCAST === true;
}

function isOptIn(options?: ClientTrackingOptions): options is OptInOptions {
  return (options as OptInOptions)?.OPTIN === true;
}

function isOptOut(options?: ClientTrackingOptions): options is OptOutOptions {
  return (options as OptOutOptions)?.OPTOUT === true;
}
