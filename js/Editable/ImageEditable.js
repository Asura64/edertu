import Trad from "../Trad";
import Controls from "./Controls";
import DOM from "../DOM";

export default class ImageEditable extends Controls
{
    /**
     * @param {Object} settings
     * @param {string} settings.imageUpload
     * @param {string} settings.lang
     */
    constructor(settings) {
        super();
        this.imageUpload = settings.imageUpload;
        this.trad = Trad.get(settings.lang).editable.imageEditable;
        this.addControls();
        const inputFile = DOM.createElement('input');
        DOM.addStyles(inputFile, {display: 'none'});
        inputFile.setAttribute('type', 'file');
        const body = document.querySelector('body');
        body.appendChild(inputFile);
        this.inputFile = inputFile;
        this.inputFile.addEventListener('change', this._onFileChange.bind(this));
    }


    /**
     * @desc Bind events on image for edition management
     * @param {HTMLElement} image
     */
    addEditableEvents(image)
    {
        image._onhover = this._onEditableHover.bind(this, image);
        image.addEventListener('mouseover', image._onhover);
        DOM.addStyles(image, {boxShadow: '3px 3px 3px #888'});
    }

    /**
     * @desc Remove events from editable image
     * @param {HTMLElement} image
     */
    removeEditableEvents(image)
    {
        image.removeEventListener('mouseover', image._onhover);
        DOM.addStyles(image, {boxShadow: '3px 3px 3px #CCC'});
        this._hideControls();
    }

    /**
     * @desc Adds image edition controls
     */
    addControls()
    {
        //Edit image
        this.addControl('image', this._onControlClick.bind(this, 'image'));

        //Edit alt
        this.addControl('alt', this._onControlClick.bind(this, 'alt'));
    }

    /**
     * @desc Assign events by control name
     * @param {string} controlName
     * @private
     */
    _onControlClick(controlName)
    {
        //TODO: events by controlName
        this.inputFile.click();
    }

    /**
     * @desc File selection and upload management
     * @private
     */
    _onFileChange()
    {
        const reader = new FileReader();
        reader.onload = (e) => {
            const image = e.target.result;
            const fileName = this.inputFile.files[0].name;

            //TODO: manage file change
            console.log(image, fileName, e, this.inputFile);
        };
        reader.readAsDataURL(this.inputFile.files[0]);
    }
}