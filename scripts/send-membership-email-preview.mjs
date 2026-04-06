import { sendMembershipDigestPreviewEmail } from '../api/_lib/membershipEmail.js';

const to = process.argv[2];
const memberName = process.argv[3] || 'friend';

if (!to) {
  console.error('Usage: node scripts/send-membership-email-preview.mjs <email> [member-name]');
  process.exit(1);
}

sendMembershipDigestPreviewEmail({ to, memberName })
  .then((result) => {
    console.log(JSON.stringify(result, null, 2));
  })
  .catch((error) => {
    console.error(error.stack || error.message || error);
    process.exit(1);
  });
