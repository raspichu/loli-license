"use strict";

const width = window.innerWidth;
const height = window.innerHeight;

const pos = { x: 50, y: 10 };

const stage = new Konva.Stage({
    container: 'container',
    width: 1050,
    height: 620,
});
const layer = new Konva.Layer();
stage.add(layer);


let profileObj = new Image();
let imageObj = new Image();
let qrObj = new Image();


let randomNumbers = {
    id: null,
    id_b: null
};

let mainNodes = {
    qr: null,
    image: null,
    profile: null
};

let selected = null;

const mainImageSrc = './image/licence_blank_new.png';
const mainQrSrc = './image/qrcode.png';


profileObj.onload = function () {
    console.log("Load Picture");
    if (mainNodes.profile) mainNodes.profile.destroy();
    let { node } = generateTextTransformer(null, pos.x, pos.y + 47, { width: 325, height: 459, image: profileObj, createTransformer: true, draggable: true, addTo: layer });
    mainNodes.profile = node;
    layer.draw();
};

qrObj.onload = function () {
    console.log("Loading QR");
    if (mainNodes.qr) mainNodes.qr.destroy();
    let { node } = generateTextTransformer(null, pos.x + 808, pos.y + 343, { width: 157, height: 156, image: qrObj, draggable: true, createTransformer: true, addTo: layer });
    mainNodes.qr = node;
    layer.draw();
};


imageObj.onload = function () {
    console.log("Loading license");
    if (mainNodes.image) mainNodes.image.destroy();
    let { node } = generateTextTransformer(null, pos.x, pos.y, { image: imageObj, width: 970, height: 600, addTo: layer });
    mainNodes.image = node;
    node.zIndex(-999);

    layer.draw();
    if (imageObj.once) {
        imageObj.once();
        delete imageObj.once;
    }
};

function firstLoad() {
    imageObj.src = mainImageSrc;
    imageObj.once = () => {
        qrObj.src = mainQrSrc;
        generateTextTransformer('[Click here]', pos.x + 490, pos.y + 140, { draggable: true, fontSize: 30, createTransformer: true, editText: true, addTo: layer });
        generateTextTransformer("Name:", pos.x + 395, pos.y + 140, { fontFamily: "Arial", fontSize: 30, editText: true, draggable: true, createTransformer: true, addTo: layer });
        generateTextTransformer("License number:", pos.x + 395, pos.y + 220, { fontFamily: "Arial", fontSize: 30, editText: true, draggable: true, createTransformer: true, addTo: layer });
        generateTextTransformer("Holder of this card is allowed to handle lolis or shotas without consquences", pos.x + 385, pos.y + 370, { fontFamily: "Arial", fontSize: 28, editText: true, width: 380, align: "center", createTransformer: true, draggable: true, addTo: layer });
        generateTextTransformer("FBI", pos.x + 580, pos.y + 60, { fontFamily: "Arial", fontSize: 55, editText: true, align: "center", fontStyle: "bold", draggable: true, createTransformer: true, addTo: layer });

        generateTextTransformer("LO17 LI70 CON13", pos.x + 827, pos.y + 50, { fontSize: 19, editText: true, draggable: true, createTransformer: true, addTo: layer });

        let { node: nodeID } = generateTextTransformer(generateRandomID(), pos.x + 430, pos.y + 270, { scale: 1.2, editText: true, draggable: true, createTransformer: true, addTo: layer });
        let { node: nodeIDBottom } = generateTextTransformer(generateRandomID(), pos.x + 540, pos.y + 488, { fontSize: 18, editText: true, draggable: true, createTransformer: true, addTo: layer });

        randomNumbers.id = nodeID;
        randomNumbers.id_b = nodeIDBottom;
        layer.draw();
    };
}
firstLoad();

function resetImage(type) {
    if (type == 'card') {
        imageObj.src = mainImageSrc;
    } else if (type == 'qr') {
        qrObj.src = mainQrSrc;
    }
    if (selected) {
        selected.hide();
    }
    layer.draw();
}
function removeImage(type) {
    if (type == 'profile') {
        if (mainNodes.prfile) mainNodes.profile.destroy();
    } else if (type == 'qr') {
        if (mainNodes.qr) mainNodes.qr.destroy();
    }
    layer.draw();
}

