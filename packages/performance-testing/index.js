const Benchmark = require('benchmark');
const assert = require('assert');
const { TRenderEngine } = require('@native-html/transient-render-engine');
const { rnImageDoc } = require('./html-sources');

function makeBenchmark(name, options, target) {
  const translateOnlyTRE = new TRenderEngine(options);

  var suite = new Benchmark.Suite('TRenderEngine#buildTTree');

  function assertExecLessThan(value) {
    assert.ok(
      value < target,
      `Should execute ${name} in less than ${target}ms`
    );
  }

  return (
    suite
      .add('Performance on a 65kb html snippet', () => {
        translateOnlyTRE.buildTTree(rnImageDoc);
      })
      .on('error', function (e) {
        console.error(e);
        assert.strictEqual(
          e === null,
          true,
          'TRenderEngine.buildTTree taised an error.'
        );
      })
      .on('complete', function (event) {
        const stats = event.target.stats;
        const meanMs = stats.mean * 1000;
        const varMs = stats.variance * 1000;
        console.info('Mean is', meanMs, 'ms');
        console.info('Variance is', varMs, 'ms');
        assertExecLessThan(meanMs);
      })
      // run tests async
      .run({ async: true })
  );
}

async function run() {
  await makeBenchmark(
    'translate only',
    {
      dangerouslyDisableHoisting: true,
      dangerouslyDisableWhitespaceCollapsing: true
    },
    20
  );
}

return run();
