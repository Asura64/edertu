import DOM from "../DOM";

export default class ContentEditable
{
    /**
     * @param {Trad} trad
     */
    constructor(trad)
    {
        this.trad = trad;
        this.editableTags = ['h1', 'h2', 'h3', 'p', 'li'];
        this.activeEditable = null;
    }

    /**
     * @desc Bind events on element for edition management
     * @param {HTMLElement} element
     */
    addEditableEvents(element)
    {
        element._onclick = this._onEditableClick.bind(this, element);
        element.addEventListener('click', element._onclick);
    }

    /**
     * @desc Remove events from editable element
     * @param {HTMLElement} element
     */
    removeEditableEvents(element)
    {
        element.removeEventListener('click', element._onclick);
        DOM.addStyles(this._getControls(), {
            left: 0,
            top: '-50px'
        });
    }

    _onEditableClick(element)
    {
        this.activeEditable = element;
        const bcr = element.getBoundingClientRect();
        let controls = this._getControls();
        DOM.addStyles(controls, {
            top: (bcr.top - 26) + 'px',
            left: bcr.left + 'px',
        });
    }


    _getControls()
    {
        let controls = document.getElementById('edertu-contenteditable-controls');
        if (!controls) {
            controls = DOM.createElement('div');
            controls.id = 'edertu-contenteditable-controls';
            DOM.addStyles(controls, {
                position: 'absolute',
                display: 'flex',
                left: 0,
                top: '-50px'
            });
            DOM.showOnApproch(controls);

            //Align Left
            const alignLeft = this._createControl('alignLeft');
            DOM.addStyles(alignLeft, {padding: '0 2px'});
            controls.appendChild(alignLeft);

            //Align Center
            const alignCenter = this._createControl('alignCenter');
            DOM.addStyles(alignCenter, {padding: '0 2px'});
            controls.appendChild(alignCenter);

            //Align Right
            const alignRight = this._createControl('alignRight');
            DOM.addStyles(alignRight, {padding: '0 2px'});
            controls.appendChild(alignRight);

            //Align Justify
            const alignJustify = this._createControl('alignJustify');
            DOM.addStyles(alignJustify, {padding: '0 2px'});
            controls.appendChild(alignJustify);

            //Bold
            const bold = this._createControl('bold');
            DOM.addStyles(bold, {fontWeight: 'bold'});
            controls.appendChild(bold);

            //Italic
            const italic = this._createControl('italic');
            DOM.addStyles(italic, {fontStyle: 'italic'});
            controls.appendChild(italic);

            //Link
            const link = this._createControl('link');
            DOM.addStyles(link, {padding: '1px 0'});
            controls.appendChild(link);

            const body = document.querySelector('body');
            body.appendChild(controls);
        }
        return controls;
    }

    _createControl(controlName)
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
        const symbol = this.trad.control.editable.contentEditable[controlName].symbol;
        const text = this.trad.control.editable.contentEditable[controlName].text;
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
        control.addEventListener('click', this._onControlClick.bind(this, controlName));
        return control;
    }

    _onControlClick(controlName)
    {
        switch (controlName) {
            case 'alignLeft':
                this.activeEditable.style.textAlign = this.activeEditable.style.textAlign === 'left' ? null : 'left';
                break;
            case 'alignCenter':
                this.activeEditable.style.textAlign = this.activeEditable.style.textAlign === 'center' ? null : 'center';
                break;
            case 'alignRight':
                this.activeEditable.style.textAlign = this.activeEditable.style.textAlign === 'right' ? null : 'right';
                break;
            case 'alignJustify':
                this.activeEditable.style.textAlign = this.activeEditable.style.textAlign === 'justify' ? null : 'justify';
                break;
            case 'bold':
                document.execCommand('bold', false, '');
                this._replaceInSelection('b', 'strong');
                break;
            case 'italic':
                document.execCommand('italic', false, '');
                this._replaceInSelection('i', 'em');
                break;
            case 'link':
                //TODO: create popup to ask user for link url
                document.execCommand('createLink', false, 'https://developer.mozilla.org/fr/docs/Web/API/Document/execCommand');
                break;
        }
    }

    _replaceInSelection(tag, replacementTag)
    {
        if (window.getSelection) {
            let parentNode = window.getSelection().anchorNode.parentNode;
            let openTagRegex = new RegExp('<'+tag+'>');
            let closeTagRegex = new RegExp('</'+tag+'>');
            let text = parentNode.outerHTML;
            text = text.replace(openTagRegex, '<'+replacementTag+'>');
            text = text.replace(closeTagRegex, '</'+replacementTag+'>');
            parentNode.outerHTML = text;
        }
    }
}