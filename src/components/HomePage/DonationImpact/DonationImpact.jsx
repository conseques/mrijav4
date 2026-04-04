import React, { useState, useEffect } from 'react';
import { ShieldCheck, Truck, Users, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getReportData } from '../../../services/reportService';
import styles from './DonationImpact.module.css';
import ReportModal from '../../ReportModal/ReportModal';

import { motion } from 'framer-motion';

const DonationImpact = () => {
  const { t } = useTranslation('donationImpact');
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportData, setReportData] = useState({
    totalAmountRaised: 35000,
    goalAmount: 150000
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getReportData();
        setReportData({
          totalAmountRaised: data.totalAmountRaised,
          goalAmount: data.goalAmount
        });
      } catch (err) {
        console.error("Error fetching donation impact data:", err);
      }
    };
    fetchData();
  }, []);

  const raisedAmount = reportData.totalAmountRaised;
  const goalAmount = reportData.goalAmount;
  const progressPercent = Math.min(Math.round((raisedAmount / goalAmount) * 100), 100);
  const remainingAmount = Math.max(goalAmount - raisedAmount, 0);

  const donationCards = [
    {
      id: 1,
      amount: t('card1Amount'),
      label: t('card1Label'),
      featured: false,
      link: "https://betal.vipps.no/p63sb7"
    },
    {
      id: 2,
      amount: t('card2Amount'),
      label: t('card2Label'),
      featured: true,
      link: "https://betal.vipps.no/hh6k7r"
    },
    {
      id: 3,
      amount: t('card3Amount'),
      label: t('card3Label'),
      featured: false,
      link: "https://betal.vipps.no/4ti4sa"
    }
  ];

  return (
    <section id="donations" className={styles.section}>
      <motion.div 
        className={styles.container}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.badge}>
            <span className={styles.dot}></span>
            {t('badge')}
          </div>
          <h2 className={styles.title}>{t('title')}</h2>
          <p className={styles.subtitle}>
            {t('subtitle')}
          </p>
        </div>

        {/* Donation Grid */}
        <div className={styles.donationGrid}>
          {donationCards.map((card) => (
            <motion.div 
              key={card.id}
              className={`${styles.donationCard} ${card.featured ? styles.featured : ''}`}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className={styles.cardAmount}>{card.amount}</div>
              <div className={styles.cardLabel}>{card.label}</div>
              <div className={styles.oneTimeNote}>{t('oneTime')}</div>
              <button 
                className={styles.donateBtn}
                onClick={() => window.open(card.link, "_blank")}
              >
                {t('donateNow')}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Progress Box */}
        <div className={styles.progressBox}>
          <div className={styles.progressLabel}>
            <div className={styles.raisedText}>
              {t('amountRaised')}: <span className={styles.amountValue}>NOK {raisedAmount.toLocaleString()}</span>
            </div>
            <div className={styles.goalText}>
              {t('goal')} NOK {goalAmount.toLocaleString()}
            </div>
          </div>
          <div className={styles.progressBarBg}>
            <div className={styles.progressBarFill} style={{ width: `${progressPercent}%` }}></div>
          </div>
          <div className={styles.trendRow}>
            <TrendingUp size={16} className={styles.featureIcon} />
            <p className={styles.featureDesc}>
              {remainingAmount.toLocaleString()} NOK {t('remaining')} — <span style={{color:'#FECE00'}}>{t('trend')}</span>
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className={styles.featuresGrid}>
          <div className={styles.featureItem}>
            <ShieldCheck size={28} className={styles.featureIcon} />
            <div>
              <h4 className={styles.featureTitle}>{t('feature1Title')}</h4>
              <p className={styles.featureDesc}>{t('feature1Desc')}</p>
            </div>
          </div>

          <div className={styles.featureItem}>
            <Truck size={28} className={styles.featureIcon} />
            <div>
              <h4 className={styles.featureTitle}>{t('feature2Title')}</h4>
              <p className={styles.featureDesc}>{t('feature2Desc')}</p>
            </div>
          </div>

          <div className={styles.featureItem}>
            <Users size={28} className={styles.featureIcon} />
            <div>
              <h4 className={styles.featureTitle}>{t('feature3Title')}</h4>
              <p className={styles.featureDesc}>{t('feature3Desc')}</p>
            </div>
          </div>
        </div>

        <button className={styles.reportBtn} onClick={() => setIsReportOpen(true)}>
          {t('report')}
        </button>

        <p className={styles.cancellationTerms}>{t('cancellationTerms')}</p>

      </motion.div>
      <ReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />
    </section>
  );
};

export default DonationImpact;