// File readers
document.getElementById('card_image').onchange = function (evt) {
    let tgt = evt.target || window.event.srcElement;
    let files = tgt.files;

    // FileReader support
    if (FileReader && files && files.length) {
        let fr = new FileReader();
        fr.onload = function () {
            imageObj.src = fr.result;
        };
        fr.readAsDataURL(files[0]);
    }

    // Not supported
    else {
        imageObj.src = mainImageSrc;
        // alert("Browser not supported");
        // fallback -- perhaps submit the input to an iframe and temporarily store
        // them on the server until the user's session ends.
    }
};

document.getElementById('profile_pic').onchange = function (evt) {
    let tgt = evt.target || window.event.srcElement;
    let files = tgt.files;

    // FileReader support
    if (FileReader && files && files.length) {
        let fr = new FileReader();
        fr.onload = function () {
            profileObj.src = fr.result;
        };
        fr.readAsDataURL(files[0]);
    }

    // Not supported
    else {
        if (profileObj.src) {
            profileObj.src = "";
            layer.draw();
        }
        // alert("Browser not supported");
        // fallback -- perhaps submit the input to an iframe and temporarily store
        // them on the server until the user's session ends.
    }
};

document.getElementById('qr_pic').onchange = function (evt) {
    let tgt = evt.target || window.event.srcElement,
        files = tgt.files;

    // FileReader support
    if (FileReader && files && files.length) {
        let fr = new FileReader();
        fr.onload = function () {
            qrObj.src = fr.result;
        };
        fr.readAsDataURL(files[0]);
    }

    // Not supported
    else {
        if (qrObj.src) {
            qrObj.src = "";
            layer.draw();
        }
        // alert("Browser not supported");
        // fallback -- perhaps submit the input to an iframe and temporarily store
        // them on the server until the user's session ends.
    }
};

function regenerateNumber() {
    if (randomNumbers.id) randomNumbers.id.text(generateRandomID());
    if (randomNumbers.id_b) randomNumbers.id_b.text(generateRandomID());
    layer.draw();
}

function generateRandomID() {
    return generateRandomNumberSeries(6) + " " + generateRandomNumberSeries(6) + " " + generateRandomNumberSeries(6);
}

function generateRandomNumberSeries(size) {
    let first = true;
    let id = "";
    for (let j = 0; j < size; j++) {
        let idTemp = Math.floor(Math.random() * 9);
        if (first) {
            while (idTemp == 0) {
                idTemp = Math.floor(Math.random() * 9);
            }
            first = false;
        }
        id += idTemp;

    }
    return id;
}

// Text edit
function generateTextTransformer(text, posX, posY, { addTo = null, width = null, height = null, scale = 1, scaleX = null, scaleY = null, fontSize = 50, fontFamily = 'Calibri', fontStyle = null, draggable = false, align = null, createTransformer = false, image = null, editText = false }) {
    let node = null;
    if (image) {
        node = new Konva.Image({
            x: posX,
            y: posY,
            fontFamily: fontFamily,
            fontSize: fontSize,
            width: width,
            scale: scale,
            draggable: draggable,
            height,
            image,
            scaleX,
            scaleY
        });
    } else {
        node = new Konva.Text({
            text,
            x: posX,
            y: posY,
            fontFamily: fontFamily,
            fontSize: fontSize,
            width: width,
            scale: scale,
            draggable: draggable,
            height,
            scaleX,
            scaleY,
            align,
            fontStyle
        });
        node.on('transform', () => {
            // with enabled anchors we can only change scaleX
            // so we don't need to reset height
            // just width

            node.setAttrs({
                fontSize: node.fontSize() * node.scaleY(),
                width: Math.max(node.width() * node.scaleX(), 20),
                scaleX: 1,
                scaleY: 1,
            });
        });
    }
    let transformer = null;
    if (createTransformer) {
        transformer = new Konva.Transformer({
            node: node,
            // enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
            rotationSnaps: [0, 90, 180, 270],
            centeredScaling: false,
            boundBoxFunc: function (oldBox, newBox) {
                newBox.width = Math.max(30, newBox.width);
                return newBox;
            },
        });
        transformer.hide();
    }
    node.on('click', (event) => {
        console.log('event: ', event);
        // event.evt.stopPropagation();
        if (selected) selected.hide();
        selected = transformer;
        if (createTransformer) {
            transformer.show();
            transformer.forceUpdate();
        }
        layer.draw();
    });
    if (editText) {
        node.on('dblclick', () => {
            node.hide();
            if (transformer) transformer.hide();
            layer.draw();
            editNodeText(node);
        });
    }
    if (addTo) {
        addTo.add(node);
        if (transformer) addTo.add(transformer);
    }

    return { node, transformer };
}

