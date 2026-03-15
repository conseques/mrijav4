import React from 'react';
import styles from './TelegramWidget.module.css';

const TelegramWidget = () => {
    return (
        <a 
            href="https://t.me/mrijauabot" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.widget}
            aria-label="Contact us on Telegram"
        >
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                width="32" 
                height="32"
            >
                <path 
                    fill="#ffffff" 
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.12.03-1.98 1.25-5.58 3.63-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.06-.49-.83-.27-1.49-.42-1.43-.89.03-.25.38-.51 1.03-.78 4.04-1.76 6.74-2.92 8.09-3.48 3.85-1.6 4.64-1.88 5.16-1.89.11 0 .37.03.54.17.14.12.18.28.2.43.01.09.02.27 0 .46z"
                />
            </svg>
        </a>
    );
};

export default TelegramWidget;