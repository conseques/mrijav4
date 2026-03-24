import React, {useRef, useState} from 'react';
import styles from './Registration.module.css';
import close from './Close_MD.png'
import {useTranslation} from "react-i18next";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebase";

const Registration = ({selectedEventName, onClose, onSuccesOpen}) => {
    const iframeRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {t} = useTranslation('register');

    // ТУТ БУДЕТ ССЫЛКА НА ТВОЙ СКРИПТ (которую ты опубликуешь как Web App)
    const GOOGLE_SCRIPT_WEBHOOK_URL = "СЮДА_ВСТАВИТЬ_ССЫЛКУ_НА_APPS_SCRIPT";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // 1. Собираем данные из формы для нашего вебхука
        const formData = new FormData(e.target);
        const dataForWebhook = {
            name: formData.get("entry.524126650"),
            surname: formData.get("entry.181395569"),
            phone: formData.get("entry.675187710"),
            event: formData.get("entry.195333573"), // Это selectedEventName
            email: formData.get("entry.email_placeholder") // ЗАМЕНИТЬ НА РЕАЛЬНЫЙ entry.* ОТ GOOGLE ФОРМЫ
        };

        // 2. Асинхронно стучим в твой скрипт
        if (GOOGLE_SCRIPT_WEBHOOK_URL !== "СЮДА_ВСТАВИТЬ_ССЫЛКУ_НА_APPS_SCRIPT") {
             fetch(GOOGLE_SCRIPT_WEBHOOK_URL, {
                method: "POST",
                mode: "no-cors", 
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataForWebhook)
            }).catch(err => console.error("Ошибка вебхука: ", err));
        }

        // 2.5 Сохраняем в Firebase
        try {
            await addDoc(collection(db, "registrations"), {
                name: `${dataForWebhook.name} ${dataForWebhook.surname}`.trim(),
                email: dataForWebhook.email || '',
                phone: dataForWebhook.phone || '',
                eventName: dataForWebhook.event,
                createdAt: serverTimestamp()
            });
        } catch (err) {
            console.error("Firebase Registration Error: ", err);
        }

        // 3. Стандартная отправка в Google Forms
        e.target.submit();
        e.target.reset();
        onClose();
        onSuccesOpen();
    };

    const handleIframeLoad = () => {
        if (isSubmitting) {
            setIsSubmitting(false);
        }
    };
    return (
        <div className={styles.container}>
            <h3 className={styles.title}>{t("title")} <span className={styles.name}>{selectedEventName}</span> </h3>
            <button onClick={onClose} className={styles.close}><img className={styles.close} src={close} alt=""/></button>
            <p className={styles.desc}>{t("desc")} <span>{t("active")}</span> </p>
            <form className={styles.form}
                  action="https://docs.google.com/forms/u/0/d/e/1FAIpQLScXLP6ZTgUkpgUjH81ujvFqzWCWx2kXJhbh3X9Bg1Qf4jZeKQ/formResponse"
                  method="POST" target="hidden_iframe" onSubmit={handleSubmit}>
                <label>
                    <p>{t("name")}</p>
                    <input type="text" name="entry.524126650" placeholder='Enter name' required/>

                </label>
                <label>
                    <p>{t("surname")}</p>
                    <input type="text" name="entry.181395569" placeholder='Enter surname' required/>
                </label>
                <label>
                    <p>{t("email", "Email")}</p>
                    <input type="email" name="entry.email_placeholder" placeholder='Enter email' required/>
                </label>
                <label>
                    <p>{t("phone")}</p>
                    <input type="number" name="entry.675187710" pattern=".{8,}" placeholder='(+47) xxx-xx-xxx' title={t('notCorrectPhone')} required/>
                </label>
                <input style={{display: "none"}} name="entry.195333573" value={selectedEventName} type="text" readOnly />
                <div className={styles.btn_container}>
                    <button type="submit">{t("register")}</button>
                </div>
                <iframe
                    name="hidden_iframe"
                    ref={iframeRef}
                    style={{display: "none"}}
                    title="hidden_iframe"
                    onLoad={handleIframeLoad}
                ></iframe>
            </form>
        </div>
    );
};

export default Registration;