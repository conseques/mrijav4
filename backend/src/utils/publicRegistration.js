const { z } = require('zod');

const registrationSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().max(40).optional().default(''),
  eventName: z.string().trim().min(1).max(160),
  type: z.enum(['event', 'membership', 'course']).optional().default('event'),
  source: z.string().trim().max(120).optional().default('website'),
  paymentReference: z.string().trim().max(120).optional().default(''),
  paymentState: z.string().trim().max(80).optional().default('registered')
});

function getRegistrationValidationErrorMessage(issues = []) {
  if (issues.some((issue) => issue.path?.includes('email'))) {
    return 'Please enter a valid email address.';
  }

  if (issues.some((issue) => issue.path?.includes('name'))) {
    return 'Please enter your name before sending the registration.';
  }

  if (issues.some((issue) => issue.path?.includes('eventName'))) {
    return 'We could not determine which event you selected. Please close the form and open it again.';
  }

  return 'We could not save your registration. Please check the form and try again.';
}

function getRegistrationValidationLogDetails(body = {}, issues = [], req = {}) {
  return {
    issueCount: issues.length,
    issues: issues.map((issue) => ({
      path: Array.isArray(issue.path) ? issue.path.join('.') : '',
      code: issue.code || '',
      message: issue.message || '',
    })),
    payloadShape: {
      source: String(body.source || ''),
      type: String(body.type || ''),
      nameLength: String(body.name || '').trim().length,
      emailLength: String(body.email || '').trim().length,
      eventNameLength: String(body.eventName || '').trim().length,
      phoneLength: String(body.phone || '').trim().length,
    },
    requestMeta: {
      origin: req.get ? String(req.get('origin') || '') : '',
      referer: req.get ? String(req.get('referer') || '') : '',
      userAgent: req.get ? String(req.get('user-agent') || '') : '',
    },
  };
}

module.exports = {
  registrationSchema,
  getRegistrationValidationErrorMessage,
  getRegistrationValidationLogDetails,
};
