/**
 * @callback onClick
 */

import DOM from "./DOM";

export default class Popup
{
    constructor()
    {
        this.title = undefined;
        this.content = [];
        this.button = undefined;
        this.firstField = undefined;

        if (!DOM.HEAD.hasStyle('edertu-popup')) {
            DOM.HEAD.addStyles(this._getHeadStyle(), 'edertu-popup');
        }

        this.popup = DOM.createElement('div', 'edertu-popup');

        this.popupContainer = DOM.createElement('div');
        DOM.addStyles(this.popupContainer, {
            backgroundColor: 'white',
            borderRadius: '.5rem'
        });

        this.popup.appendChild(this.popupContainer);

        this.popup.addEventListener('click', this.destroy.bind(this));
        this.popupContainer.addEventListener('click', e => e.stopPropagation());

        return this;
    }

    /**
     * @desc Append title to popup
     * @param {string} title
     * @return {Popup}
     */
    withTitle(title)
    {
        this.title = DOM.createElement('div', 'edertu-popup__heading');
        this.title.innerText = title;
        return this;
    }

    /**
     * @desc Append content to popup
     * @param {string|HTMLElement} content
     * @return {Popup}
     */
    withContent(content)
    {
        const contentElt = DOM.createElement('div', 'edertu-popup__content');
        if (content instanceof HTMLElement) {
            contentElt.appendChild(content);
        } else {
            contentElt.innerText = content;
        }
        this.content.push(contentElt);
        return this;
    }

    /**
     * @desc Append input field to popup
     * @param {string} id
     * @param {string} label
     * @param {string} type
     * @param {string} value
     * @return {Popup}
     */
    withField(id, label, type= 'text', value = '')
    {
        const inputElt = DOM.createElement('input');
        if (!this.firstField) this.firstField = inputElt;
        inputElt.id = id;
        inputElt.setAttribute('type', type);
        inputElt.value = value;
        const labelElt = DOM.createElement('label');
        labelElt.innerText = label;
        labelElt.setAttribute('for', id);
        const formGroup = DOM.createElement('div', 'edertu-popup__form-group');
        formGroup.appendChild(labelElt);
        formGroup.appendChild(inputElt);
        this.content.push(formGroup);
        return this;
    }

    /**
     * @desc Append action button to popup
     * @param {string} text
     * @param {onClick} onclick Callback to execute on button click
     * @return {Popup}
     */
    withButton(text, onclick)
    {
        this.button = DOM.createElement('button', 'edertu-popup__button');
        this.button.innerText = text;
        this.button.addEventListener('click', onclick);
        return this;
    }

    /**
     * @desc Display popup
     */
    display()
    {
        if (this.title) this.popupContainer.appendChild(this.title);
        this.content.forEach(content => this.popupContainer.appendChild(content));
        if (this.button) {
            this.popupContainer.appendChild(this.button);
            const inputs = [].slice.call(this.popupContainer.querySelectorAll('input'));
            inputs.forEach(input => input.addEventListener('keyup', e => {if (e.keyCode === 13) this.button.click()}));
        }
        document.querySelector('body').appendChild(this.popup);
        if (this.firstField) this.firstField.focus();
    }

    /**
     * @desc Remove popup
     */
    destroy()
    {
        this.popup.parentNode.removeChild(this.popup);
    }

    /**
     * @desc Provides CSS style for popup
     * @return Object
     * @private
     */
    _getHeadStyle()
    {
        return {
            '.edertu-popup': {
                'position': 'fixed',
                'top': 0,
                'left': 0,
                'width': '100vw',
                'height': '100vh',
                'display': 'flex',
                'justify-content': 'center',
                'align-items': 'center',
                'background-color': 'rgba(0,0,0,.7)',
            },
            '.edertu-popup__heading': {
                'font-size': '1.5rem',
                'padding': '2px 4px',
                'margin-bottom': '8px',
            },
            '.edertu-popup__content': {
                'padding': '2px 4px',
            },
            '.edertu-popup__form-group': {
                'display': 'flex',
                'padding': '2px 4px',
                'justify-content': 'space-between',
            },
            '.edertu-popup__form-group input': {
                'margin-left': '4px',
            },
            '.edertu-popup__button': {
                'float': 'right',
                'margin': '4px',
                'color': '#fff',
                'background-color': '#007bff',
                'display': 'inline-block',
                'font-weight': '400',
                'text-align': 'center',
                'white-space': 'nowrap',
                'vertical-align': 'middle',
                'border': '1px solid #007bff',
                'padding': '.375rem .75rem',
                'border-radius': '.25rem',
                'transition': 'all .15s ease-in-out',
                'cursor': 'pointer',
            },
            '.edertu-popup__button:hover': {
                'color': '#fff',
                'background-color': '#0069d9',
                'border-color': '#0062cc',
            },
            '.edertu-popup__image-collection': {
                'display': 'flex'
            },
            '.edertu-popup__image-collection .image': {
                'padding': '8px',
                'border-radius': '.25rem',
                'margin': '4px',
                'cursor': 'pointer',
                'display': 'flex',
                'width': '70px',
                'height': '70px',
                'justify-content': 'center',
                'align-items': 'center',
                'overflow': 'hidden',
            },
            '.edertu-popup__image-collection .image:hover': {
                'box-shadow': '0 0 3px black',
            },
            '.edertu-popup__image-collection .image img': {
                'width': '100%',
            }
        }
    }
}