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

  let meanMs = 0;
  let varMs = 0;

  return new Promise((res) => {
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
        meanMs = stats.mean * 1000;
        varMs = stats.variance * 1000;
        console.info(`[${name}]: mean is ${meanMs}ms`);
        console.info(`[${name}]: variance is ${varMs}ms`);
        assertExecLessThan(meanMs);
        res({ meanMs, varMs });
      })
      // run tests async
      .run({ async: true });
  });
}

async function run() {
  const translateTarget = 20;
  const { meanMs: translateMeanMs } = await makeBenchmark(
    'translate only',
    {
      dangerouslyDisableHoisting: true,
      dangerouslyDisableWhitespaceCollapsing: true
    },
    translateTarget
  );
  await makeBenchmark(
    'translate + hoisting',
    {
      dangerouslyDisableHoisting: false,
      dangerouslyDisableWhitespaceCollapsing: true
    },
    translateMeanMs * 2
  );
  await makeBenchmark(
    'translate + collapsing',
    {
      dangerouslyDisableHoisting: true,
      dangerouslyDisableWhitespaceCollapsing: false
    },
    translateMeanMs * 2
  );
}

return run();
