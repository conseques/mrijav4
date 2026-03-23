import React from 'react';
import { useTranslation } from 'react-i18next';
import { HeartPulse, Droplets, Home, Truck, MapPin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ReportModal.module.css';

const ReportModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation('report');

  if (!isOpen) return null;

  const allocations = [
    {
      id: 1,
      project: "Slava Ukraini!",
      category: t('medicalAidTitle'),
      icon: <HeartPulse size={18} className={styles.iconRed} />,
      date: "Oct 24, 2023",
      amount: "13,450.00"
    },
    {
      id: 2,
      project: "Ukrainian Freedom Convoys",
      category: t('educationTitle'),
      icon: <Truck size={18} className={styles.iconBlue} />,
      date: "Oct 22, 2023",
      amount: "10,000.00"
    },
    {
      id: 3,
      project: "Hospitallers",
      category: t('medicalAidTitle'),
      icon: <HeartPulse size={18} className={styles.iconRed} />,
      date: "Oct 20, 2023",
      amount: "6,000.00"
    },
    {
      id: 4,
      project: "Mriya Aid",
      category: t('foodTitle'),
      icon: <Droplets size={18} className={styles.iconTeal} />,
      date: "Oct 15, 2023",
      amount: "3,000.00"
    },
    {
      id: 5,
      project: "Local Shelters",
      category: t('housingTitle'),
      icon: <Home size={18} className={styles.iconOrange} />,
      date: "Oct 10, 2023",
      amount: "2,550.00"
    }
  ];

  const animationProps = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: "easeOut" }
  };

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

              {/* Top Metric Cards */}
              <motion.div className={styles.metricsGrid} {...animationProps}>
                <div className={styles.metricCard}>
                  <p className={styles.metricLabel}>{t('totalAmountLabel')}</p>
                  <div className={styles.metricValueRow}>
                    <span className={styles.currency}>NOK</span>
                    <span className={styles.metricValue}>35,000</span>
                    <span className={styles.trendGreen}>+12%</span>
                  </div>
                  <p className={styles.metricSubInfo}>{t('updatedLabel')}</p>
                </div>
                <div className={styles.metricCard}>
                  <p className={styles.metricLabel}>{t('livesImpactedLabel')}</p>
                  <div className={styles.metricValueRow}>
                    <span className={styles.metricValue}>850</span>
                  </div>
                  <div className={styles.progressBarBg}>
                    <div className={styles.progressBarFill} style={{ width: '100%', background: '#0F172A' }}></div>
                  </div>
                </div>
                <div className={styles.metricCard}>
                  <p className={styles.metricLabel}>{t('activeProjectsLabel')}</p>
                  <div className={styles.metricValueRow}>
                    <span className={styles.metricValue}>5</span>
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
                      <span className={styles.distItemTitle}>{t('medicalAidTitle')}</span>
                      <span className={styles.distItemPercent}>60%</span>
                    </div>
                    <p className={styles.distItemDesc}>{t('medicalAidDesc')}</p>
                    <div className={styles.barBg}><div className={styles.barFillBlue} style={{width: '60%'}}></div></div>
                  </div>

                  <div className={styles.distItem}>
                    <div className={styles.distItemHeader}>
                      <span className={styles.distItemTitle}>{t('educationTitle')}</span>
                      <span className={styles.distItemPercent}>25%</span>
                    </div>
                    <p className={styles.distItemDesc}>{t('educationDesc')}</p>
                    <div className={styles.barBg}><div className={styles.barFillBlue} style={{width: '25%'}}></div></div>
                  </div>

                  <div className={styles.distItem}>
                    <div className={styles.distItemHeader}>
                      <span className={styles.distItemTitle}>{t('foodTitle')}</span>
                      <span className={styles.distItemPercent}>10%</span>
                    </div>
                    <p className={styles.distItemDesc}>{t('foodDesc')}</p>
                    <div className={styles.barBg}><div className={styles.barFillBlue} style={{width: '10%'}}></div></div>
                  </div>

                  <div className={styles.distItem}>
                    <div className={styles.distItemHeader}>
                      <span className={styles.distItemTitle}>{t('housingTitle')}</span>
                      <span className={styles.distItemPercent}>5%</span>
                    </div>
                    <p className={styles.distItemDesc}>{t('housingDesc')}</p>
                    <div className={styles.barBg}><div className={styles.barFillBlue} style={{width: '5%'}}></div></div>
                  </div>
                </div>

                <div className={styles.distCardRight}>
                  <h3 className={styles.cardHeader}>{t('impactByRegion')}</h3>
                  <div className={styles.regionList}>
                    <div className={styles.regionItem}>
                      <div className={styles.regionIcon}><MapPin size={16} /></div>
                      <div>
                        <p className={styles.regionName}>{t('kyiv')}</p>
                        <p className={styles.regionAllocated}>16,000 NOK {t('allocated')}</p>
                      </div>
                    </div>
                    <div className={styles.regionItem}>
                      <div className={styles.regionIcon}><MapPin size={16} /></div>
                      <div>
                        <p className={styles.regionName}>{t('kharkiv')}</p>
                        <p className={styles.regionAllocated}>10,000 NOK {t('allocated')}</p>
                      </div>
                    </div>
                    <div className={styles.regionItem}>
                      <div className={styles.regionIcon}><MapPin size={16} /></div>
                      <div>
                        <p className={styles.regionName}>{t('kherson')}</p>
                        <p className={styles.regionAllocated}>6,450 NOK {t('allocated')}</p>
                      </div>
                    </div>
                    <div className={styles.regionItem}>
                      <div className={styles.regionIcon}><MapPin size={16} /></div>
                      <div>
                        <p className={styles.regionName}>{t('odesa')}</p>
                        <p className={styles.regionAllocated}>2,550 NOK {t('allocated')}</p>
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
                      {allocations.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className={styles.projectCell}>
                              <div className={styles.projectIconWrap}>{item.icon}</div>
                              <span className={styles.projectName}>{item.project}</span>
                            </div>
                          </td>
                          <td className={styles.tdSoft}>{item.category}</td>
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
