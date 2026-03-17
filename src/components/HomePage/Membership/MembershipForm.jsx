import React, { useState } from 'react';
import styles from './MembershipForm.module.css';
import { useTranslation } from 'react-i18next';
import { submitMembershipData } from '../../../services/membershipApi';
import { Loader2 } from 'lucide-react';

const MembershipForm = ({ onComplete }) => {
    const { t } = useTranslation('membership');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const result = await submitMembershipData(formData);

        if (result.success) {
            onComplete();
        } else {
            setError(t('formError', 'Something went wrong. Please try again.'));
            setIsSubmitting(false);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
                <label htmlFor="name">{t('formName', 'Full Name')}</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder={t('namePlaceholder', 'John Doe')}
                />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="email">{t('formEmail', 'Email Address')}</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder={t('emailPlaceholder', 'john@example.com')}
                />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="phone">{t('formPhone', 'Phone Number')}</label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder={t('phonePlaceholder', '+47 000 00 000')}
                />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? (
                    <Loader2 className={styles.spinner} size={20} />
                ) : (
                    t('subscribe')
                )}
            </button>
        </form>
    );
};

export default MembershipForm;
