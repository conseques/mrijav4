import React, { useState, useEffect } from 'react';
import styles from './Header.module.css';
import Logo from '../../images/header/Logo.png';
import ArrowDown from '../../images/header/Arrow.png';
import BritishFlag from '../../images/header/English.png';
import UkrainianFlag from '../../images/header/Ukraine (UA).png';
import NorwegianFlag from '../../images/header/Norway (NO).png';
import menu from '../../images/header/menu.png';
import HeaderMenu from "./HeaderMenu";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AnimatePresence } from "framer-motion";
import { Sun, Moon, User } from 'lucide-react';
import { useTheme } from "../../context/ThemeContext";
import i18n from "../../i118n";


const languageFlags = {
    en: BritishFlag,
    ua: UkrainianFlag,
    no: NorwegianFlag,
};

const Header = () => {
    const { t } = useTranslation("header");
    const { isDarkMode, toggleTheme } = useTheme();


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

    const getLanguageName = (code) => {
        switch (code) {
            case "en": return "English";
            case "ua": return "Українська";
            case "no": return "Norsk";
            default: return "English";
        }
    };

    return (
        <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
            <div className={styles.header_container}>
                <div className={styles.logo_container}>
                    <Link to='/'>
                        <img src={Logo} alt="logo" />
                    </Link>
                </div>

                <nav>
                    <ul className={styles.nav_list}>
                        <Link className={styles.link} to='/about-us'>{t("about")}</Link>
                        <Link className={styles.link} to='/#courses'>{t("courses")}</Link>
                        <Link className={styles.link} to='/gallery'>{t("gallery")}</Link>
                        <Link className={styles.link} to='/events'>{t("events")}</Link>
                        <Link className={styles.link} to='/#donations'>{t("donations")}</Link>
                    </ul>
                </nav>

                <div className={styles.user_options}>
                    <Link to='/volunteer-portal/login' className={styles.theme_btn} aria-label="Volunteer Portal" title="Volunteer Portal">
                        <User size={20} />
                    </Link>

                    {/* Theme toggle — standalone, balanced between nav and controls */}
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

                            <button onClick={handleMenu} className={styles.menu_btn}>
                                <img src={menu} alt="menu" />
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

                    <Link to='/#membership' className={styles.join_btn}>
                        {t("join")}
                    </Link>
                </div>
            </div>
            <AnimatePresence>
                {isMenuOpen && <HeaderMenu closeMenu={handleMenu} />}
            </AnimatePresence>
        </header>
    );
};

export default Header;
