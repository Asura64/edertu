import DOM from "./DOM";
import Trad from "./Trad";
import ContentEditable from "./Editable/ContentEditable";

export default class Core
{
    /**
     * @param {string} id
     * @param {Object} options
     * @param {string} options.lang
     */
    constructor(id, options = {})
    {
        this.active = false;
        Object.assign({
            lang: 'en'
        }, options);
        this.trad = new Trad(options.lang);
        this.contentEditable = new ContentEditable(this.trad);

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
        toggler.innerText = this.trad.control.toggle.inactive;
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
            toggler.innerHTML = this.trad.control.toggle.inactive;
            DOM.removeStyles(this.container, ['boxShadow']);
            this.disableEditableTags();
        } else {
            this.active = true;
            toggler.innerHTML = this.trad.control.toggle.active;
            DOM.addStyles(this.container, {boxShadow: '0 0 3px #CCC'});
            this.enableEditableTags();
        }
    }

    enableEditableTags()
    {
        const editableTags = this.container.querySelectorAll(this.contentEditable.editableTags.join(','));
        [].slice.call(editableTags).forEach(editableTag => {
            editableTag.setAttribute('contenteditable', 'true');
            DOM.addStyles(editableTag, {boxShadow: 'inset 0px 0px 0px 1px #CCC'});
            this.contentEditable.addEditableEvents(editableTag);
        });
    }

    disableEditableTags()
    {
        const editableTags = this.container.querySelectorAll(this.contentEditable.editableTags.join(','));
        [].slice.call(editableTags).forEach(editableTag => {
            editableTag.removeAttribute('contenteditable');
            DOM.removeStyles(editableTag, ['boxShadow']);
            this.contentEditable.removeEditableEvents(editableTag);
        });
    }
}