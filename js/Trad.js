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
                toggle: {active: 'Deactivate', inactive: 'Activate'},
                editable: {
                    contentEditable: {
                        alignLeft: {
                            text: 'Align Left',
                            symbol: './resources/align-left.png',
                        },
                        alignCenter: {
                            text: 'Align Center',
                            symbol: './resources/align-center.png',
                        },
                        alignRight: {
                            text: 'Align Right',
                            symbol: './resources/align-right.png',
                        },
                        alignJustify: {
                            text: 'Align Justify',
                            symbol: './resources/align-justify.png',
                        },
                        bold: {
                            text: 'Bold',
                            symbol: 'B',
                        },
                        italic: {
                            text: 'Italic',
                            symbol: 'I',
                        },
                        link: {
                            text: 'Link',
                            symbol: '🔗',
                        }
                    }
                }
            },
            fr: {
                toggle: {active: 'Désactiver', inactive: 'Activer'},
                editable: {
                    contentEditable: {
                        alignLeft: {
                            text: 'Alignement à gauche',
                            symbol: './resources/align-left.png',
                        },
                        alignCenter: {
                            text: 'Alignement au centre',
                            symbol: './resources/align-center.png',
                        },
                        alignRight: {
                            text: 'Alignement à droite',
                            symbol: './resources/align-right.png',
                        },
                        alignJustify: {
                            text: 'Alignement justifié',
                            symbol: './resources/align-justify.png',
                        },
                        bold: {
                            text: 'Gras',
                            symbol: 'G',
                        },
                        italic: {
                            text: 'Italique',
                            symbol: 'I',
                        },
                        link: {
                            text: 'Lien',
                            symbol: '🔗',
                        }
                    }
                }
            }
        }

        return texts[this.lang];
    }
}