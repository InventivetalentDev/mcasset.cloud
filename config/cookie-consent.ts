// Configuration for the self-hosted cookie consent banner (public/js/cookie-consent.min.js).
// nuxt.config.ts serialises this object into an inline <script> in the SSR <head>, so it must stay plain JSON:
// strings, numbers, booleans, arrays and objects only (no functions, no RegExp).
//
// In GDPR regions (EEA, UK, CH) Google's consent message ("Privacy & messaging", delivered with AdSense) is the only
// consent dialog: the library reads the visitor's choice from it through the IAB TCF API (`tcf.enabled`) and hides
// its own banner. Everywhere else the library shows its own banner.

type Text = { en: string, de: string, es: string, fr: string, hi: string, id: string }

const cookie = (name: string, provider: string, duration: string, description: Text) => ({ name, provider, duration, description })

const adDelivery: Text = {
    en: 'Ad delivery: limits how often you see an ad and measures ad performance.',
    de: 'Werbeauslieferung: begrenzt, wie oft Sie eine Anzeige sehen, und misst die Anzeigenleistung.',
    es: 'Publicidad: limita cuántas veces ves un anuncio y mide su rendimiento.',
    fr: 'Publicité : limite la fréquence d\'affichage d\'une annonce et mesure ses performances.',
    hi: 'विज्ञापन: तय करता है कि आप कोई विज्ञापन कितनी बार देखें और उसके प्रदर्शन को मापता है।',
    id: 'Iklan: membatasi seberapa sering Anda melihat iklan dan mengukur kinerjanya.'
}

