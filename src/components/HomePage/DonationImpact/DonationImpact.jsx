import React, { useState, useEffect } from 'react';
import { ShieldCheck, Truck, Users, TrendingUp, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getReportData } from '../../../services/reportService';
import styles from './DonationImpact.module.css';
import ReportModal from '../../ReportModal/ReportModal';
import {
  DONATION_TOTAL_BEFORE_CONCERT_IMPACT,
  applyConcertImpactDonation,
} from './donationImpactTotals.mjs';

import { motion } from 'framer-motion';
import { useTilt } from '../../../hooks/useTilt';
import Magnetic from '../../Magnetic/Magnetic';

const DonationOption = ({ card, t }) => {
  const { rotateX, rotateY, onMouseMove, onMouseLeave } = useTilt();

  return (
    <motion.article
      className={`${styles.donationCard} ${card.featured ? styles.featured : ''}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      whileHover={{ scale: 1.015, y: -6 }}
    >
      <div className={styles.cardBody} style={{ transform: "translateZ(28px)" }}>
        <div className={styles.cardLabelWrap}>
          {card.featured && <span className={styles.cardTag}>Vipps</span>}
          <div className={styles.cardLabel}>{card.label}</div>
        </div>
        <div className={styles.cardAmount}>{card.amount}</div>
        <div className={styles.oneTimeNote}>{t('oneTime')}</div>
      </div>

      <Magnetic strength={0.22}>
        <motion.a
          href={card.link}
          target="_blank"
          rel="noreferrer"
          style={{ transform: "translateZ(20px)" }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={styles.donateBtn}
        >
          {t('donateNow')}
        </motion.a>
      </Magnetic>
    </motion.article>
  );
};

const DonationImpact = () => {
  const { t } = useTranslation('donationImpact');
  
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportData, setReportData] = useState(() => applyConcertImpactDonation({
    totalAmountRaised: DONATION_TOTAL_BEFORE_CONCERT_IMPACT,
    goalAmount: 150000
  }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getReportData();
        setReportData(applyConcertImpactDonation({
          totalAmountRaised: data.totalAmountRaised,
          goalAmount: data.goalAmount
        }));
      } catch (err) {
        console.error("Error fetching donation impact data:", err);
      }
    };
    fetchData();
  }, []);

  const raisedAmount = reportData.totalAmountRaised;
  const goalAmount = reportData.goalAmount;
  const progressPercent = goalAmount > 0 ? Math.min(Math.round((raisedAmount / goalAmount) * 100), 100) : 0;
  const remainingAmount = Math.max(goalAmount - raisedAmount, 0);

  const donationCards = [
    { id: 1, amount: t('card1Amount'), label: t('card1Label'), featured: false, link: "https://betal.vipps.no/p63sb7" },
    { id: 2, amount: t('card2Amount'), label: t('card2Label'), featured: true, link: "https://betal.vipps.no/hh6k7r" },
    { id: 3, amount: t('card3Amount'), label: t('card3Label'), featured: false, link: "https://betal.vipps.no/4ti4sa" }
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
        <div className={styles.topGrid}>
          <div className={styles.header}>
            <div className={styles.badge}>
              <span className={styles.dot}></span>
              {t('badge')}
            </div>
            <h2 className={styles.title}>{t('title')}</h2>
            <p className={styles.subtitle}>{t('subtitle')}</p>

            <div className={styles.featuresGrid}>
              <div className={styles.featureItem}>
                <ShieldCheck size={24} className={styles.featureIcon} />
                <div>
                  <h4 className={styles.featureTitle}>{t('feature1Title')}</h4>
                  <p className={styles.featureDesc}>{t('feature1Desc')}</p>
                </div>
              </div>

              <div className={styles.featureItem}>
                <Truck size={24} className={styles.featureIcon} />
                <div>
                  <h4 className={styles.featureTitle}>{t('feature2Title')}</h4>
                  <p className={styles.featureDesc}>{t('feature2Desc')}</p>
                </div>
              </div>

              <div className={styles.featureItem}>
                <Users size={24} className={styles.featureIcon} />
                <div>
                  <h4 className={styles.featureTitle}>{t('feature3Title')}</h4>
                  <p className={styles.featureDesc}>{t('feature3Desc')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.progressBox}>
            <div className={styles.progressTop}>
              <div>
                <div className={styles.progressEyebrow}>{t('amountRaised')}</div>
                <div className={styles.progressAmount}>NOK {raisedAmount.toLocaleString()}</div>
              </div>
              <div className={styles.goalPill}>
                {t('goal')} NOK {goalAmount.toLocaleString()}
              </div>
            </div>

            <div className={styles.progressBarBg}>
              <div className={styles.progressBarFill} style={{ width: `${progressPercent}%` }}></div>
            </div>

            <div className={styles.progressMeta}>
              <div className={styles.progressPercent}>{progressPercent}%</div>
              <div className={styles.trendRow}>
                <TrendingUp size={16} className={styles.featureIcon} />
                <p className={styles.featureDesc}>
                  {remainingAmount.toLocaleString()} NOK {t('remaining')} <span className={styles.trendAccent}>{t('trend')}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.donationGrid}>
          {donationCards.map((card) => (
            <DonationOption key={card.id} card={card} t={t} />
          ))}
        </div>

        <div className={styles.footerRow}>
          <button className={styles.reportBtn} onClick={() => setIsReportOpen(true)}>
            {t('report')}
            <ArrowUpRight size={16} />
          </button>

          <p className={styles.cancellationTerms}>{t('cancellationTerms')}</p>
        </div>
      </motion.div>
      <ReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />
    </section>
  );
};

export default DonationImpact;
