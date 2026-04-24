import test from 'node:test';
import assert from 'node:assert/strict';

import {
  REGISTRATION_SUCCESS_OPEN_DELAY_MS,
  transitionRegistrationSuccess,
} from './registrationSuccessFlow.mjs';

test('opens the success modal only after the registration modal starts closing', () => {
  const calls = [];
  let scheduledCallback = null;
  let scheduledDelay = null;

  const timerId = transitionRegistrationSuccess({
    form: {
      reset() {
        calls.push('reset');
      },
    },
    closeRegistration() {
      calls.push('close');
    },
    openSuccess() {
      calls.push('open');
    },
    schedule(callback, delay) {
      calls.push('schedule');
      scheduledCallback = callback;
      scheduledDelay = delay;
      return 'timer-1';
    },
  });

  assert.equal(timerId, 'timer-1');
  assert.equal(scheduledDelay, REGISTRATION_SUCCESS_OPEN_DELAY_MS);
  assert.deepEqual(calls, ['reset', 'close', 'schedule']);

  scheduledCallback();

  assert.deepEqual(calls, ['reset', 'close', 'schedule', 'open']);
});
