import React, { useState } from 'react';
import styles from './Registration.module.css';
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { submitPublicRegistration } from "../../../services/publicApi";

const Registration = ({ selectedTarget, onClose, onSuccesOpen }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const { t } = useTranslation('register');
    const targetName = selectedTarget?.name || '';
    const registrationType = selectedTarget?.type === 'course' ? 'course' : 'event';
    const isCourse = registrationType === 'course';
    const resolveErrorMessage = (err) => {
        const message = String(err?.message || '').trim();
        const isNetworkError =
            err instanceof TypeError ||
            /failed to fetch|networkerror|load failed/i.test(message);

        return isNetworkError ? t('error') : message || t('error');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const firstName = String(formData.get('firstName') || '').trim();
        const lastName = String(formData.get('lastName') || '').trim();
        const email = String(formData.get('email') || '').trim();
        const phone = String(formData.get('phone') || '').trim();

        try {
            await submitPublicRegistration({
                name: [firstName, lastName].filter(Boolean).join(' ').trim(),
                email,
                phone,
                eventName: targetName,
                type: registrationType,
                source: isCourse ? 'website_course_form' : 'website_event_form',
            });

            e.currentTarget.reset();
            onClose();
            onSuccesOpen();
        } catch (err) {
            setError(resolveErrorMessage(err));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <button onClick={onClose} className={styles.close} aria-label="Close">
                <X size={24} />
            </button>

            <h3 className={styles.title}>
                {t(isCourse ? 'courseTitle' : 'eventTitle')}{' '}
                <span className={styles.name}>{targetName}</span>
            </h3>
            <p className={styles.desc}>{t(isCourse ? 'courseDesc' : 'eventDesc')}</p>

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGrid}>
                    <label>
                        <p>{t("name")}</p>
                        <input
                            type="text"
                            name="firstName"
                            autoComplete="given-name"
                            required
                        />
                    </label>

                    <label>
                        <p>{t("surname")}</p>
                        <input
                            type="text"
                            name="lastName"
                            autoComplete="family-name"
                            required
                        />
                    </label>
                </div>

                <label>
                    <p>{t("email")}</p>
                    <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        required
                    />
                </label>

                <label>
                    <p>
                        {t("phone")} <span className={styles.optional}>{t("phoneOptional")}</span>
                    </p>
                    <input
                        type="tel"
                        name="phone"
                        autoComplete="tel"
                    />
                </label>

                {error ? <p className={styles.error}>{error}</p> : null}

                <div className={styles.btn_container}>
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? t("submitting") : t("register")}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Registration;