function editNodeText(node) {
    // hide text node and transformer:


    // create textarea over canvas with absolute position
    // first we need to find position for textarea
    // how to find it?

    // at first lets find position of text node relative to the stage:
    let textPosition = node.absolutePosition();

    // then lets find position of stage container on the page:
    let stageBox = stage.container().getBoundingClientRect();

    // so position of textarea will be the sum of positions above:
    let areaPosition = {
        x: stageBox.left + textPosition.x,
        y: stageBox.top + textPosition.y - 1,
    };

    // create textarea and style it
    let textarea = document.createElement('textarea');
    document.body.appendChild(textarea);

    // apply many styles to match text on canvas as close as possible
    // remember that text rendering on canvas and on the textarea can be different
    // and sometimes it is hard to make it 100% the same. But we will try...
    textarea.value = node.text();
    textarea.style.position = 'absolute';
    textarea.style.top = areaPosition.y - 1 + 'px';
    textarea.style.left = areaPosition.x + 'px';
    textarea.style.width = node.width() - node.padding() * 2 + 'px';
    textarea.style.height = node.height() - node.padding() * 2 - 5 + 'px';
    textarea.style.fontSize = node.fontSize() + 'px';
    textarea.style.border = 'none';
    textarea.style.padding = '0px';
    textarea.style.margin = '0px';
    textarea.style.overflow = 'hidden';
    textarea.style.background = 'none';
    textarea.style.outline = 'none';
    textarea.style.resize = 'none';
    textarea.style.lineHeight = node.lineHeight();
    textarea.style.fontFamily = node.fontFamily();
    textarea.style.transformOrigin = 'left top';
    textarea.style.textAlign = node.align();
    textarea.style.color = node.fill();
    let rotation = node.rotation();
    let transform = '';
    if (rotation) {
        transform += 'rotateZ(' + rotation + 'deg)';
    }

    let px = 0;
    // also we need to slightly move textarea on firefox
    // because it jumps a bit
    let isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    if (isFirefox) {
        px += 2 + Math.round(node.fontSize() / 20);
    }
    transform += 'translateY(-' + px + 'px)';

    textarea.style.transform = transform;

    // reset height
    textarea.style.height = 'auto';
    // after browsers resized it we can set actual value
    textarea.style.height = textarea.scrollHeight + 3 + 'px';

    textarea.focus();

    function removeTextarea() {
        textarea.parentNode.removeChild(textarea);
        window.removeEventListener('click', handleOutsideClick);
        node.show();
        layer.draw();
    }

    function setTextareaWidth(newWidth) {
        if (!newWidth) {
            // set width for placeholder
            newWidth = node.placeholder.length * node.fontSize();
        }
        // some extra fixes on different browsers
        let isSafari = /^((?!chrome|android).)*safari/i.test(
            navigator.userAgent
        );
        let isFirefox =
            navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        if (isSafari || isFirefox) {
            newWidth = Math.ceil(newWidth);
        }

        let isEdge = document.documentMode || /Edge/.test(navigator.userAgent);
        if (isEdge) {
            newWidth += 1;
        }
        textarea.style.width = newWidth + 'px';
    }

    textarea.addEventListener('keydown', function (e) {
        // hide on enter
        // but don't hide on shift + enter
        if (e.keyCode === 13 && !e.shiftKey) {
            node.text(textarea.value);
            removeTextarea();
        }
        // on esc do not set value back to node
        if (e.keyCode === 27) {
            removeTextarea();
        }
    });

    textarea.addEventListener('keydown', function (e) {
        let scale = node.getAbsoluteScale().x;
        setTextareaWidth(node.width() * scale);
        textarea.style.height = 'auto';
        textarea.style.height =
            textarea.scrollHeight + node.fontSize() + 'px';
    });

    function handleOutsideClick(e) {
        if (e.target !== textarea) {
            node.text(textarea.value);
            removeTextarea();
        }
    }
    setTimeout(() => {
        window.addEventListener('click', handleOutsideClick);
    });
}
