import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HeartPulse, Droplets, Users, Plus, MapPin, X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getReportData } from '../../services/reportService';
import styles from './ReportModal.module.css';

const ReportModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation('report');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(false);
      const fetchData = async () => {
        try {
          const reportData = await getReportData();
          setData(reportData);
        } catch (err) {
          console.error("Error loading report data:", err);
          setError(true);
        }
        setLoading(false);
      };
      fetchData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getIcon = (categoryKey) => {
    switch (categoryKey) {
      case 'militaryAidTitle': return <ShieldCheck size={18} className={styles.iconRed} />;
      case 'humanitarianAidTitle': return <Droplets size={18} className={styles.iconTeal} />;
      case 'otherOrgsTitle': return <Users size={18} className={styles.iconBlue} />;
      case 'otherTitle': return <Plus size={18} className={styles.iconOrange} />;
      default: return <Plus size={18} className={styles.iconOrange} />;
    }
  };

  const calculatePercentages = () => {
    if (!data || !data.distribution) return {};
    const total = Object.values(data.distribution).reduce((sum, val) => sum + val, 0);
    if (total === 0) return { militaryAid: 0, humanitarianAid: 0, otherOrgsSupport: 0, other: 0 };
    
    return {
      militaryAid: Math.round((data.distribution.militaryAid / total) * 100),
      humanitarianAid: Math.round((data.distribution.humanitarianAid / total) * 100),
      otherOrgsSupport: Math.round((data.distribution.otherOrgsSupport / total) * 100),
      other: Math.round((data.distribution.other / total) * 100)
    };
  };

  const animationProps = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const percentages = calculatePercentages();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.overlay} onClick={onClose}>
          <motion.div 
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 300 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeBtn} onClick={onClose}>
                <X size={20} />
            </button>

            <div className={styles.contentWrapper}>
              
              {/* Hero Section */}
              <motion.div className={styles.heroSection} {...animationProps}>
                <div className={styles.badge}>{t('badge')}</div>
                <h1 className={styles.title}>{t('title')}</h1>
                <p className={styles.subtitle}>{t('subtitle')}</p>
              </motion.div>

              {loading ? (
                <div style={{padding: '40px', textAlign: 'center', color: 'var(--text-muted)'}}>Loading data...</div>
              ) : error || !data ? (
                <div style={{padding: '40px', textAlign: 'center', color: 'var(--text-muted)'}}>
                  <p style={{fontSize: '32px', marginBottom: '12px'}}>⚠️</p>
                  <p>Could not load report data. Please try again later.</p>
                </div>
              ) : (
                <>
                  {/* Top Metric Cards */}
                  <motion.div className={styles.metricsGrid} {...animationProps}>
                    <div className={styles.metricCard}>
                      <p className={styles.metricLabel}>{t('totalAmountLabel')}</p>
                      <div className={styles.metricValueRow}>
                        <span className={styles.currency}>NOK</span>
                        <span className={styles.metricValue}>{data.totalAmountRaised?.toLocaleString()}</span>
                      </div>
                      <p className={styles.metricSubInfo}>
                        {t('updatedLabel').replace('2 ГОДИНИ ТОМУ', '').replace('2 TIMER SIDEN', '').replace('2 HOURS AGO', '')} 
                        {new Date(data.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={styles.metricCard}>
                      <p className={styles.metricLabel}>{t('livesImpactedLabel')}</p>
                      <div className={styles.metricValueRow}>
                        <span className={styles.metricValue}>{data.livesImpacted}</span>
                      </div>
                      <div className={styles.progressBarBg}>
                        <div className={styles.progressBarFill} style={{ width: '100%', background: '#0F172A' }}></div>
                      </div>
                    </div>
                    <div className={styles.metricCard}>
                      <p className={styles.metricLabel}>{t('activeProjectsLabel')}</p>
                      <div className={styles.metricValueRow}>
                        <span className={styles.metricValue}>{data.activeProjects}</span>
                      </div>
                      <p className={styles.metricSubInfoText}>{t('acrossRegions')}</p>
                    </div>
                  </motion.div>

                  {/* Distribution Section */}
                  <motion.div className={styles.distributionSection} {...animationProps}>
                    <div className={styles.distCardLeft}>
                      <h3 className={styles.cardHeader}>{t('fundsDistribution')}</h3>
                      
                      <div className={styles.distItem}>
                        <div className={styles.distItemHeader}>
                          <span className={styles.distItemTitle}>{t('militaryAidTitle')}</span>
                          <span className={styles.distItemPercent}>{percentages.militaryAid}%</span>
                        </div>
                        <p className={styles.distItemDesc}>{t('militaryAidDesc')}</p>
                        <div className={styles.barBg}><div className={styles.barFillBlue} style={{width: `${percentages.militaryAid}%`}}></div></div>
                      </div>

                      <div className={styles.distItem}>
                        <div className={styles.distItemHeader}>
                          <span className={styles.distItemTitle}>{t('humanitarianAidTitle')}</span>
                          <span className={styles.distItemPercent}>{percentages.humanitarianAid}%</span>
                        </div>
                        <p className={styles.distItemDesc}>{t('humanitarianAidDesc')}</p>
                        <div className={styles.barBg}><div className={styles.barFillBlue} style={{width: `${percentages.humanitarianAid}%`}}></div></div>
                      </div>

                      <div className={styles.distItem}>
                        <div className={styles.distItemHeader}>
                          <span className={styles.distItemTitle}>{t('otherOrgsTitle')}</span>
                          <span className={styles.distItemPercent}>{percentages.otherOrgsSupport}%</span>
                        </div>
                        <p className={styles.distItemDesc}>{t('otherOrgsDesc')}</p>
                        <div className={styles.barBg}><div className={styles.barFillBlue} style={{width: `${percentages.otherOrgsSupport}%`}}></div></div>
                      </div>

                      <div className={styles.distItem}>
                        <div className={styles.distItemHeader}>
                          <span className={styles.distItemTitle}>{t('otherTitle')}</span>
                          <span className={styles.distItemPercent}>{percentages.other}%</span>
                        </div>
                        <p className={styles.distItemDesc}>{t('otherTitleDesc')}</p>
                        <div className={styles.barBg}><div className={styles.barFillBlue} style={{width: `${percentages.other}%`}}></div></div>
                      </div>
                    </div>

                    <div className={styles.distCardRight}>
                      <h3 className={styles.cardHeader}>{t('impactByRegion')}</h3>
                      <div className={styles.regionList}>
                        <div className={styles.regionItem}>
                          <div className={styles.regionIcon}><MapPin size={16} /></div>
                          <div>
                            <p className={styles.regionName}>{t('kyiv')}</p>
                            <p className={styles.regionAllocated}>{(data.totalAmountRaised * 0.45).toLocaleString()} NOK {t('allocated')}</p>
                          </div>
                        </div>
                        <div className={styles.regionItem}>
                          <div className={styles.regionIcon}><MapPin size={16} /></div>
                          <div>
                            <p className={styles.regionName}>{t('kharkiv')}</p>
                            <p className={styles.regionAllocated}>{(data.totalAmountRaised * 0.28).toLocaleString()} NOK {t('allocated')}</p>
                          </div>
                        </div>
                        <div className={styles.regionItem}>
                          <div className={styles.regionIcon}><MapPin size={16} /></div>
                          <div>
                            <p className={styles.regionName}>{t('kherson')}</p>
                            <p className={styles.regionAllocated}>{(data.totalAmountRaised * 0.18).toLocaleString()} NOK {t('allocated')}</p>
                          </div>
                        </div>
                        <div className={styles.regionItem}>
                          <div className={styles.regionIcon}><MapPin size={16} /></div>
                          <div>
                            <p className={styles.regionName}>{t('odesa')}</p>
                            <p className={styles.regionAllocated}>{(data.totalAmountRaised * 0.09).toLocaleString()} NOK {t('allocated')}</p>
                          </div>
                        </div>
                      </div>
                      <div className={styles.mapLinkWrap}>
                        <a href="#" className={styles.mapLink}>{t('viewMap')}</a>
                      </div>
                    </div>
                  </motion.div>

                  {/* Table Section */}
                  <motion.div className={styles.tableCard} {...animationProps}>
                    <div className={styles.tableHeader}>
                      <div>
                        <h3 className={styles.cardHeader}>{t('recentContributions')}</h3>
                        <p className={styles.tableDesc}>{t('contributionsDesc')}</p>
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
                              <td>
                                <div className={styles.projectCell}>
                                  <div className={styles.projectIconWrap}>{getIcon(item.categoryKey)}</div>
                                  <span className={styles.projectName}>{item.project}</span>
                                </div>
                              </td>
                              <td className={styles.tdSoft}>{t(item.categoryKey)}</td>
                              <td className={styles.tdSoft}>{item.date}</td>
                              <td className={styles.tdBoldRight}>NOK {item.amount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className={styles.loadMoreWrap}>
                      <button className={styles.loadMoreBtn}>{t('loadMore')}</button>
                    </div>
                  </motion.div>
                </>
              )}

              {/* Bottom CTA Block */}
              <motion.div className={styles.ctaBlock} {...animationProps}>
                <h2 className={styles.ctaTitle}>{t('togetherTitle')}</h2>
                <p className={styles.ctaDesc}>{t('togetherDesc')}</p>
                <div className={styles.ctaButtons}>
                  <a href="https://qr.vipps.no/donations/45046?reference=1" target="_blank" rel="noopener noreferrer" className={styles.btnWhite}>{t('startMonthly')}</a>
                  <button className={styles.btnOutline}>{t('downloadAudit')}</button>
                </div>
                <p className={styles.ctaCancellation}>{t('cancellationTerms')}</p>
              </motion.div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReportModal;
