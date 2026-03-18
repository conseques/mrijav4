import React from 'react';
import styles from './Footer.module.css'
import logo from './Logo.png'
import instagram from '../../images/footer/instagram.svg'
import facebook from '../../images/footer/facebook.svg'
import {useTranslation} from "react-i18next";

const Footer = () => {
    const { t } = useTranslation("footer");
    return (
        <footer id='footer' className={styles.footer_wrapper}>
            <div className={styles.footer_container}>
                <div className={styles.footer_content}>
                    <div className={styles.logo_section}>
                        <img className={styles.logo} src={logo} alt="logo"/>
                        <div className={styles.org_info}>
                            <h3 className={styles.org_name}>{t("orgName")}</h3>
                            <p className={styles.org_number}>{t("orgNumber")}</p>
                        </div>
                    </div>
                    <div className={styles.footer_contact}>
                        <div className={styles.contact_row}>
                            <h3 className={styles.address}>{t("address")}</h3>
                            <p>Cappelens gate 34</p>
                            <p>Drammen, Norway</p>
                        </div>
                        <div className={styles.contact_row}>
                            <h3 className={styles.email}>{t("email")}</h3>
                            <p>mrija.i.drammen@gmail.com</p>
                        </div>
                        <div className={styles.contact_row}>
                            <h3 className={styles.phone}>{t("phone")}</h3>
                            <p>+47 912 54 807</p>
                            <p>+47 967 36 535</p>
                        </div>
                        <div className={styles.contact_row}>
                            <h3 >{t("socials")}</h3>
                            <div className={styles.socials}>
                                <a href="https://www.instagram.com/mrija_ua_norge/"><img className={styles.instagram} src={instagram} alt="instagram"/></a>
                                <a href='https://www.facebook.com/groups/737201494718405/about'><img className={styles.facebook} src={facebook} alt="facebook"/></a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.footer_bottom}>
                    <p className={styles.rights}>{t("rights")}</p>
                    <div className={styles.footer_policy}>
                        <a href="/terms.html" target="_blank" className={styles.terms} rel="noreferrer">{t("terms")}</a>
                        <a href="/privacy_policy.html" target="_blank"  rel="noreferrer">{t("privacy")}</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;