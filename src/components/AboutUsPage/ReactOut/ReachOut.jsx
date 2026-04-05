import React, {useState} from 'react';
import styles from './ReachOut.module.css';
import {useTranslation} from "react-i18next";
import { motion } from 'framer-motion';

const ReachOut = () => {
    const { t } = useTranslation("reachOut");
    const [email, setEmail] = useState("");
    const [isEmailCorrect, setIsEmailCorrect] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email.includes("@")) {
            setIsEmailCorrect(false);
            return;
        }

        e.target.submit();
        e.target.reset();
        setEmail("");
        setIsEmailCorrect(true);
    };
    const handleChange = (e) => {
        const value = e.target.value;
        setEmail(value);


        if (value.includes("@")) {
            setIsEmailCorrect(true);
        }
    };

    return (
        <div id="contact" className={styles.wrapper}>
            <motion.div 
                className={styles.container}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <div className={styles.content}>
                    <div className={styles.row}>
                        <p className={styles.p}>{t("wantToHost")}</p>
                        <h2 className={styles.title}>{t("title")}</h2>
                        <p className={styles.subtitle}>{t("subtitle")}</p>
                    </div>
                    <form action="https://docs.google.com/forms/d/e/1FAIpQLSemeEztVXc_H3DrevYpYeb-mngNK0a4eTTWf88ItQetzZxaow/formResponse"
                         method="POST" target="hidden_iframe" onSubmit={handleSubmit} id='contact-form' className={styles.form}>
                        <input name='entry.1444777553' type="text" placeholder={t("name")} required />
                        <input name='entry.965548831' type="text" placeholder={t("email")} value={email} onChange={handleChange}/>
                        {!isEmailCorrect && (
                            <p className={styles.error}>
                                {t("emailError")}
                            </p>
                        )}
                        <textarea required name='entry.1285924396' placeholder={t("message")}></textarea>
                        <button>{t("send")}</button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default ReachOut;
