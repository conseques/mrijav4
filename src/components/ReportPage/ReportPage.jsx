import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HeartPulse, Droplets, Home, Truck, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './ReportPage.module.css';

const ReportPage = () => {
  const { t } = useTranslation('report');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        
        {/* Hero Section */}
        <div className={styles.heroSection}>
          <div className={styles.badge}>{t('badge')}</div>
          <h1 className={styles.title}>{t('title')}</h1>
          <p className={styles.subtitle}>{t('subtitle')}</p>
        </div>

        {/* Top Metric Cards */}
        <div className={styles.metricsGrid}>
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
        </div>

        {/* Distribution Section */}
        <div className={styles.distributionSection}>
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
        </div>

        {/* Table Section */}
        <div className={styles.tableCard}>
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
        </div>

        {/* Bottom CTA Block */}
        <div className={styles.ctaBlock}>
          <h2 className={styles.ctaTitle}>{t('togetherTitle')}</h2>
          <p className={styles.ctaDesc}>{t('togetherDesc')}</p>
          <div className={styles.ctaButtons}>
            <Link to="/#membership" className={styles.btnWhite}>{t('startMonthly')}</Link>
            <button className={styles.btnOutline}>{t('downloadAudit')}</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReportPage;
