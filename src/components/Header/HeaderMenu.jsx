import React from 'react';
import styles from './Header.module.css';
import Logo from "../../images/header/Logo.png";
import close from '../../images/header/icon-btn.png'
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import { motion } from "framer-motion";

const HeaderMenu = ({closeMenu}) => {
    const { t } = useTranslation("header");
    return (
        <motion.div
            initial={{x: "100%"}}
            animate={{x: 0}}
            exit={{x: "100%"}}
            transition={{duration: 0.3, ease: "easeInOut"}}
            className="menu"
        >
            <div className={styles.header_menu}>
                <div className={styles.header_menu_container}>
                    <div className={styles.logo_container}>
                        <img src={Logo} alt="logo"/>
                    </div>
                    <button onClick={closeMenu}>
                        <img src={close} alt="close"/>
                    </button>
                </div>
                <nav>
                    <div className={styles.menu_nav_list}>
                        <Link className={styles.menu_link} to='/' onClick={closeMenu}>
                            {t("home")}
                        </Link>

                        <Link className={styles.menu_link} to='/about-us' onClick={closeMenu}>
                            {t("about")}
                        </Link>

                        <Link className={styles.menu_link} to='/events' onClick={closeMenu}>
                            {t("events")}
                        </Link>
                    </div>
                </nav>
                <a href="/#membership" className={styles.menu_join_btn} onClick={closeMenu}>
                    {t("join")}
                </a>
            </div>
        </motion.div>
    );
};

export default HeaderMenu;