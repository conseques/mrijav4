import React from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import icon from './Frame 264.png';
import styles from './Successfully.module.css';
import { getRegistrationTicketAction } from "./Registration/registrationTarget.mjs";

const Successfully = ({ onClose, selectedTarget }) => {
    const { t, i18n } = useTranslation('register');
    const navigate = useNavigate();
    const isCourse = selectedTarget?.type === 'course';
    const targetName = selectedTarget?.name || '';
    const ticketAction = getRegistrationTicketAction(selectedTarget, i18n.language);

    const handleMembershipClick = () => {
        onClose();
        navigate('/#membership');
    };

    return (
        <div className={styles.container}>
            <img src={icon} alt="" />
            <span className={styles.badge}>
                {t(isCourse ? 'successCourseBadge' : 'successEventBadge')}
            </span>
            <h2>{t(isCourse ? 'successTitleCourse' : 'successTitleEvent')}</h2>
            <p>{t(isCourse ? 'successDescCourse' : 'successDescEvent', { name: targetName })}</p>
            <p className={styles.membershipPrompt}>{t('membershipPrompt')}</p>
            <div className={styles.actions}>
                <button className={styles.primaryButton} onClick={handleMembershipClick}>
                    {t('membershipCta')}
                </button>
                {ticketAction ? (
                    <a
                        className={styles.ticketButton}
                        href={ticketAction.url}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {ticketAction.label}
                    </a>
                ) : null}
                <button className={styles.secondaryButton} onClick={onClose}>
                    {t('closeCta')}
                </button>
            </div>
            {ticketAction ? (
                <p className={styles.ticketNote}>{ticketAction.note}</p>
            ) : null}
        </div>
    );
};

export default Successfully;
