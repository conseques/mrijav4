import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './VolunteerFormNote.module.css';
import { getVolunteerFormNote } from '../../content/volunteerForm';

const VolunteerFormNote = ({ className = '' }) => {
  const { i18n } = useTranslation();

  return <p className={`${styles.note} ${className}`}>{getVolunteerFormNote(i18n.language)}</p>;
};

export default VolunteerFormNote;
