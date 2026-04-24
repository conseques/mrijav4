import React, {useRef, useState} from 'react';
import Header from "../Header/Header";
import Modal from "../Modal/Modal";
import {Outlet} from "react-router-dom";
import Footer from "../Footer/Footer";
import Registration from "../Modal/Registration/Registration";
import Successfully from "../Modal/Successfully";
import { Helmet } from 'react-helmet-async';
import { useTranslation } from "react-i18next";
import TelegramWidget from "../TelegramWidget/TelegramWidget";
import { createRegistrationTarget } from "../Modal/Registration/registrationTarget.mjs";

const Layout = () => {
    const modal = useRef();
    const succesModal = useRef();
    const [selectedRegistrationTarget, setSelectedRegistrationTarget] = useState(() => createRegistrationTarget());
    const { t, i18n } = useTranslation('header'); // Assuming 'header' has some generic translation or we just use current language
    
    function handleOpenModal(target = {}) {
        setSelectedRegistrationTarget(createRegistrationTarget(target));
        modal.current.open()

    }
    function handleCloseModal() {
        modal.current.close()
    }
    function handleOpenSuccesModal() {
        succesModal.current.open()

    }
    function handleCloseSuccesModal() {
        succesModal.current.close()
    }

    return (
        <>
            <Helmet>
                <html lang={i18n.language || 'no'} />
                <title>Ukrainsk forening MriJa</title>
                <meta name="description" content="Mriya - community, events, courses, and support." />
                <meta property="og:title" content="Ukrainsk forening MriJa" />
                <meta property="og:description" content="Mriya - community, events, courses, and support." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://mrija.no" />
            </Helmet>
            <Header/>
            <Modal ref={modal}>
                <Registration
                    onSuccesOpen={handleOpenSuccesModal}
                    onClose={handleCloseModal}
                    selectedTarget={selectedRegistrationTarget}
                />
            </Modal>
            <Modal ref={succesModal}>
                <Successfully onClose={handleCloseSuccesModal} selectedTarget={selectedRegistrationTarget} />
            </Modal>
            <main>
                <Outlet  context={{ closeModal: handleCloseModal, openModal: handleOpenModal }} />
            </main>
            <Footer/>
            <TelegramWidget />
        </>
    );
};

export default Layout;
