import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const SEO = ({ title, description, keywords, ogImage, ogType = 'website' }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'no';
  
  // Default values
  const siteTitle = "Mrija - Ukrainian Association in Norway";
  const defaultDesc = "Ukrainian Association in Drammen, Norway. Supporting refugees, education, and cultural integration.";
  
  return (
    <Helmet>
      <html lang={currentLang} />
      <title>{title ? `${title} | ${siteTitle}` : siteTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title || siteTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={title || siteTitle} />
      <meta property="twitter:description" content={description || defaultDesc} />
    </Helmet>
  );
};

export default SEO;
