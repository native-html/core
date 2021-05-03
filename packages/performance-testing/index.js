const Benchmark = require('benchmark');
const assert = require('assert');
const { TRenderEngine } = require('@native-html/transient-render-engine');
const { rnImageDoc } = require('./html-sources');

const defaultTTreeBuilder = new TRenderEngine();

var suite = new Benchmark.Suite('TRenderEngine#buildTTree');

function assertExecLessThan(target, value) {
  assert.ok(value < target, `Should execute in less than ${target}ms`);
}

suite
  .add('Performance on a 65kb html snippet', () => {
    defaultTTreeBuilder.buildTTree(rnImageDoc);
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
    assertExecLessThan(20, meanMs);
  })
  // run tests async
  .run({ async: true });
