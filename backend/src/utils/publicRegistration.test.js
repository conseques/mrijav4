const test = require('node:test');
const assert = require('node:assert/strict');

const {
  getRegistrationValidationErrorMessage,
} = require('./publicRegistration');

test('returns an email-specific message when email validation fails', () => {
  const message = getRegistrationValidationErrorMessage([
    { path: ['email'], code: 'invalid_string' },
  ]);

  assert.equal(message, 'Please enter a valid email address.');
});

test('returns an event-specific message when no event name is available', () => {
  const message = getRegistrationValidationErrorMessage([
    { path: ['eventName'], code: 'too_small' },
  ]);

  assert.equal(message, 'We could not determine which event you selected. Please close the form and open it again.');
});

test('falls back to a generic message for unexpected validation issues', () => {
  const message = getRegistrationValidationErrorMessage([
    { path: ['paymentState'], code: 'too_big' },
  ]);

  assert.equal(message, 'We could not save your registration. Please check the form and try again.');
});
