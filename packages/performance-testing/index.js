const Benchmark = require('benchmark');
const assert = require('assert');
const { TRenderEngine } = require('@native-html/transient-render-engine');
const { rnImageDoc } = require('./html-sources');

let results = [];

function makeBenchmark(name, options, target) {
  const translateOnlyTRE = new TRenderEngine(options);

  var suite = new Benchmark.Suite('TRenderEngine#buildTTree');

  function assertExecLessThan(value) {
    const fixedVal = value.toFixed(2);
    const fixedTarget = target.toFixed(2);
    if (value > target) {
      console.error(
        `[${name}] Should have executed in less than ${fixedTarget}ms (${fixedVal}ms)`
      );
    } else {
      console.info(
        `[${name}] Executed in less than ${fixedTarget}ms (${fixedVal}ms)`
      );
    }
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
        assertExecLessThan(meanMs);
        const ret = { meanMs, varMs, passed: meanMs < target };
        results.push(ret);
        res(ret);
      })
      // run tests async
      .run({ async: true });
  });
}

async function run() {
  const translateTarget = 40;
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
    translateMeanMs * 2.5
  );
  await makeBenchmark(
    'translate + hoisting + collapsing',
    {
      dangerouslyDisableHoisting: false,
      dangerouslyDisableWhitespaceCollapsing: false
    },
    translateMeanMs * 3
  );
  if (!results.every((r) => r.passed)) {
    console.error('Some tests failed');
    process.exit(1);
  }
}

return run();
