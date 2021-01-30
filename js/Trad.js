export default class Trad
{
    constructor(lang = 'en') {
        const supportedLanguages = ['en', 'fr'];
        if (supportedLanguages.indexOf(lang) === -1) throw `Language ${lang} not supported. Supported Languages: `+supportedLanguages.join(',');
        this.lang = lang;
    }

    get control()
    {
        const texts = {
            en: {
                toggle: {active: 'Deactivate', inactive: 'Activate'}
            },
            fr: {
                toggle: {active: 'Désactiver', inactive: 'Activer'}
            }
        }

        return texts[this.lang];
    }
}