export const cookieConsentConfig = {
    // Same cookie name and format as CookieScript, so earlier choices carry over.
    cookie: { name: 'CookieScriptConsent' },
    links: { privacy: 'https://legal.inventivetalent.org/privacy' },
    tcf: { enabled: true },
    ui: { theme: 'dark' },
    categories: {
        strict: {
            required: true,
            cookies: [
                cookie('CookieScriptConsent', 'mcasset.cloud', '1 year', {
                    en: 'Stores your cookie choice.',
                    de: 'Speichert Ihre Cookie-Auswahl.',
                    es: 'Guarda tu elección sobre las cookies.',
                    fr: 'Enregistre votre choix concernant les cookies.',
                    hi: 'कुकीज़ के बारे में आपकी पसंद सहेजता है।',
                    id: 'Menyimpan pilihan cookie Anda.'
                }),
                cookie('FCCDCF', 'Google', '13 months', {
                    en: 'Stores your choice in Google\'s consent message (EEA, UK, Switzerland).',
                    de: 'Speichert Ihre Auswahl in Googles Einwilligungsdialog (EWR, UK, Schweiz).',
                    es: 'Guarda tu elección en el mensaje de consentimiento de Google (EEE, Reino Unido, Suiza).',
                    fr: 'Enregistre votre choix dans le message de consentement de Google (EEE, Royaume-Uni, Suisse).',
                    hi: 'Google के सहमति संदेश में आपकी पसंद सहेजता है (EEA, UK, स्विट्ज़रलैंड)।',
                    id: 'Menyimpan pilihan Anda di pesan persetujuan Google (EEA, Inggris, Swiss).'
                }),
                cookie('settings', 'mcasset.cloud', '7 days', {
                    en: 'Remembers settings you change on the site, such as "Show Snapshots".',
                    de: 'Merkt sich Einstellungen, die Sie auf der Seite ändern, z. B. „Show Snapshots“.',
                    es: 'Recuerda los ajustes que cambias en el sitio, como «Show Snapshots».',
                    fr: 'Mémorise les réglages que vous modifiez sur le site, comme « Show Snapshots ».',
                    hi: 'साइट पर आपकी बदली गई सेटिंग याद रखता है, जैसे "Show Snapshots"।',
                    id: 'Mengingat pengaturan yang Anda ubah di situs, seperti "Show Snapshots".'
                })
            ]
        },
        functionality: {},
        performance: {
            // Table rows double as the patterns cleared when the category is withdrawn (glob: `*`).
            cookies: [
                cookie('_ga', 'Google Analytics', '2 years', {
                    en: 'Distinguishes visitors for anonymous usage statistics.',
                    de: 'Unterscheidet Besucher für anonyme Nutzungsstatistiken.',
                    es: 'Distingue a los visitantes para estadísticas de uso anónimas.',
                    fr: 'Distingue les visiteurs pour des statistiques d\'utilisation anonymes.',
                    hi: 'गुमनाम उपयोग आँकड़ों के लिए विज़िटर्स में अंतर करता है।',
                    id: 'Membedakan pengunjung untuk statistik penggunaan anonim.'
                }),
                cookie('_ga_*', 'Google Analytics', '2 years', {
                    en: 'Keeps the state of the current visit.',
                    de: 'Speichert den Zustand des aktuellen Besuchs.',
                    es: 'Guarda el estado de la visita actual.',
                    fr: 'Conserve l\'état de la visite en cours.',
                    hi: 'मौजूदा विज़िट की स्थिति सहेजता है।',
                    id: 'Menyimpan status kunjungan saat ini.'
                })
            ]
        },
        targeting: {
            cookies: [
                cookie('__gads', 'Google AdSense', '13 months', adDelivery),
                cookie('__gpi', 'Google AdSense', '13 months', adDelivery),
                cookie('__eoi', 'Google AdSense', '6 months', {
                    en: 'Ad security and fraud prevention.',
                    de: 'Sicherheit der Werbung und Betrugsprävention.',
                    es: 'Seguridad publicitaria y prevención del fraude.',
                    fr: 'Sécurité publicitaire et prévention de la fraude.',
                    hi: 'विज्ञापन सुरक्षा और धोखाधड़ी की रोकथाम।',
                    id: 'Keamanan iklan dan pencegahan penipuan.'
                })
            ]
        }
    },
    // English and German are built in.
    translations: {
        es: {
            title: 'Usamos cookies',
            description: 'Usamos cookies para que este sitio funcione, para medir cómo se usa y, con tu permiso, para mostrarte contenido relevante. Puedes cambiar tu elección en cualquier momento.',
            acceptAll: 'Aceptar todo',
            rejectAll: 'Rechazar todo',
            settings: 'Ajustes',
            save: 'Guardar preferencias',
            close: 'Cerrar',
            alwaysActive: 'Siempre activas',
            privacyPolicy: 'Política de privacidad',
            cookiePolicy: 'Política de cookies',
            settingsTitle: 'Ajustes de cookies',
            settingsDescription: 'Elige qué categorías de cookies permites. Las cookies estrictamente necesarias siempre están activas porque el sitio no funciona sin ellas.',
            manage: 'Ajustes de cookies',
            blockedContent: 'Este contenido está bloqueado hasta que aceptes las cookies de {category}.',
            blockedAccept: 'Aceptar y cargar',
            cookieName: 'Nombre',
            cookieProvider: 'Proveedor',
            cookieDuration: 'Duración',
            cookieDescription: 'Descripción',
            categories: {
                strict: { title: 'Estrictamente necesarias', description: 'Necesarias para que el sitio funcione, por ejemplo para recordar tu elección sobre las cookies.' },
                functionality: { title: 'Funcionalidad', description: 'Recuerdan tus elecciones (como el idioma o la región) y ofrecen funciones mejoradas y más personales.' },
                performance: { title: 'Estadísticas', description: 'Nos ayudan a entender cómo se usa el sitio mediante estadísticas de uso anónimas.' },
                targeting: { title: 'Marketing', description: 'Se usan para mostrarte publicidad relevante y medir la eficacia de los anuncios.' },
                unclassified: { title: 'Sin clasificar', description: 'Cookies que aún estamos clasificando junto con sus proveedores.' }
            }
        },
        fr: {
            title: 'Nous utilisons des cookies',
            description: 'Nous utilisons des cookies pour faire fonctionner ce site, mesurer son utilisation et, avec votre accord, vous montrer du contenu pertinent. Vous pouvez modifier votre choix à tout moment.',
            acceptAll: 'Tout accepter',
            rejectAll: 'Tout refuser',
            settings: 'Paramètres',
            save: 'Enregistrer mes choix',
            close: 'Fermer',
            alwaysActive: 'Toujours actifs',
            privacyPolicy: 'Politique de confidentialité',
            cookiePolicy: 'Politique relative aux cookies',
            settingsTitle: 'Paramètres des cookies',
            settingsDescription: 'Choisissez les catégories de cookies que vous autorisez. Les cookies strictement nécessaires sont toujours actifs, car le site ne fonctionne pas sans eux.',
            manage: 'Paramètres des cookies',
            blockedContent: 'Ce contenu est bloqué tant que vous n\'acceptez pas les cookies « {category} ».',
            blockedAccept: 'Accepter et charger',
            cookieName: 'Nom',
            cookieProvider: 'Fournisseur',
            cookieDuration: 'Durée',
            cookieDescription: 'Description',
            categories: {
                strict: { title: 'Strictement nécessaires', description: 'Indispensables au fonctionnement du site, par exemple pour mémoriser votre choix concernant les cookies.' },
                functionality: { title: 'Fonctionnalité', description: 'Mémorisent vos choix (comme la langue ou la région) et offrent des fonctions améliorées et plus personnelles.' },
                performance: { title: 'Statistiques', description: 'Nous aident à comprendre comment le site est utilisé grâce à des statistiques d\'utilisation anonymes.' },
                targeting: { title: 'Marketing', description: 'Servent à vous montrer des publicités pertinentes et à mesurer leur efficacité.' },
                unclassified: { title: 'Non classés', description: 'Cookies que nous sommes encore en train de classer avec leurs fournisseurs.' }
            }
        },
        hi: {
            title: 'हम कुकीज़ का उपयोग करते हैं',
            description: 'हम इस साइट को चलाने, इसके उपयोग को मापने और आपकी अनुमति से आपको प्रासंगिक सामग्री दिखाने के लिए कुकीज़ का उपयोग करते हैं। आप अपनी पसंद कभी भी बदल सकते हैं।',
            acceptAll: 'सभी स्वीकार करें',
            rejectAll: 'सभी अस्वीकार करें',
            settings: 'सेटिंग्स',
            save: 'पसंद सहेजें',
            close: 'बंद करें',
            alwaysActive: 'हमेशा सक्रिय',
            privacyPolicy: 'गोपनीयता नीति',
            cookiePolicy: 'कुकी नीति',
            settingsTitle: 'कुकी सेटिंग्स',
            settingsDescription: 'चुनें कि आप किन श्रेणियों की कुकीज़ की अनुमति देते हैं। ज़रूरी कुकीज़ हमेशा सक्रिय रहती हैं, क्योंकि उनके बिना साइट काम नहीं करती।',
            manage: 'कुकी सेटिंग्स',
            blockedContent: 'यह सामग्री तब तक ब्लॉक है जब तक आप {category} कुकीज़ स्वीकार नहीं करते।',
            blockedAccept: 'स्वीकार करें और लोड करें',
            cookieName: 'नाम',
            cookieProvider: 'प्रदाता',
            cookieDuration: 'अवधि',
            cookieDescription: 'विवरण',
            categories: {
                strict: { title: 'ज़रूरी', description: 'साइट के काम करने के लिए आवश्यक, जैसे कुकीज़ के बारे में आपकी पसंद याद रखना।' },
                functionality: { title: 'कार्यक्षमता', description: 'आपकी पसंद (जैसे भाषा या क्षेत्र) याद रखती हैं और बेहतर, अधिक व्यक्तिगत सुविधाएँ देती हैं।' },
                performance: { title: 'आँकड़े', description: 'गुमनाम उपयोग आँकड़ों से हमें यह समझने में मदद करती हैं कि साइट का उपयोग कैसे होता है।' },
                targeting: { title: 'मार्केटिंग', description: 'आपको प्रासंगिक विज्ञापन दिखाने और विज्ञापनों का असर मापने के लिए उपयोग होती हैं।' },
                unclassified: { title: 'अवर्गीकृत', description: 'ऐसी कुकीज़ जिन्हें हम अभी उनके प्रदाताओं के साथ वर्गीकृत कर रहे हैं।' }
            }
        },
        id: {
            title: 'Kami menggunakan cookie',
            description: 'Kami menggunakan cookie agar situs ini berfungsi, untuk mengukur penggunaannya, dan dengan izin Anda, untuk menampilkan konten yang relevan. Anda dapat mengubah pilihan kapan saja.',
            acceptAll: 'Terima semua',
            rejectAll: 'Tolak semua',
            settings: 'Pengaturan',
            save: 'Simpan pilihan',
            close: 'Tutup',
            alwaysActive: 'Selalu aktif',
            privacyPolicy: 'Kebijakan privasi',
            cookiePolicy: 'Kebijakan cookie',
            settingsTitle: 'Pengaturan cookie',
            settingsDescription: 'Pilih kategori cookie yang Anda izinkan. Cookie yang benar-benar diperlukan selalu aktif karena situs tidak berfungsi tanpanya.',
            manage: 'Pengaturan cookie',
            blockedContent: 'Konten ini diblokir sampai Anda menerima cookie {category}.',
            blockedAccept: 'Terima dan muat',
            cookieName: 'Nama',
            cookieProvider: 'Penyedia',
            cookieDuration: 'Durasi',
            cookieDescription: 'Deskripsi',
            categories: {
                strict: { title: 'Benar-benar diperlukan', description: 'Diperlukan agar situs berfungsi, misalnya untuk mengingat pilihan cookie Anda.' },
                functionality: { title: 'Fungsionalitas', description: 'Mengingat pilihan Anda (seperti bahasa atau wilayah) dan menyediakan fitur yang lebih baik dan personal.' },
                performance: { title: 'Statistik', description: 'Membantu kami memahami cara situs digunakan melalui statistik penggunaan anonim.' },
                targeting: { title: 'Pemasaran', description: 'Digunakan untuk menampilkan iklan yang relevan dan mengukur efektivitas iklan.' },
                unclassified: { title: 'Belum diklasifikasikan', description: 'Cookie yang masih kami klasifikasikan bersama penyedianya.' }
            }
        }
    }
}

// Dark Vuetify theme colours for the banner. Set on #ccd-root: the library defines its theme variables on that
// element, so overrides on :root would not apply.
export const cookieConsentCss = '#ccd-root.ccd{--ccd-bg:#212121;--ccd-fg:#fff;--ccd-muted:rgba(255,255,255,.7);--ccd-border:rgba(255,255,255,.12);'
    + '--ccd-primary:#2196F3;--ccd-primary-fg:#fff;--ccd-secondary:#424242;--ccd-secondary-fg:#fff;--ccd-toggle:#2196F3;'
    + '--ccd-radius:4px;--ccd-font:Roboto,system-ui,-apple-system,"Segoe UI",sans-serif}'

// Inline init for the SSR <head>. Runs once, and does nothing if the library file was blocked (filter lists).
export const cookieConsentInit = '(function(){if(window.__ccdInit||!window.CookieConsent)return;window.__ccdInit=true;CookieConsent.init('
    + JSON.stringify(cookieConsentConfig).replace(/</g, '\\u003c') + ')})();'
