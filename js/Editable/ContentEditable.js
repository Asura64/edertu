import Trad from "../Trad";
import Controls from "./Controls";

export default class ContentEditable extends Controls
{
    /**
     * @param {Object} settings
     * @param {string} settings.lang
     */
    constructor(settings)
    {
        super();
        this.trad = Trad.get(settings.lang).editable.contentEditable;
        this.editableTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li'];
        this.addControls();
    }

    /**
     * @desc Bind events on element for edition management
     * @param {HTMLElement} element
     */
    addEditableEvents(element)
    {
        element._onhover = this._onEditableHover.bind(this, element);
        element.addEventListener('mouseover', element._onhover);
    }

    /**
     * @desc Remove events from editable element
     * @param {HTMLElement} element
     */
    removeEditableEvents(element)
    {
        element.removeEventListener('mouseover', element._onhover);
        this._hideControls();
    }

    /**
     * @desc Adds text edition controls
     */
    addControls()
    {
        //Align Left
        this.addControl('alignLeft', this._onControlClick.bind(this, 'alignLeft'));

        //Align Center
        this.addControl('alignCenter', this._onControlClick.bind(this, 'alignCenter'));

        //Align Right
        this.addControl('alignRight', this._onControlClick.bind(this, 'alignRight'));

        //Align Justify
        this.addControl('alignJustify', this._onControlClick.bind(this, 'alignJustify'));

        //Bold
        this.addControl('bold', this._onControlClick.bind(this, 'bold'), {fontWeight: 'bold'});

        //Italic
        this.addControl('italic', this._onControlClick.bind(this, 'italic'), {fontStyle: 'italic'});

        //Link
        this.addControl('link', this._onControlClick.bind(this, 'link'), {padding: '1px 0'});
    }

    /**
     * @desc Assign events by control name
     * @param {string} controlName
     * @private
     */
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
                const urlRegex = new RegExp('^https?://');
                let isValidUrl = false;
                let url = '';
                while (!isValidUrl) {
                    url = prompt('Entrez une adresse URL:', url);
                    if (!url) return;
                    isValidUrl = url.match(urlRegex);
                }
                document.execCommand('createLink', false, url);
                break;
        }
    }

    /**
     * @desc Replace html tag by another in selection (mainly to convert b to strong and i to em)
     * @param {string} tag
     * @param {string} replacementTag
     * @private
     */
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