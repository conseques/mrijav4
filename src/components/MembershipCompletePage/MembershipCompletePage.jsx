import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, CircleAlert, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEO from '../SEO/SEO';
import { getMembershipStatus } from '../../services/membershipApi';
import styles from './MembershipCompletePage.module.css';

const SUCCESS_STATES = new Set(['CAPTURED']);
const FAILURE_STATES = new Set(['ABORTED', 'EXPIRED', 'TERMINATED']);
const POLL_INTERVAL_MS = 2500;
const MAX_POLLS = 12;

const MembershipCompletePage = () => {
  const { t } = useTranslation('membership');
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference') || '';

  const [phase, setPhase] = useState(reference ? 'loading' : 'missing');
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!reference) {
      setPhase('missing');
      return undefined;
    }

    let isActive = true;
    let timeoutId = null;
    let attempts = 0;

    const pollStatus = async () => {
      attempts += 1;

      try {
        const result = await getMembershipStatus(reference);

        if (!isActive) {
          return;
        }

        setPayment(result);
        setError('');

        if (result.paymentCaptured || SUCCESS_STATES.has(result.paymentState)) {
          setPhase('success');
          return;
        }

        if (FAILURE_STATES.has(result.paymentState)) {
          setPhase('failed');
          return;
        }

        setPhase('pending');

        if (attempts < MAX_POLLS) {
          timeoutId = window.setTimeout(pollStatus, POLL_INTERVAL_MS);
        }
      } catch (requestError) {
        if (!isActive) {
          return;
        }

        setError(
          requestError.message ||
            t('statusLoadError', 'We could not verify your Vipps payment right now.')
        );
        setPhase('error');
      }
    };

    pollStatus();

    return () => {
      isActive = false;
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [reference, refreshKey, t]);

  const content = useMemo(() => {
    if (phase === 'missing') {
      return {
        title: t('missingReferenceTitle', 'We could not find the payment reference.'),
        description: t(
          'missingReferenceDescription',
          'Please return to the membership section and start the Vipps payment again.'
        ),
        tone: 'warning',
      };
    }

    if (phase === 'success') {
      return {
        title: t('paymentCompleteTitle', 'Membership confirmed'),
        description: t(
          'paymentCompleteDescription',
          'Your Vipps payment is captured and your membership has been registered.'
        ),
        tone: 'success',
      };
    }

    if (phase === 'failed') {
      return {
        title: t('paymentFailedTitle', 'Payment was not completed'),
        description: t(
          'paymentFailedDescription',
          'Vipps reported that the payment was canceled, expired, or otherwise not completed.'
        ),
        tone: 'warning',
      };
    }

    if (phase === 'error') {
      return {
        title: t('paymentErrorTitle', 'We could not verify the payment yet'),
        description:
          error ||
          t(
            'paymentErrorDescription',
            'Please try again in a moment. If the payment has already gone through, it is usually enough to refresh the status.'
          ),
        tone: 'warning',
      };
    }

    return {
      title: t('paymentPendingTitle', 'Checking your Vipps payment'),
      description: t(
        'paymentPendingDescription',
        'We are waiting for Vipps to confirm the payment and finish the membership registration.'
      ),
      tone: 'pending',
    };
  }, [error, phase, t]);

  const memberName = payment?.member?.fullName;
  const memberEmail = payment?.member?.email;
  const memberPhone = payment?.member?.phone;

  return (
    <>
      <SEO
        title={t('paymentPageSeoTitle', 'Membership payment')}
        description={t(
          'paymentPageSeoDescription',
          'Follow the Vipps membership payment and registration status.'
        )}
      />
      <main className={styles.page}>
        <section className={styles.card}>
          <div className={styles.iconWrap} data-tone={content.tone}>
            {content.tone === 'success' ? (
              <CheckCircle2 size={28} />
            ) : content.tone === 'pending' ? (
              <Loader2 size={28} className={styles.spinner} />
            ) : (
              <CircleAlert size={28} />
            )}
          </div>

          <p className={styles.eyebrow}>{t('paymentEyebrow', 'Membership payment')}</p>
          <h1 className={styles.title}>{content.title}</h1>
          <p className={styles.description}>{content.description}</p>

          <div className={styles.details}>
            <div className={styles.detailRow}>
              <span>{t('paymentReferenceLabel', 'Reference')}</span>
              <strong>{reference || t('notAvailable', 'N/A')}</strong>
            </div>
            <div className={styles.detailRow}>
              <span>{t('paymentStatusLabel', 'Status')}</span>
              <strong>{payment?.paymentState || t('processingStatus', 'Processing')}</strong>
            </div>
            {memberName ? (
              <div className={styles.detailRow}>
                <span>{t('memberNameLabel', 'Name')}</span>
                <strong>{memberName}</strong>
              </div>
            ) : null}
            {memberEmail ? (
              <div className={styles.detailRow}>
                <span>{t('memberEmailLabel', 'Email')}</span>
                <strong>{memberEmail}</strong>
              </div>
            ) : null}
            {memberPhone ? (
              <div className={styles.detailRow}>
                <span>{t('memberPhoneLabel', 'Phone')}</span>
                <strong>{memberPhone}</strong>
              </div>
            ) : null}
          </div>

          {phase === 'success' && payment?.storageError ? (
            <p className={styles.warning}>
              {t(
                'storageWarning',
                'The payment is confirmed, but automatic saving to the registration list needs one more setup step.'
              )}{' '}
              {payment.storageError}
            </p>
          ) : null}

          <div className={styles.actions}>
            <Link to="/#membership" className={styles.primaryAction}>
              {t('backToMembership', 'Back to membership')}
            </Link>
            {(phase === 'pending' || phase === 'error') && reference ? (
              <button
                type="button"
                className={styles.secondaryAction}
                onClick={() => setRefreshKey((value) => value + 1)}
              >
                {t('refreshStatus', 'Refresh status')}
              </button>
            ) : (
              <Link to="/" className={styles.secondaryAction}>
                {t('goHome', 'Go to homepage')}
              </Link>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default MembershipCompletePage;
