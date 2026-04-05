import React, { useState, useEffect } from 'react';
import styles from './Header.module.css';
import Logo from '../../images/header/Logo.png';
import ArrowDown from '../../images/header/Arrow.png';
import BritishFlag from '../../images/header/English.png';
import UkrainianFlag from '../../images/header/Ukraine (UA).png';
import NorwegianFlag from '../../images/header/Norway (NO).png';
import HeaderMenu from "./HeaderMenu";

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { Sun, Moon, User, Menu } from 'lucide-react';

import { useTheme } from "../../context/ThemeContext";
import i18n from "../../i118n";
import Magnetic from '../Magnetic/Magnetic';

const languageFlags = {
    en: BritishFlag,
    ua: UkrainianFlag,
    no: NorwegianFlag,
};

const Header = () => {
    const { t } = useTranslation("header");
    const { isDarkMode, toggleTheme } = useTheme();
    const navLinks = [
        { to: '/about-us', label: t("about") },
        { to: '/events', label: t("events") },
        { to: '/gallery', label: t("gallery") },
        { to: '/#courses', label: t("courses") },
        { to: '/#donations', label: t("donations") },
    ];

    const [currentLanguage, setCurrentLanguage] = useState(i18n.language || "en");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleClickDropdown = (langCode) => {
        i18n.changeLanguage(langCode);
        setCurrentLanguage(langCode);
        setIsDropdownOpen(false);
    };

    const handleMenu = () => {
        setIsMenuOpen(prevState => !prevState);
    };

    return (
        <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
            <div className={styles.header_container}>
                <div className={styles.brand_block}>
                    <Link to='/' className={styles.logo_link}>
                        <img src={Logo} alt="logo" />
                        <div className={styles.logo_copy}>
                            <span className={styles.logo_title}>MriJa</span>
                            <span className={styles.logo_subtitle}>{t("communityLabel")}</span>
                        </div>
                    </Link>
                </div>

                <nav className={styles.desktop_nav} aria-label="Primary">
                    <ul className={styles.nav_list}>
                        {navLinks.map((item) => (
                            <li key={item.to}>
                                <Link className={styles.link} to={item.to}>{item.label}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className={styles.user_options}>
                    <Link to='/volunteer-portal/login' className={styles.theme_btn} aria-label="Volunteer Portal" title="Volunteer Portal">
                        <User size={20} />
                    </Link>

                    <button onClick={toggleTheme} className={styles.theme_btn} aria-label="Toggle theme" title="Toggle theme">
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <div className={styles.dropdown}>
                        <div className={styles.mobile_menu}>
                            <button
                                className={styles.dropdown_btn}
                                onClick={() => setIsDropdownOpen(prev => !prev)}
                            >
                                <img className={styles.flag} src={languageFlags[currentLanguage]} alt="flag" />
                                <p className={styles.current_lang}>{currentLanguage.toUpperCase()}</p>
                                <img className={styles.arrow_icon} src={ArrowDown} alt="ArrowDown" />
                            </button>

                            <button onClick={handleMenu} className={styles.menu_btn} aria-label="Open menu">
                                <Menu size={20} />
                            </button>

                        </div>

                        <div className={`${styles.dropdown_content} ${isDropdownOpen ? styles.show : ""}`}>
                            <div className={styles.dropdown_container}>
                                <button
                                    onClick={() => handleClickDropdown("en")}
                                    className={`${styles.lang_btn} ${currentLanguage === "en" ? styles.active : ""}`}
                                >
                                    <img className={styles.flag} src={BritishFlag} alt="English" />
                                    English
                                </button>
                                <button
                                    onClick={() => handleClickDropdown("ua")}
                                    className={`${styles.lang_btn} ${currentLanguage === "ua" ? styles.active : ""}`}
                                >
                                    <img className={styles.flag} src={UkrainianFlag} alt="Українська" />
                                    Українська
                                </button>
                                <button
                                    onClick={() => handleClickDropdown("no")}
                                    className={`${styles.lang_btn} ${currentLanguage === "no" ? styles.active : ""}`}
                                >
                                    <img className={styles.flag} src={NorwegianFlag} alt="Norsk" />
                                    Norsk
                                </button>
                            </div>
                        </div>
                    </div>

                    <Magnetic strength={0.2}>
                        <Link to='/#membership' className={styles.join_link}>
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={styles.join_btn}
                            >
                                {t("join")}
                            </motion.button>
                        </Link>
                    </Magnetic>
                </div>
            </div>
            <AnimatePresence>
                {isMenuOpen && <HeaderMenu closeMenu={handleMenu} />}
            </AnimatePresence>
        </header>
    );
};

export default Header;
