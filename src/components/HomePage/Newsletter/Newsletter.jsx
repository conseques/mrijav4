import React, { useState } from 'react';
import styles from './Newsletter.module.css';
import { useTranslation } from "react-i18next";

const Newsletter = () => {
    const { t } = useTranslation("newsletter");
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
        <section className={styles.newsletter_wrapper}>
            <div className={styles.newsletter_container}>
                <h2>{t("stay")}</h2>

                <form
                    action="https://docs.google.com/forms/d/e/1FAIpQLSci-s2KVKlFLq1tJa9VYgdytPIpNha9ldz6juTp9LwlwKGDhQ/formResponse"
                    method="POST"
                    target="hidden_iframe"
                    onSubmit={handleSubmit}
                    className={styles.form}
                >
                    <div className={styles.input_wrapper}>
                        <input
                            name="entry.1735671596"
                            type="text"
                            placeholder={t("enter")}
                            value={email}
                            onChange={handleChange}
                        />
                    </div>

                    <button >
                        {t("subscribe")}
                    </button>

                    {!isEmailCorrect && (
                        <p style={{ color: "red", marginTop: "5px" }}>
                            {t("email")}
                        </p>
                    )}
                </form>
            </div>
        </section>
    );
};

export default Newsletter;
