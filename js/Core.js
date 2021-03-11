import DOM from "./DOM";
import Trad from "./Trad";
import ContentEditable from "./Editable/ContentEditable";
import ImageEditable from "./Editable/ImageEditable";

export default class Core
{
    /**
     * @param {string} id
     * @param {Object} settings
     * @param {string} settings.imageUpload
     * @param {string} settings.imageFolder
     * @param {string} settings.lang
     */
    constructor(id, settings = {})
    {
        this.active = false;
        settings = Object.assign({
            imageUpload: null,
            imageFolder: null,
            lang: 'en'
        }, settings);
        this.trad = Trad.get(settings.lang);
        this.contentEditable = new ContentEditable(settings);
        this.imageEditable = new ImageEditable(settings);

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', this.init.bind(this, id));
        } else {
            this.init(id);
        }
    }

    /**
     * @desc Prepare container by adding activation control
     * @param {string} id
     */
    init(id)
    {
        this.container = document.getElementById(id);
        if (!this.container) throw `DOM element with id "${id}" not found`;
        DOM.addStyles(this.container, {position: 'relative'});
        const toggler = DOM.createElement('button');
        toggler.innerText = this.trad.toggle.inactive;
        DOM.addStyles(toggler, {
            position: 'absolute',
            cursor: 'pointer',
            top: 0,
            right: 0
        });
        toggler.addEventListener('click', this.toggle.bind(this, toggler));
        this.container.appendChild(toggler);
        DOM.showOnApproch(toggler);
    }

    /**
     * @desc Activate / Deactivate edition mode for html content in container
     */
    toggle(toggler)
    {
        if (this.active) {
            this.active = false;
            toggler.innerHTML = this.trad.toggle.inactive;
            DOM.removeStyles(this.container, ['boxShadow']);
            this.disableEditable();
        } else {
            this.active = true;
            toggler.innerHTML = this.trad.toggle.active;
            DOM.addStyles(this.container, {boxShadow: '0 0 3px #CCC'});
            this.enableEditable();
        }
    }

    /**
     * @desc Activate editable behaviour and style on editable elements
     */
    enableEditable()
    {
        //contentEditable
        const editableTags = this.container.querySelectorAll(this.contentEditable.editableTags.join(','));
        [].slice.call(editableTags).forEach(editableTag => {
            editableTag.setAttribute('contenteditable', 'true');
            DOM.addStyles(editableTag, {boxShadow: 'inset 0px 0px 0px 1px #CCC'});
            this.contentEditable.addEditableEvents(editableTag);
        });

        //imageEditable
        const images = this.container.querySelectorAll('img');
        [].slice.call(images).forEach(image => {
            DOM.addStyles(image, {cursor: 'pointer', boxShadow: '3px 3px 3px #CCC'});
            this.imageEditable.addEditableEvents(image);
        });
    }

    /**
     * @desc Deactivate editable behaviour and style on editable elements
     */
    disableEditable()
    {
        //contentEditable
        const editableTags = this.container.querySelectorAll(this.contentEditable.editableTags.join(','));
        [].slice.call(editableTags).forEach(editableTag => {
            editableTag.removeAttribute('contenteditable');
            DOM.removeStyles(editableTag, ['boxShadow']);
            this.contentEditable.removeEditableEvents(editableTag);
        });

        //imageEditable
        const images = this.container.querySelectorAll('img');
        [].slice.call(images).forEach(image => {
            DOM.removeStyles(image, ['cursor', 'boxShadow']);
            this.imageEditable.removeEditableEvents(image);
        });
    }
}