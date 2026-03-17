import React from 'react';
import { ShieldCheck, Truck, Users, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styles from './DonationImpact.module.css';

import { motion } from 'framer-motion';

const DonationImpact = () => {
  const { t } = useTranslation('donationImpact');

  const raisedAmount = 35000;
  const goalAmount = 150000;
  const progressPercent = Math.min(Math.round((raisedAmount / goalAmount) * 100), 100);
  const remainingAmount = Math.max(goalAmount - raisedAmount, 0);

  return (
    <section className={styles.section}>
      <motion.div 
        className={styles.container}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
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

        {/* Main Donation Card */}
        <div className={styles.mainCard}>
          <h3 className={styles.mainCardSubtitle}>{t('amountRaised')}</h3>
          <div className={styles.amountContainer}>
            <span className={styles.currency}>NOK</span>
            <span className={styles.amount}>{raisedAmount.toLocaleString()}</span>
          </div>

          <div className={styles.progressSection}>
            <div className={styles.progressLabels}>
              <span className={styles.goalText}>{t('goal')} {goalAmount.toLocaleString()}</span>
              <span className={styles.percentText}>{progressPercent}% {t('complete')}</span>
            </div>
            <div className={styles.progressBarBg}>
              <div className={styles.progressBarFill} style={{ width: `${progressPercent}%` }}></div>
            </div>
            <div className={styles.trendRow}>
              <TrendingUp size={16} className={styles.trendIcon} />
              <p className={styles.trendText}>
                {remainingAmount.toLocaleString()} {t('remaining')} <span className={styles.trendGreen}>{t('trend')}</span>
              </p>
            </div>
          </div>

          <div className={styles.actions}>
            <a href="#membership" className={styles.primaryButton} style={{textDecoration: 'none'}}>{t('join')}</a>
            <Link to="/report" className={styles.secondaryLink}>{t('report')}</Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.iconWrapperBlue}>
              <ShieldCheck size={20} className={styles.blueIcon} />
            </div>
            <div>
              <h4 className={styles.featureTitle}>{t('feature1Title')}</h4>
              <p className={styles.featureDesc}>{t('feature1Desc')}</p>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.iconWrapperBlue}>
              <Truck size={20} className={styles.blueIcon} />
            </div>
            <div>
              <h4 className={styles.featureTitle}>{t('feature2Title')}</h4>
              <p className={styles.featureDesc}>{t('feature2Desc')}</p>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.iconWrapperBlue}>
              <Users size={20} className={styles.blueIcon} />
            </div>
            <div>
              <h4 className={styles.featureTitle}>{t('feature3Title')}</h4>
              <p className={styles.featureDesc}>{t('feature3Desc')}</p>
            </div>
          </div>
        </div>

        {/* Footer Accent */}
        <div className={styles.footerAccent}>
          <div className={styles.colors}>
            <div className={styles.colorBlue}></div>
            <div className={styles.colorYellow}></div>
          </div>
          <p className={styles.footerText}>{t('footer')}</p>
        </div>

      </motion.div>
    </section>
  );
};

export default DonationImpact;
