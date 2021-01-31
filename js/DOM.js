export default class DOM
{
    /**
     * @desc Shortcut that create DOM element with optional classes
     * @param {string} tag
     * @param {string|string[]} classes
     * @return HTMLElement
     */
    static createElement(tag, classes = [])
    {
        if (!Array.isArray(classes)) {
            classes = [classes];
        }

        const element = document.createElement(tag);
        for (const className of classes) {
            element.classList.add(className);
        }

        return element;
    }

    /**
     * @desc Add CSS styles to DOM element
     * @param {HTMLElement} element
     * @param {Object} styles Keypair property-value e.g. : {color: 'green', border: 'dashed 1px #CCC'}
     */
    static addStyles(element, styles)
    {
        for (const [property, value] of Object.entries(styles)) {
            element.style[property] = value;
        }
    }

    /**
     * @desc Remove CSS styles from DOM element (only applies on styles within style attribute)
     * @param {HTMLElement} element
     * @param {string[]} styles Style properties list to remove e.g. : ['backgroundColor', 'display']
     */
    static removeStyles(element, styles)
    {
        styles.forEach(property => element.style[property] = null);
    }

    /**
     * @desc Apply fadein effect on element when cursor is within a short range
     * @param {HTMLElement} element
     */
    static showOnApproch(element)
    {
        let lastDistance = 0;
        this.addStyles(element, {opacity: 0, transition: 'opacity .3s ease-in-out'});
        window.addEventListener('mousemove', e => {
            const bcr = element.getBoundingClientRect();
            let Xdistance = Math.min(Math.abs(e.pageX - bcr.left), Math.abs(e.pageX - bcr.right));
            let Ydistance = Math.min(Math.abs(e.pageY - bcr.top), Math.abs(e.pageY - bcr.bottom));
            let hoveringElement =
                bcr.left <= e.pageX && bcr.right >= e.pageX &&
                bcr.top <= e.pageY && bcr.bottom >= e.pageY;
            let distance = Math.max(Xdistance, Ydistance);
            let triggerDistance = distance > lastDistance ? 50 : 200;
            lastDistance = distance;
            element.style.opacity = hoveringElement || distance < triggerDistance ? '1' : '0';
        });
    }

    static HEAD = {
        /**
         * @desc Append style tag within <head> if not created yet. This tag is used for advanced CSS styling
         * @return {HTMLElement} Style tag created within <head>
         */
        getHeadStyle: () => {
            let headStyle = document.getElementById('edertu-head-style');
            if (!headStyle) {
                headStyle = DOM.createElement('style');
                headStyle.id = 'edertu-head-style';
                document.querySelector('head').appendChild(headStyle);
            }
            return headStyle;
        },

        /**
         * @desc Append new CSS rules to head Styles
         * @param {Object.<string, Object>} cssObject Keypair selector-styles
         */
        addStyles : cssObject => {
            let headStyle = this.HEAD.getHeadStyle();
            let css = '';
            for (const [selector, styles] of Object.entries(cssObject)) {
                css += selector + '{';
                for (const [property, value] of Object.entries(styles)) {
                    css += `${property}:${value};`
                }
                css += '}';
            }
            headStyle.appendChild(document.createTextNode(css));
        }
    }
}