import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "vision_studio": "Vision Studio",
      "inspiration_gallery": "Inspiration Gallery",
      "the_vault": "The Vault",
      "vendor_portal": "Vendor Portal",
      "system_docs": "System Docs",
      "start_visioning": "Start Visioning",
      "design_workbench": "Design Workbench",
      "garden_oasis": "Garden Oasis",
      "version_history": "Version History",
      "privacy_protocol": "Privacy Protocol",
      "terms_of_vision": "Terms of Vision"
    }
  },
  pt: {
    translation: {
      "vision_studio": "Estúdio de Visão",
      "inspiration_gallery": "Galeria de Inspiração",
      "the_vault": "O Cofre",
      "vendor_portal": "Portal do Vendedor",
      "system_docs": "Docs do Sistema",
      "start_visioning": "Começar a Visão",
      "design_workbench": "Bancada de Design",
      "garden_oasis": "Oásis de Jardim",
      "version_history": "Histórico de Versões",
      "privacy_protocol": "Protocolo de Privacidade",
      "terms_of_vision": "Termos de Visão"
    }
  },
  es: {
    translation: {
      "vision_studio": "Estudio de Visión",
      "inspiration_gallery": "Galería de Inspiración",
      "the_vault": "La Bóveda",
      "vendor_portal": "Portal del Vendedor",
      "system_docs": "Docs del Sistema",
      "start_visioning": "Comenzar Visión",
      "design_workbench": "Banco de Diseño",
      "garden_oasis": "Oasis de Jardín",
      "version_history": "Historial de Versiones",
      "privacy_protocol": "Protocolo de Privacidad",
      "terms_of_vision": "Términos de Visión"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
