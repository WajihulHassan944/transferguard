import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'nl';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary - add translations here
// When you update Dutch text, the English will be auto-translated via AI
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    'header.features': 'Features',
    'header.pricing': 'Pricing',
    'header.about': 'About',
    'header.login': 'Log in',
    'header.signup': 'Create Free Account',
    'header.startTrial': 'Start Free Trial',
    
    // Hero
    'hero.badge': 'Court-admissible evidence for every delivery',
    'hero.title.line1': 'Send Files with',
    'hero.title.highlight': 'Legal Proof',
    'hero.title.line2': 'of Delivery',
    'hero.subtitle': 'TransferGuard provides registered file transfers with certified proof of delivery. Know exactly when and by whom your documents were received.',
    'hero.cta.primary': 'Start Free Trial',
    'hero.cta.secondary': 'See How It Works',
    'hero.noCreditCard': 'No credit card required',
    'hero.trialDays': '14-day free trial',
    
    // Stats
    'stats.files': 'Files Delivered',
    'stats.countries': 'Countries',
    'stats.uptime': 'Uptime',
    'stats.support': 'Support',
    
    // Features
    'features.title': 'Why Choose TransferGuard?',
    'features.subtitle': 'Legal certainty for every file transfer',
    
    // Comparison
    'comparison.title': 'The Problem We Solve',
    'comparison.theRisk': 'The Risk',
    'comparison.theSolution': 'The Solution',
    
    // Identity Verification
    'identity.title': 'Identity-Verified Delivery',
    'identity.subtitle': 'Legal-grade biometric verification',
    
    // Pricing
    'pricing.title': 'Simple, Transparent Pricing',
    'pricing.subtitle': 'Choose the plan that fits your needs',
    'pricing.professional': 'Professional',
    'pricing.legal': 'Legal',
    'pricing.perMonth': '/month',
    'pricing.startTrial': 'Start 14-Day Free Trial',
    'pricing.popular': 'Most Popular',
    
    // FAQ
    'faq.title': 'Frequently Asked Questions',
    'faq.subtitle': 'Everything you need to know about TransferGuard',
    
    // CTA
    'cta.title': 'Ready to Send with Legal Proof?',
    'cta.subtitle': 'Start your free trial today. No credit card required.',
    'cta.button': 'Create Free Account',
    
    // Footer
    'footer.product': 'Product',
    'footer.company': 'Company',
    'footer.legal': 'Legal',
    'footer.copyright': '© 2026 TransferGuard. A brand of PVG Technologies B.V. All Rights Reserved.',
    
    // Dashboard
    'dashboard.sentTransfers': 'Sent Transfers',
    'dashboard.certificates': 'Certificates',
    'dashboard.clientWorkspaces': 'Client Workspaces',
    'dashboard.uploadPortals': 'Upload Portals',
    'dashboard.billing': 'Billing & Credits',
    'dashboard.teamManagement': 'Team Management',
    'dashboard.contacts': 'Contacts',
    'dashboard.branding': 'Branding',
    'dashboard.profile': 'Profile',
    'dashboard.security': 'Security',
    'dashboard.newTransfer': 'New Transfer',
    'dashboard.workspace': 'Workspace',
    'dashboard.settings': 'Settings',
    'dashboard.logout': 'Log out',
    'dashboard.plan': 'Plan',
    'dashboard.loading': 'Loading...',
    'dashboard.checkingSubscription': 'Checking subscription...',
    
    // Branding Panel
    'branding.title': 'Custom Branding',
    'branding.description': 'Personalize your client-facing pages with your own brand identity',
    'branding.whereShown': 'Where is your branding displayed?',
    'branding.uploadPortal': 'Client Upload Portal',
    'branding.uploadPortalDesc': 'where clients upload files to you',
    'branding.clientWorkspaces': 'Client Workspaces',
    'branding.clientWorkspacesDesc': 'the secure environment for your recipients',
    'branding.downloadPages': 'Download Pages',
    'branding.downloadPagesDesc': 'where recipients download files',
    'branding.enableBranding': 'Enable Custom Branding',
    'branding.enableBrandingDesc': 'Show your branding on all client-facing pages',
    'branding.companyLogo': 'Company Logo',
    'branding.logoRecommendation': 'Recommended size: 200x60px, PNG or SVG with transparent background',
    'branding.uploadLogo': 'Click or drag to upload logo',
    'branding.backgroundWallpaper': 'Background Wallpaper',
    'branding.wallpaperRecommendation': 'Recommended size: 1920x1080px or larger, JPG or PNG',
    'branding.uploadWallpaper': 'Click or drag to upload wallpaper',
    'branding.brandColor': 'Brand Color',
    'branding.brandColorDesc': 'Used for buttons and accents on your branded pages',
    'branding.preview': 'Preview',
    'branding.downloadFiles': 'Download Files',
    'branding.saveSettings': 'Save Branding Settings',
    'branding.saving': 'Saving...',
    'branding.fileTooLarge': 'File size must be less than 5MB',
    'branding.onlyImages': 'Only image files are allowed',
    'branding.uploadSuccess': 'uploaded successfully',
    'branding.uploadFailed': 'Failed to upload',
    'branding.settingsSaved': 'Branding settings saved',
    'branding.saveFailed': 'Failed to save settings',
    
    // Client Workspaces
    'workspaces.title': 'Client Workspaces',
    'workspaces.subtitle': 'Secure dossier spaces for your clients with one-time identity verification',
    'workspaces.new': 'New Workspace',
    'workspaces.searchPlaceholder': 'Search by email or name...',
    'workspaces.noWorkspaces': 'No client workspaces yet',
    'workspaces.noWorkspacesDesc': 'Create a workspace for each client. After one-time identity verification, they can access all shared dossiers without re-verifying.',
    'workspaces.createFirst': 'Create First Workspace',
    'workspaces.verified': 'Verified',
    'workspaces.pendingVerification': 'Pending verification',
    'workspaces.dossiers': 'dossiers',
    'workspaces.files': 'files',
    'workspaces.new_badge': 'new',
    'workspaces.lastAccessed': 'Last accessed',
    'workspaces.created': 'Created',
    'workspaces.copyAccessLink': 'Copy access link',
    'workspaces.deleteWorkspace': 'Delete workspace',
    'workspaces.deleteConfirm': 'Are you sure you want to delete this workspace? All dossiers and files will be permanently deleted.',
    'workspaces.deleted': 'Workspace deleted',
    'workspaces.linkCopied': 'Access link copied to clipboard',
    'workspaces.createTitle': 'Create Client Workspace',
    'workspaces.createDesc': 'Create a secure workspace for your client. They will receive an access link and can verify their identity once to access all shared dossiers.',
    'workspaces.clientEmail': 'Client Email',
    'workspaces.clientName': 'Client Name (optional)',
    'workspaces.oneTimeVerification': 'One-time identity verification',
    'workspaces.verificationDesc': 'Your client will verify their identity once using iDIN or passport. After that, they can access the workspace anytime without re-verifying.',
    'workspaces.cancel': 'Cancel',
    'workspaces.creating': 'Creating...',
    'workspaces.create': 'Create Workspace',
    'workspaces.created_success': 'Client workspace created!',
    'workspaces.emailRequired': 'Email is required',
    'workspaces.emailExists': 'A workspace for this email already exists',
    'workspaces.loadFailed': 'Failed to load client workspaces',
    'workspaces.createFailed': 'Failed to create workspace',
    'workspaces.deleteFailed': 'Failed to delete workspace',
    
    // Workspace Detail Tabs
    'workspaces.tab.messages': 'Messages',
    'workspaces.tab.dossiers': 'Dossiers',
    'workspaces.tab.info': 'Info',
    'workspaces.manageDossiers': 'Manage Dossiers',
    'workspaces.identityVerified': 'Identity Verified',
    'workspaces.waitingVerification': 'Waiting for Verification',
    'workspaces.clientNotVerified': 'Client has not verified yet',
    'workspaces.accessLinkLabel': 'Access link for client',
    'workspaces.sendAccessLink': 'Send Access Link',
    
    // Workspace Messages
    'messages.newMessage': 'New message',
    'messages.search': 'Search...',
    'messages.count': 'messages',
    'messages.unread': 'unread',
    'messages.loading': 'Loading messages...',
    'messages.noMessages': 'No messages',
    'messages.noMessagesDesc': 'Start a conversation with your client by sending a message.',
    'messages.noSubject': '(No subject)',
    'messages.you': 'You',
    'messages.sender': 'Sender',
    'messages.client': 'Client',
    'messages.delete': 'Delete',
    'messages.writeReply': 'Write a reply...',
    'messages.to': 'To:',
    'messages.subjectOptional': 'Subject (optional)',
    'messages.writeMessage': 'Write your message...',
    'messages.send': 'Send',
    'messages.markAsRead': 'Mark as read',
    'messages.newReceived': 'New message received',
    'messages.sent': 'Message sent',
    'messages.deleted': 'Message deleted',
    'messages.emptyError': 'Message cannot be empty',
    'messages.sendFailed': 'Could not send message',
    'messages.deleteFailed': 'Could not delete message',
    'messages.yesterday': 'Yesterday',
    'messages.attachments': 'Attachments',
    'messages.addAttachment': 'Add attachment',
    'messages.selectDossier': 'Select dossier for attachments',
    'messages.noDossiers': 'Create a dossier first to add attachments',
    'messages.maxFiles': 'Maximum 10 files per message',
    'messages.uploading': 'Uploading...',
    'messages.uploadFailed': 'Could not upload file',
    'messages.removeFile': 'Remove',
    'messages.fileAdded': 'File added',
    'messages.filesAttached': 'files attached',
    
    // Billing
    'billing.title': 'Billing & Credits',
    'billing.noTeamFound': 'No team found',
    'billing.monthly': 'Monthly',
    'billing.totalMonthlyCost': 'Total monthly cost',
    'billing.base': 'base',
    'billing.extraSeats': 'extra seats',
    'billing.activeSeats': 'Active Seats',
    'billing.seatIncluded': 'seat included',
    'billing.idVerificationCredits': 'ID Verification Credits',
    'billing.perCredit': 'per credit',
    'billing.buyCredits': 'Buy Credits',
    'billing.addSeats': 'Add Seats',
    'billing.creditsLow': 'Credits running low',
    'billing.creditsLowDesc': 'Purchase more credits to continue sending identity-verified transfers.',
    'billing.buyNow': 'Buy Now',
    'billing.priceOverview': 'Price Overview',
    'billing.item': 'Item',
    'billing.price': 'Price',
    'billing.legalBase': 'Legal Base (1 seat included)',
    'billing.total': 'Total',
    'billing.month': 'month',
    'billing.invoiceHistory': 'Invoice History',
    'billing.invoiceNumber': 'Invoice Number',
    'billing.date': 'Date',
    'billing.description': 'Description',
    'billing.amount': 'Amount',
    'billing.paid': 'Paid',
    'billing.pending': 'Pending',
    'billing.failed': 'Failed',
    'billing.buyIdCredits': 'Buy ID Verification Credits',
    'billing.creditExplainer': 'Each identity-verified transfer costs 1 credit. Credits are shared with your entire team.',
    'billing.numberOfCredits': 'Number of Credits',
    'billing.totalExclVat': 'Total (excl. VAT)',
    'billing.currentBalance': 'Current balance',
    'billing.paymentViaStripe': 'Payment will be processed via Stripe (simulated)',
    'billing.cancel': 'Cancel',
    'billing.processing': 'Processing...',
    'billing.pay': 'Pay',
    'billing.addExtraSeats': 'Add Extra Seats',
    'billing.seatExplainer': 'Add extra seats to your Legal subscription. Each seat receives 10 ID verification credits per month.',
    'billing.numberOfSeats': 'Number of Seats',
    'billing.includedPerSeat': 'Included per seat',
    'billing.creditsPerMonth': 'credits/month',
    'billing.additionalMonthlyCost': 'Additional monthly cost',
    'billing.currentSeats': 'Current seats',
    'billing.subscriptionViaStripe': 'Subscription will be updated via Stripe (simulated)',
    'billing.addMonthly': 'Add +€{amount}/month',
    'billing.noTeamDesc': 'Create a team first to manage your subscription and credits.',
    'billing.createTeam': 'Create Team',
  },
  nl: {
    // Header
    'header.features': 'Functies',
    'header.pricing': 'Prijzen',
    'header.about': 'Over ons',
    'header.login': 'Inloggen',
    'header.signup': 'Gratis account aanmaken',
    'header.startTrial': 'Start gratis proefperiode',
    
    // Hero
    'hero.badge': 'Juridisch bewijs voor elke verzending',
    'hero.title.line1': 'Verstuur bestanden met',
    'hero.title.highlight': 'juridisch bewijs',
    'hero.title.line2': 'van ontvangst',
    'hero.subtitle': 'TransferGuard biedt geregistreerde bestandsoverdrachten met gecertificeerd bewijs van ontvangst. U weet precies wanneer en door wie uw documenten zijn ontvangen.',
    'hero.cta.primary': 'Start gratis proefperiode',
    'hero.cta.secondary': 'Bekijk hoe het werkt',
    'hero.noCreditCard': 'Geen creditcard nodig',
    'hero.trialDays': '14 dagen gratis proberen',
    
    // Stats
    'stats.files': 'Verzonden bestanden',
    'stats.countries': 'Landen',
    'stats.uptime': 'Uptime',
    'stats.support': 'Ondersteuning',
    
    // Features
    'features.title': 'Waarom TransferGuard?',
    'features.subtitle': 'Juridische zekerheid voor elke bestandsoverdracht',
    
    // Comparison
    'comparison.title': 'Het probleem dat wij oplossen',
    'comparison.theRisk': 'Het risico',
    'comparison.theSolution': 'De oplossing',
    
    // Identity Verification
    'identity.title': 'Identiteitsgeverifieerde levering',
    'identity.subtitle': 'Biometrische verificatie op juridisch niveau',
    
    // Pricing
    'pricing.title': 'Eenvoudige, transparante prijzen',
    'pricing.subtitle': 'Kies het abonnement dat bij u past',
    'pricing.professional': 'Professional',
    'pricing.legal': 'Legal',
    'pricing.perMonth': '/maand',
    'pricing.startTrial': 'Start 14 dagen gratis proefperiode',
    'pricing.popular': 'Meest populair',
    
    // FAQ
    'faq.title': 'Veelgestelde vragen',
    'faq.subtitle': 'Alles wat u moet weten over TransferGuard',
    
    // CTA
    'cta.title': 'Klaar om te versturen met juridisch bewijs?',
    'cta.subtitle': 'Start vandaag nog uw gratis proefperiode. Geen creditcard nodig.',
    'cta.button': 'Gratis account aanmaken',
    
    // Footer
    'footer.product': 'Product',
    'footer.company': 'Bedrijf',
    'footer.legal': 'Juridisch',
    'footer.copyright': '© 2026 TransferGuard. Een merk van PVG Technologies B.V. Alle rechten voorbehouden.',
    
    // Dashboard
    'dashboard.sentTransfers': 'Verzonden transfers',
    'dashboard.certificates': 'Certificaten',
    'dashboard.clientWorkspaces': 'Klantwerkruimtes',
    'dashboard.uploadPortals': 'Uploadportalen',
    'dashboard.billing': 'Facturatie & tegoed',
    'dashboard.teamManagement': 'Teambeheer',
    'dashboard.contacts': 'Contacten',
    'dashboard.branding': 'Huisstijl',
    'dashboard.profile': 'Profiel',
    'dashboard.security': 'Beveiliging',
    'dashboard.newTransfer': 'Nieuwe transfer',
    'dashboard.workspace': 'Werkruimte',
    'dashboard.settings': 'Instellingen',
    'dashboard.logout': 'Uitloggen',
    'dashboard.plan': 'Abonnement',
    'dashboard.loading': 'Laden...',
    'dashboard.checkingSubscription': 'Abonnement controleren...',
    
    // Branding Panel
    'branding.title': 'Eigen Huisstijl',
    'branding.description': 'Personaliseer uw klantgerichte pagina\'s met uw eigen huisstijl',
    'branding.whereShown': 'Waar wordt uw huisstijl getoond?',
    'branding.uploadPortal': 'Client Upload Portaal',
    'branding.uploadPortalDesc': 'waar klanten bestanden naar u uploaden',
    'branding.clientWorkspaces': 'Klantwerkruimtes',
    'branding.clientWorkspacesDesc': 'de beveiligde omgeving voor uw ontvangers',
    'branding.downloadPages': 'Downloadpagina\'s',
    'branding.downloadPagesDesc': 'waar ontvangers bestanden downloaden',
    'branding.enableBranding': 'Activeer Eigen Huisstijl',
    'branding.enableBrandingDesc': 'Toon uw huisstijl op alle klantgerichte pagina\'s',
    'branding.companyLogo': 'Bedrijfslogo',
    'branding.logoRecommendation': 'Aanbevolen formaat: 200x60px, PNG of SVG met transparante achtergrond',
    'branding.uploadLogo': 'Klik of sleep om logo te uploaden',
    'branding.backgroundWallpaper': 'Achtergrondafbeelding',
    'branding.wallpaperRecommendation': 'Aanbevolen formaat: 1920x1080px of groter, JPG of PNG',
    'branding.uploadWallpaper': 'Klik of sleep om achtergrond te uploaden',
    'branding.brandColor': 'Merkkleur',
    'branding.brandColorDesc': 'Wordt gebruikt voor knoppen en accenten op uw gepersonaliseerde pagina\'s',
    'branding.preview': 'Voorbeeld',
    'branding.downloadFiles': 'Bestanden downloaden',
    'branding.saveSettings': 'Huisstijl opslaan',
    'branding.saving': 'Opslaan...',
    'branding.fileTooLarge': 'Bestand moet kleiner zijn dan 5MB',
    'branding.onlyImages': 'Alleen afbeeldingen zijn toegestaan',
    'branding.uploadSuccess': 'succesvol geüpload',
    'branding.uploadFailed': 'Uploaden mislukt',
    'branding.settingsSaved': 'Huisstijl instellingen opgeslagen',
    'branding.saveFailed': 'Opslaan mislukt',
    
    // Client Workspaces
    'workspaces.title': 'Klantwerkruimtes',
    'workspaces.subtitle': 'Beveiligde dossierruimtes voor uw klanten met eenmalige identiteitsverificatie',
    'workspaces.new': 'Nieuwe werkruimte',
    'workspaces.searchPlaceholder': 'Zoeken op e-mail of naam...',
    'workspaces.noWorkspaces': 'Nog geen klantwerkruimtes',
    'workspaces.noWorkspacesDesc': 'Maak een werkruimte voor elke klant. Na eenmalige identiteitsverificatie hebben zij toegang tot alle gedeelde dossiers zonder opnieuw te verifiëren.',
    'workspaces.createFirst': 'Eerste werkruimte aanmaken',
    'workspaces.verified': 'Geverifieerd',
    'workspaces.pendingVerification': 'Wacht op verificatie',
    'workspaces.dossiers': 'dossiers',
    'workspaces.files': 'bestanden',
    'workspaces.new_badge': 'nieuw',
    'workspaces.lastAccessed': 'Laatst bezocht',
    'workspaces.created': 'Aangemaakt',
    'workspaces.copyAccessLink': 'Kopieer toegangslink',
    'workspaces.deleteWorkspace': 'Werkruimte verwijderen',
    'workspaces.deleteConfirm': 'Weet u zeker dat u deze werkruimte wilt verwijderen? Alle dossiers en bestanden worden permanent verwijderd.',
    'workspaces.deleted': 'Werkruimte verwijderd',
    'workspaces.linkCopied': 'Toegangslink gekopieerd naar klembord',
    'workspaces.createTitle': 'Klantwerkruimte aanmaken',
    'workspaces.createDesc': 'Maak een beveiligde werkruimte voor uw klant. Zij ontvangen een toegangslink en kunnen hun identiteit eenmalig verifiëren om toegang te krijgen tot alle gedeelde dossiers.',
    'workspaces.clientEmail': 'E-mail klant',
    'workspaces.clientName': 'Naam klant (optioneel)',
    'workspaces.oneTimeVerification': 'Eenmalige identiteitsverificatie',
    'workspaces.verificationDesc': 'Uw klant verifieert hun identiteit eenmalig via iDIN of paspoort. Daarna kunnen zij de werkruimte op elk moment bezoeken zonder opnieuw te verifiëren.',
    'workspaces.cancel': 'Annuleren',
    'workspaces.creating': 'Aanmaken...',
    'workspaces.create': 'Werkruimte aanmaken',
    'workspaces.created_success': 'Klantwerkruimte aangemaakt!',
    'workspaces.emailRequired': 'E-mail is verplicht',
    'workspaces.emailExists': 'Er bestaat al een werkruimte voor dit e-mailadres',
    'workspaces.loadFailed': 'Kon klantwerkruimtes niet laden',
    'workspaces.createFailed': 'Kon werkruimte niet aanmaken',
    'workspaces.deleteFailed': 'Kon werkruimte niet verwijderen',
    
    // Workspace Detail Tabs
    'workspaces.tab.messages': 'Berichten',
    'workspaces.tab.dossiers': 'Dossiers',
    'workspaces.tab.info': 'Info',
    'workspaces.manageDossiers': 'Beheer Dossiers',
    'workspaces.identityVerified': 'Identiteit Geverifieerd',
    'workspaces.waitingVerification': 'Wacht op Verificatie',
    'workspaces.clientNotVerified': 'Klant heeft nog niet geverifieerd',
    'workspaces.accessLinkLabel': 'Toegangslink voor klant',
    'workspaces.sendAccessLink': 'Stuur Toegangslink',
    
    // Workspace Messages
    'messages.newMessage': 'Nieuw bericht',
    'messages.search': 'Zoeken...',
    'messages.count': 'berichten',
    'messages.unread': 'ongelezen',
    'messages.loading': 'Berichten laden...',
    'messages.noMessages': 'Geen berichten',
    'messages.noMessagesDesc': 'Begin een gesprek met uw klant door een bericht te sturen.',
    'messages.noSubject': '(Geen onderwerp)',
    'messages.you': 'Jij',
    'messages.sender': 'Verzender',
    'messages.client': 'Klant',
    'messages.delete': 'Verwijderen',
    'messages.writeReply': 'Schrijf een antwoord...',
    'messages.to': 'Aan:',
    'messages.subjectOptional': 'Onderwerp (optioneel)',
    'messages.writeMessage': 'Schrijf je bericht...',
    'messages.send': 'Verzenden',
    'messages.markAsRead': 'Markeer als gelezen',
    'messages.newReceived': 'Nieuw bericht ontvangen',
    'messages.sent': 'Bericht verzonden',
    'messages.deleted': 'Bericht verwijderd',
    'messages.emptyError': 'Bericht mag niet leeg zijn',
    'messages.sendFailed': 'Kon bericht niet verzenden',
    'messages.deleteFailed': 'Kon bericht niet verwijderen',
    'messages.yesterday': 'Gisteren',
    'messages.attachments': 'Bijlagen',
    'messages.addAttachment': 'Bijlage toevoegen',
    'messages.selectDossier': 'Selecteer dossier voor bijlagen',
    'messages.noDossiers': 'Maak eerst een dossier aan om bijlagen toe te voegen',
    'messages.maxFiles': 'Maximaal 10 bestanden per bericht',
    'messages.uploading': 'Uploaden...',
    'messages.uploadFailed': 'Kon bestand niet uploaden',
    'messages.removeFile': 'Verwijderen',
    'messages.fileAdded': 'Bestand toegevoegd',
    'messages.filesAttached': 'bestanden bijgevoegd',
    
    // Billing
    'billing.title': 'Facturatie & Credits',
    'billing.noTeamFound': 'Geen team gevonden',
    'billing.monthly': 'Maandelijks',
    'billing.totalMonthlyCost': 'Totale maandkosten',
    'billing.base': 'basis',
    'billing.extraSeats': 'extra seats',
    'billing.activeSeats': 'Actieve Seats',
    'billing.seatIncluded': 'seat inbegrepen',
    'billing.idVerificationCredits': 'ID Verification Credits',
    'billing.perCredit': 'per credit',
    'billing.buyCredits': 'Koop Credits',
    'billing.addSeats': 'Voeg Seats Toe',
    'billing.creditsLow': 'Credits bijna op',
    'billing.creditsLowDesc': 'Koop extra credits om identity-verified transfers te blijven versturen.',
    'billing.buyNow': 'Koop Nu',
    'billing.priceOverview': 'Prijsoverzicht',
    'billing.item': 'Onderdeel',
    'billing.price': 'Prijs',
    'billing.legalBase': 'Legal Basis (1 seat inbegrepen)',
    'billing.total': 'Totaal',
    'billing.month': 'maand',
    'billing.invoiceHistory': 'Factuurgeschiedenis',
    'billing.invoiceNumber': 'Factuurnummer',
    'billing.date': 'Datum',
    'billing.description': 'Omschrijving',
    'billing.amount': 'Bedrag',
    'billing.paid': 'Betaald',
    'billing.pending': 'In behandeling',
    'billing.failed': 'Mislukt',
    'billing.buyIdCredits': 'ID Verification Credits Kopen',
    'billing.creditExplainer': 'Elke identity-verified transfer kost 1 credit. Credits worden gedeeld met je hele team.',
    'billing.numberOfCredits': 'Aantal Credits',
    'billing.totalExclVat': 'Totaal (excl. BTW)',
    'billing.currentBalance': 'Huidig saldo',
    'billing.paymentViaStripe': 'Betaling wordt verwerkt via Stripe (gesimuleerd)',
    'billing.cancel': 'Annuleren',
    'billing.processing': 'Verwerken...',
    'billing.pay': 'Betaal',
    'billing.addExtraSeats': 'Extra Seats Toevoegen',
    'billing.seatExplainer': 'Voeg extra seats toe aan je Legal abonnement. Elk seat krijgt 10 ID verification credits per maand.',
    'billing.numberOfSeats': 'Aantal Seats',
    'billing.includedPerSeat': 'Inclusief per seat',
    'billing.creditsPerMonth': 'credits/maand',
    'billing.additionalMonthlyCost': 'Extra maandkosten',
    'billing.currentSeats': 'Huidige seats',
    'billing.subscriptionViaStripe': 'Abonnement wordt bijgewerkt via Stripe (gesimuleerd)',
    'billing.addMonthly': '+€{amount}/maand toevoegen',
    'billing.noTeamDesc': 'Maak eerst een team aan om je abonnement en credits te beheren.',
    'billing.createTeam': 'Team Aanmaken',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Check localStorage first
    const saved = localStorage.getItem('language');
    if (saved === 'en' || saved === 'nl') return saved;
    
    // Check browser language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('nl')) return 'nl';
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string, fallback?: string): string => {
    return translations[language][key] || fallback || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Export translations for AI translation sync
export { translations };
