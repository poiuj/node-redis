import { strict as assert } from 'node:assert';
import testUtils, { GLOBAL } from '../../test-utils';
import CDF from './CDF';
import { parseArgs } from '@redis/client/lib/commands/generic-transformers';

describe('TDIGEST.CDF', () => {
  it('transformArguments', () => {
    assert.deepEqual(
      parseArgs(CDF, 'key', [1, 2]),
      ['TDIGEST.CDF', 'key', '1', '2']
    );
  });

  testUtils.testWithClient('client.tDigest.cdf', async client => {
    const [, reply] = await Promise.all([
      client.tDigest.create('key'),
      client.tDigest.cdf('key', [1])
    ]);

    assert.deepEqual(reply, [NaN]);
  }, GLOBAL.SERVERS.OPEN);
});
