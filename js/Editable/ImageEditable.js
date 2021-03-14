import Trad from "../Trad";
import Controls from "./Controls";
import DOM from "../DOM";
import Popup from "../Popup";

export default class ImageEditable extends Controls
{
    /**
     * @param {Object} settings
     * @param {string} settings.imageUpload
     * @param {string} settings.imageFolder
     * @param {string} settings.lang
     */
    constructor(settings) {
        super();
        this.imageUpload = settings.imageUpload;
        this.imageFolder = settings.imageFolder;
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
        this.addControl('alt', this._onControlClick.bind(this, 'alt'));;

        //Edit alt
        this.addControl('collection', this._onControlClick.bind(this, 'collection'));
    }

    /**
     * @desc Assign events by control name
     * @param {string} controlName
     * @private
     */
    _onControlClick(controlName)
    {
        switch (controlName) {
            case 'image':
                this.inputFile.click();
                break;
            case 'alt':
                const popup = new Popup();
                const currentAlt = this.activeEditable instanceof HTMLImageElement ? this.activeEditable.alt : '';
                popup.withTitle('Texte alternatif')
                    .withField('change-alt', 'Texte alternatif', 'text', currentAlt)
                    .withButton('Changer', this._onAltChange.bind(this, popup))
                    .display();
                break;
            case 'collection':
                this._getCollection().then(this._showCollection.bind(this));
                break;
        }
    }

    /**
     * @desc File selection and upload management
     * @private
     */
    _onFileChange()
    {
        const reader = new FileReader();
        reader.onload = () => {
            const formData = new FormData();
            const file = this.inputFile.files[0];
            formData.append('upfile', file);
            if (this.imageFolder) formData.append('imageFolder', this.imageFolder);

            const request = new Request(this.imageUpload, {method: 'POST', body: formData});

            fetch(request)
                .then(response => response.json())
                .then(data => this._updateImage(data));
        };
        reader.readAsDataURL(this.inputFile.files[0]);
    }

    /**
     * @desc Updates image element
     * @param {Object} data
     * @param {boolean} data.success
     * @param {string} data.url
     * @param {string} data.alt
     * @private
     */
    _updateImage(data)
    {
        if (!data.url || !data.alt) return;
        if (this.activeEditable instanceof HTMLImageElement) {
            this.activeEditable.src = data.url;
            this.activeEditable.alt = data.alt;
        }
    }

    /**
     * @desc Updates image alt
     * @param {Popup} popup
     * @private
     */
    _onAltChange(popup)
    {
        const altInput = document.getElementById('change-alt');
        if (altInput.value) {
            this.activeEditable.alt = altInput.value;
        }
        popup.destroy();
    }

    async _getCollection()
    {
        const response = await fetch(this.imageFolder);
        const htmlResponse = await response.text();
        const docResponse = new DOMParser().parseFromString(htmlResponse, 'text/html');
        const links = [].slice.call(docResponse.querySelectorAll('td a'));
        const images = [];
        links.forEach(a => {
            if (a.href.match(/(png|jpe?g)$/)) images.push(a.href);
        })
        return images;
    }

    _showCollection(images)
    {
        if (images.length === 0) return;
        const popup = new Popup().withTitle('Choisir une photo');
        const collection = DOM.createElement('div', 'edertu-popup__image-collection');
        images.forEach(image => {
            image = image.split('/').pop();
            const imageElt = DOM.createElement('img');
            imageElt.src = this.imageFolder+image;
            imageElt.alt = image;
            const imageContainer = DOM.createElement('div', 'edertu-popup-image')
            imageElt.addEventListener('click', this._onImageCollectionClick.bind(this, imageElt, popup));
            const remove = DOM.createElement('div');
            DOM.addStyles(remove, {
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: 'white',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: '1px solid #CCC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            });
            remove.innerText = 'x';
            remove.addEventListener('click', this._onImageRemoveClick.bind(this, imageElt, popup));
            imageContainer.appendChild(remove);
            imageContainer.appendChild(imageElt);
            collection.appendChild(imageContainer);
        });
        popup.withContent(collection);
        popup.display();
    }

    _onImageCollectionClick(image, popup)
    {
        this._updateImage({
            url: image.src,
            alt: image.alt
        });
        popup.destroy();
    }

    async _onImageRemoveClick(image, popup)
    {
        if (!confirm(this.trad.collection.remove)) return;
        const request = new Request(image.src, {method: 'DELETE'});
        const response = await fetch(request);
        const data = await response.json();
        if (data.success) {
            const imagesContainer = image.parentNode.parentNode;
            DOM.remove(image.parentNode);
            if (imagesContainer.querySelectorAll('img').length === 0) {
                popup.destroy();
            }
        }
    }
}