import React, { useEffect, useMemo, useState } from 'react';
import styles from './Membership.module.css'
import individual from '../../../images/membership/individual.png';
import organization from '../../../images/membership/organization.png';
import {useTranslation} from "react-i18next";
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { startMembershipCheckout } from '../../../services/membershipApi';

const VIPPS_BUTTON_SCRIPT_ID = 'vipps-checkout-button-script';
const VIPPS_BUTTON_SCRIPT_SRC = 'https://checkout.vipps.no/checkout-button/v1/vipps-checkout-button.js';

const Membership = () => {
    const { t, i18n } = useTranslation("membership");
    const [isStartingCheckout, setIsStartingCheckout] = useState(false);
    const [checkoutError, setCheckoutError] = useState('');
    const [isVippsButtonReady, setIsVippsButtonReady] = useState(
        () => typeof window !== 'undefined' && Boolean(window.customElements?.get('vipps-mobilepay-button'))
    );

    const vippsLanguage = useMemo(() => {
        const language = i18n.resolvedLanguage || i18n.language || 'en';

        if (language.startsWith('no')) {
            return 'no';
        }

        return 'en';
    }, [i18n.language, i18n.resolvedLanguage]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return undefined;
        }

        if (window.customElements?.get('vipps-mobilepay-button')) {
            setIsVippsButtonReady(true);
            return undefined;
        }

        const markReady = () => {
            setIsVippsButtonReady(Boolean(window.customElements?.get('vipps-mobilepay-button')));
        };

        const existingScript = document.getElementById(VIPPS_BUTTON_SCRIPT_ID);

        if (existingScript) {
            existingScript.addEventListener('load', markReady);
            window.setTimeout(markReady, 100);

            return () => {
                existingScript.removeEventListener('load', markReady);
            };
        }

        const script = document.createElement('script');
        script.id = VIPPS_BUTTON_SCRIPT_ID;
        script.async = true;
        script.type = 'text/javascript';
        script.src = VIPPS_BUTTON_SCRIPT_SRC;
        script.addEventListener('load', markReady);
        document.head.appendChild(script);

        return () => {
            script.removeEventListener('load', markReady);
        };
    }, []);

    const handleMembershipCheckout = async () => {
        if (isStartingCheckout) {
            return;
        }

        setIsStartingCheckout(true);
        setCheckoutError('');

        try {
            const result = await startMembershipCheckout();
            window.location.assign(result.redirectUrl);
        } catch (error) {
            setCheckoutError(
                error.message || t("vippsStartError", "We could not start Vipps right now. Please try again.")
            );
            setIsStartingCheckout(false);
        }
    };

    return (
        <section id='membership' className={styles.membership_wrapper}>
            <motion.div 
                className={styles.membership_container}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <p className='main-p'>{t("join")}</p>
                <h2 className={styles.title}>{t("title")}</h2>
                <p className={styles.subtitle}>{t("subtitle")}</p>
                <div className={styles.membership_content}>
                    <div className={styles.card}>
                        <img src={individual} alt="individual"/>
                        <p className={styles.name}>
                            {t("Voksen")}
                        </p>
                        <p className={styles.price_container}><span className={styles.price}>100 NOK</span>/{t("year")}</p>
                        <div className={styles.cardBody}>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <p className={styles.description}>
                                    {t("individualDesc")}
                                </p>
                                <ul className={styles.list}>
                                    <li>{t("accessEvents")}</li>
                                    <li>{t("communitySupport")}</li>
                                    <li>{t("newsletter")}</li>
                                </ul>
                                {isStartingCheckout ? (
                                    <button
                                        className={`${styles.vippsFallbackButton} ${styles.vippsLoadingButton}`}
                                        disabled
                                    >
                                        <span className={styles.loadingIndicator}>
                                            <Loader2 size={18} className={styles.spinner} />
                                            {t("openingVipps", "Opening Vipps...")}
                                        </span>
                                    </button>
                                ) : (
                                    <div className={styles.vippsButtonShell}>
                                        {isVippsButtonReady ? (
                                            <vipps-mobilepay-button
                                                className={styles.vippsNativeButton}
                                                brand="vipps"
                                                language={vippsLanguage}
                                                rounded="true"
                                                branded="true"
                                                stretched="true"
                                                variant="primary"
                                                verb="continue"
                                                onClick={handleMembershipCheckout}
                                                aria-label={t("continueWithVipps", "Continue with Vipps")}
                                            />
                                        ) : (
                                            <button
                                                type="button"
                                                className={styles.vippsFallbackButton}
                                                onClick={handleMembershipCheckout}
                                            >
                                                {t("continueWithVipps", "Continue with Vipps")}
                                            </button>
                                        )}
                                    </div>
                                )}
                                <p className={styles.helperText}>
                                    {t(
                                        "vippsConsent",
                                        "Vipps will ask for permission to share your name, email, and phone number before payment."
                                    )}
                                </p>
                                {checkoutError ? <p className={styles.inlineError}>{checkoutError}</p> : null}
                                <p className={styles.cancellation_terms} style={{fontSize: '12px', marginTop: '15px', color: '#64748b', lineHeight: '1.4'}}>
                                    {t("cancellationTerms")}
                                </p>
                            </motion.div>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <img src={organization} alt="organization"/>
                        <p className={styles.name}>
                            {t("organization")}
                        </p>
                        <p className={styles.contact}>{t("contact")}</p>
                        <div>
                            <p className={styles.description}>
                                {t("contactDesc")}
                            </p>
                            <ul className={styles.list}>
                                <li>{t("partnership")}</li>
                                <li>{t("sponsor")}</li>
                                <li>{t("volunteer")}</li>
                            </ul>
                            <button
                                onClick={() => {
                                    const el = document.getElementById("footer");
                                    el?.scrollIntoView({ behavior: "smooth" });
                                }}
                                className={styles.btn}>{t("contactUs")}</button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default Membership;
