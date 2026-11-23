// test/schema-validator.test.js
// Tests response schema fallbacks and topic guardrails.

const test = require('node:test');
const assert = require('node:assert/strict');
const { _testExports } = require('../api/ai.js');
const { isTopicAllowed, safeFallback } = _testExports;

test('isTopicAllowed: permits valid programming and Java topics', () => {
  assert.equal(isTopicAllowed('How do I declare a HashMap in Java?'), true);
  assert.equal(isTopicAllowed('Explain NullPointerException'), true);
  assert.equal(isTopicAllowed('What is a redstone loop in Java terms?'), true);
  assert.equal(isTopicAllowed('System.out.println("Hello");'), true);
  assert.equal(isTopicAllowed('Stream pipeline filter and map'), true);
});

test('isTopicAllowed: declines off-topic prompts without programming keywords', () => {
  assert.equal(isTopicAllowed('Give me a delicious chocolate cake recipe'), false);
  assert.equal(isTopicAllowed('Who won the presidential election?'), false);
  assert.equal(isTopicAllowed('Tell me today horoscope and zodiac sign'), false);
  assert.equal(isTopicAllowed('Write a love poem lyrics'), false);
});

test('safeFallback: returns well-structured fallback JSON for all supported actions', () => {
  const actions = [
    'socratic-hint',
    'explain',
    'live-watch',
    'translate-error',
    'code-review',
    'generate-quiz',
    'eval-project',
    'generate-coding-task'
  ];

  actions.forEach(act => {
    const fallback = safeFallback(act);
    assert.ok(fallback, `Fallback for ${act} must exist`);
    assert.equal(typeof fallback, 'object', `Fallback for ${act} must be an object`);
    assert.equal(fallback.success, false, `Fallback for ${act} should mark success: false`);
    assert.equal(typeof fallback.error, 'string', `Fallback for ${act} must contain an error string`);
    assert.equal(fallback.error.includes(act), true, `Fallback for ${act} must cite the action`);
  });
});
