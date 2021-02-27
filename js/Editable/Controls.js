/**
 * @callback onClick
 */

import DOM from "../DOM";

export default class Controls
{
    constructor()
    {
        this.controls = document.getElementById('edertu-editable-controls');
        this.trad = {};
        this.activeEditable = null;
        if (!this.controls) {
            this.controls = DOM.createElement('div');
            this.controls.id = 'edertu-editable-controls';
            DOM.addStyles(this.controls, {
                position: 'absolute',
                display: 'flex',
            });
            this._hideControls();
            const body = document.querySelector('body');
            body.appendChild(this.controls);
        }
    }

    /**
     * @desc Hide controls out of the page
     * @private
     */
    _hideControls()
    {
        DOM.addStyles(this.controls, {
            left: 0,
            top: '-50px'
        });
    }

    /**
     * @desc Add control button
     * @param {string} name
     * @param {onClick} onClick
     * @param {Object} styles
     */
    addControl(name, onClick, styles = null)
    {
        const control = this._createControl(name, onClick);
        control.classList.add('edertu-editable-control');
        control.classList.add(this.constructor.name);
        DOM.addStyles(control, styles ? styles : {padding: '0 2px'});
        this.controls.appendChild(control);
    }

    /**
     * @desc Build control
     * @param {string} controlName
     * @param {onClick} onClick
     * @return {HTMLElement}
     * @private
     */
    _createControl(controlName, onClick)
    {
        const control = DOM.createElement('button');
        DOM.addStyles(control, {
            cursor: 'pointer',
            width: '26px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 1px'
        });
        const symbol = this.trad[controlName].symbol;
        const text = this.trad[controlName].text;
        if (symbol.match('\.(png|jpe?g)$')) {
            const img = DOM.createElement('img');
            img.src = symbol;
            img.alt = text;
            DOM.addStyles(img, {width: '100%'});
            control.appendChild(img);
        } else {
            control.innerText = symbol;
        }
        control.setAttribute('title', text);
        control.addEventListener('click', onClick);
        return control;
    }

    /**
     * @desc Binds controls to element
     * @param {HTMLElement} element
     * @private
     */
    _onEditableHover(element)
    {
        this.activeEditable = element;
        element.click();
        const bcr = element.getBoundingClientRect();
        const controls = [].slice.call(this.controls.querySelectorAll('.edertu-editable-control'));
        controls.forEach(control => {control.style.display = control.classList.contains(this.constructor.name) ? 'block' : 'none'});
        DOM.addStyles(this.controls, {
            top: Math.max(window.pageYOffset + bcr.top - 26, 0) + 'px',
            left: bcr.left + 'px',
        });
    }
}