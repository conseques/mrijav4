import React, {useRef, useState} from 'react';
import Header from "../Header/Header";
import Modal from "../Modal/Modal";
import {Outlet} from "react-router-dom";
import Footer from "../Footer/Footer";
import Registration from "../Modal/Registration/Registration";
import Successfully from "../Modal/Successfully";
import { Helmet } from 'react-helmet-async';
import { useTranslation } from "react-i18next";

const Layout = () => {
    const modal = useRef();
    const succesModal = useRef();
    const [selectedEventName, setSelectedEventName] = useState('');
    const { t, i18n } = useTranslation('header'); // Assuming 'header' has some generic translation or we just use current language
    
    function handleOpenModal({name}) {
        setSelectedEventName(name);
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
                <title>{i18n.language === 'ua' ? 'Mriya - Українська організация' : (i18n.language === 'en' ? 'Mriya - Ukrainian Organization' : 'Mriya - Ukrainsk Organisasjon')}</title>
                <meta name="description" content="Mriya - community, events, courses, and support." />
            </Helmet>
            <Header/>
            <Modal ref={modal}>
                <Registration onSuccesOpen={handleOpenSuccesModal} onClose={handleCloseModal}  selectedEventName={selectedEventName} />
            </Modal>
            <Modal ref={succesModal}>
                <Successfully  onClose={handleCloseSuccesModal} />
            </Modal>
            <Outlet  context={{ closeModal: handleCloseModal, openModal: handleOpenModal }} />
            <Footer/>
        </>
    );
};

export default Layout;