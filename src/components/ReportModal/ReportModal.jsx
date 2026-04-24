import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, Droplets, MapPin, Plus, ShieldCheck, Users, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { getReportData } from '../../services/reportService';
import { applyConcertImpactDonation } from '../HomePage/DonationImpact/donationImpactTotals.mjs';
import styles from './ReportModal.module.css';

const distributionKeys = [
  {
    value: 'militaryAid',
    titleKey: 'militaryAidTitle',
    descKey: 'militaryAidDesc',
    tone: 'blue',
  },
  {
    value: 'humanitarianAid',
    titleKey: 'humanitarianAidTitle',
    descKey: 'humanitarianAidDesc',
    tone: 'teal',
  },
  {
    value: 'otherOrgsSupport',
    titleKey: 'otherOrgsTitle',
    descKey: 'otherOrgsDesc',
    tone: 'violet',
  },
  {
    value: 'other',
    titleKey: 'otherTitle',
    descKey: 'otherTitleDesc',
    tone: 'amber',
  },
];

const regionWeights = [
  ['kyiv', 0.45],
  ['kharkiv', 0.28],
  ['kherson', 0.18],
  ['odesa', 0.09],
];

const parseReportNumber = (value) => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  if (value == null) {
    return 0;
  }

  const normalized = String(value)
    .trim()
    .replace(/\s/g, '')
    .replace(/[^\d,.-]/g, '');

  if (!normalized) {
    return 0;
  }

  const number = normalized.includes(',') && normalized.includes('.')
    ? Number(normalized.replace(/,/g, ''))
    : Number(normalized.replace(',', '.'));

  return Number.isFinite(number) ? number : 0;
};

const formatNumber = (value) => parseReportNumber(value).toLocaleString();

const lockPageBehindReport = () => {
  const previousHtmlOverflow = document.documentElement.style.overflow;
  const previousBodyOverflow = document.body.style.overflow;

  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';

  return () => {
    document.documentElement.style.overflow = previousHtmlOverflow;
    document.body.style.overflow = previousBodyOverflow;
  };
};

const ReportModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation('report');
  const closeButtonRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    let isActive = true;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onCloseRef.current?.();
      }
    };

    const fetchData = async () => {
      setLoading(true);
      setError(false);

      try {
        const reportData = await getReportData();
        if (isActive) {
          setData(applyConcertImpactDonation(reportData));
        }
      } catch (err) {
        console.error('Error loading report data:', err);
        if (isActive) {
          setError(true);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    const unlockPageBehindReport = lockPageBehindReport();
    document.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();
    fetchData();

    return () => {
      isActive = false;
      document.removeEventListener('keydown', handleKeyDown);
      unlockPageBehindReport();
    };
  }, [isOpen]);

  const percentages = useMemo(() => {
    if (!data?.distribution) return {};

    const total = Object.values(data.distribution).reduce((sum, value) => sum + parseReportNumber(value), 0);
    if (total === 0) {
      return {
        militaryAid: 0,
        humanitarianAid: 0,
        otherOrgsSupport: 0,
        other: 0,
      };
    }

    return distributionKeys.reduce((result, item) => {
      result[item.value] = Math.round((parseReportNumber(data.distribution[item.value]) / total) * 100);
      return result;
    }, {});
  }, [data]);

  const getIcon = (categoryKey) => {
    switch (categoryKey) {
      case 'militaryAidTitle':
        return <ShieldCheck size={18} className={styles.iconRed} />;
      case 'humanitarianAidTitle':
        return <Droplets size={18} className={styles.iconTeal} />;
      case 'otherOrgsTitle':
        return <Users size={18} className={styles.iconBlue} />;
      case 'otherTitle':
        return <Plus size={18} className={styles.iconOrange} />;
      default:
        return <Plus size={18} className={styles.iconOrange} />;
    }
  };

  const updatedText = data?.updatedAt
    ? `${t('updatedLabel').replace('2 ГОДИНИ ТОМУ', '').replace('2 TIMER SIDEN', '').replace('2 HOURS AGO', '').trim()} ${new Date(data.updatedAt).toLocaleDateString()}`
    : t('updatedLabel');
  const displayedTotal = loading && !data ? '...' : formatNumber(data?.totalAmountRaised);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label={t('title')}
          data-lenis-prevent
          data-lenis-prevent-wheel
          data-lenis-prevent-touch
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          <button
            type="button"
            ref={closeButtonRef}
            className={styles.closeBtn}
            onClick={onClose}
            aria-label={t('closeReport', 'Close report')}
          >
            <X size={22} />
          </button>

          <motion.div
            className={styles.shell}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className={styles.hero}>
              <div className={styles.heroCopy}>
                <div className={styles.badge}>{t('badge')}</div>
                <h1 className={styles.title}>{t('title')}</h1>
                <p className={styles.subtitle}>{t('subtitle')}</p>
              </div>

              <div className={styles.heroStat}>
                <span className={styles.statLabel}>{t('totalAmountLabel')}</span>
                <strong>NOK {displayedTotal}</strong>
                <span className={styles.statMeta}>{updatedText}</span>
              </div>
            </header>

            {loading ? (
              <div className={styles.statusBlock}>Loading data...</div>
            ) : error || !data ? (
              <div className={styles.statusBlock}>Could not load report data. Please try again later.</div>
            ) : (
              <>
                <section className={styles.metrics} aria-label={t('title')}>
                  <div className={styles.metric}>
                    <span>{t('livesImpactedLabel')}</span>
                    <strong>{formatNumber(data.livesImpacted)}</strong>
                  </div>
                  <div className={styles.metric}>
                    <span>{t('activeProjectsLabel')}</span>
                    <strong>{formatNumber(data.activeProjects)}</strong>
                    <em>{t('acrossRegions')}</em>
                  </div>
                  <div className={styles.metric}>
                    <span>{t('fundsDistribution')}</span>
                    <strong>{distributionKeys.length}</strong>
                  </div>
                </section>

                <section className={styles.distributionSection}>
                  <div className={styles.sectionIntro}>
                    <h2>{t('fundsDistribution')}</h2>
                    <p>{t('contributionsDesc')}</p>
                  </div>

                  <div className={styles.distributionList}>
                    {distributionKeys.map((item) => (
                      <div className={styles.distItem} key={item.value}>
                        <div className={styles.distHeader}>
                          <div>
                            <span className={styles.distTitle}>{t(item.titleKey)}</span>
                            <p>{t(item.descKey)}</p>
                          </div>
                          <strong>{percentages[item.value] || 0}%</strong>
                        </div>
                        <div className={styles.barBg}>
                          <motion.div
                            className={`${styles.barFill} ${styles[item.tone]}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentages[item.value] || 0}%` }}
                            transition={{ duration: 0.55, ease: 'easeOut' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className={styles.regionSection}>
                  <div className={styles.sectionIntro}>
                    <h2>{t('impactByRegion')}</h2>
                  </div>

                  <div className={styles.regionGrid}>
                    {regionWeights.map(([regionKey, weight]) => (
                      <div className={styles.regionItem} key={regionKey}>
                        <span className={styles.regionIcon}><MapPin size={18} /></span>
                        <div>
                          <strong>{t(regionKey)}</strong>
                          <p>NOK {formatNumber(Math.round(parseReportNumber(data.totalAmountRaised) * weight))} {t('allocated')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className={styles.tableSection}>
                  <div className={styles.tableHeader}>
                    <div>
                      <h2>{t('recentContributions')}</h2>
                      <p>{t('contributionsDesc')}</p>
                    </div>
                  </div>

                  <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>{t('thProject')}</th>
                          <th>{t('thCategory')}</th>
                          <th>{t('thDate')}</th>
                          <th className={styles.textRight}>{t('thAmount')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.recentAllocations?.map((item) => (
                          <tr key={item.id}>
                            <td data-label={t('thProject')}>
                              <div className={styles.projectCell}>
                                <span className={styles.projectIconWrap}>{getIcon(item.categoryKey)}</span>
                                <span className={styles.projectName}>{item.project}</span>
                              </div>
                            </td>
                            <td data-label={t('thCategory')}>{t(item.categoryKey)}</td>
                            <td data-label={t('thDate')}>{item.date}</td>
                            <td data-label={t('thAmount')} className={styles.tdBoldRight}>NOK {formatNumber(item.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className={styles.ctaBlock}>
                  <div>
                    <h2>{t('togetherTitle')}</h2>
                    <p>{t('togetherDesc')}</p>
                  </div>
                  <a
                    href="https://qr.vipps.no/donations/45046?reference=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.primaryAction}
                  >
                    {t('startMonthly')}
                    <ArrowUpRight size={18} />
                  </a>
                </section>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReportModal;
