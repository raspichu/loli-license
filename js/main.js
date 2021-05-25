"use strict";

let width = window.innerWidth;
let height = window.innerHeight;

let stage = new Konva.Stage({
    container: 'container',
    width: 1050,
    height: 620,
});

let layer = new Konva.Layer();
stage.add(layer);
let nameNode = null;
let idNode = null;
let tr = null;
let pos = { x: 50, y: 10 };


let profilePic = new Image();
let imageObj = new Image();
let qrObj = new Image();
imageObj.src = './image/licence.png';
// profilePic.src = '/image/test.jpg';

let images = {
    profile: null,
    qr: null
}


profilePic.onload = function () {
    console.log("LOaded")
    if (images.profile) images.profile.destroy();
    images.profile = new Konva.Image({
        x: pos.x,
        y: pos.y + 47,
        image: profilePic,
        scaleX: 1,
        scaleY: 1,
        width: 325,
        // draggable: true,
        height: 458,
    });

    // add the shape to the layer
    layer.add(images.profile);

    // let profile_tr = new Konva.Transformer({
    //     node: images.profile,
    //     enabledAnchors: ['middle-left', 'middle-right'],
    //     // set minimum width of text
    //     boundBoxFunc: function (oldBox, newBox) {
    //         newBox.width = Math.max(30, newBox.width);
    //         return newBox;
    //     },
    // });

    images.profile.on('click', () => {
        if (tr) {
            tr.hide();
            tr.forceUpdate();
            layer.draw();
        }
    });
    // layer.add(profile_tr);

    layer.draw();
};

qr_pic.onload = function () {
    if (images.qr) images.qr.destroy();
    images.qr = new Konva.Image({
        x: pos.x,
        y: pos.y + 47,
        image: qrObj,
        width: 325,
        height: 459,
    });

    // add the shape to the layer
    layer.add(images.qr);

    images.qr.on('click', () => {
        if (tr) {
            tr.hide();
            tr.forceUpdate();
            layer.draw();
        }
    });
    layer.draw();

};

qrObj.onload = function () {
    console.log("LOaded")
    let qr = new Konva.Image({
        x: pos.x + 808,
        y: pos.y + 343,
        image: qrObj,
        width: 157,
        height: 156,
    });

    // add the shape to the layer
    layer.add(qr);

    qr.on('click', () => {
        if (tr) {
            tr.hide();
            tr.forceUpdate();
            layer.draw();
        }
    });
    layer.draw();
};

imageObj.onload = function () {
    console.log("LOaded")
    let license = new Konva.Image({
        x: pos.x,
        y: pos.y,
        image: imageObj,
        scaleX: 0.5,
        scaleY: 0.5,
        // width: width,
        // height: height,
    });

    // add the shape to the layer
    layer.add(license);

    license.on('click', () => {
        if (tr) {
            tr.hide();
            tr.forceUpdate();
            layer.draw();
        }
    });
    // layer.batchDraw();
    nameNode = new Konva.Text({
        text: '[Click here]',
        x: pos.x + 490,
        y: pos.y + 140,
        fontSize: 30,
        draggable: true,
        width: 200,
    });

    idNode = new Konva.Text({
        text: generateRandomID(),
        x: pos.x + 430,
        y: pos.y + 270,
        fontFamily: 'Calibri',
        fontSize: 50,
        width: 500,
        scale: 1.2
    });

    layer.add(nameNode);
    layer.add(idNode);

    tr = new Konva.Transformer({
        node: nameNode,
        enabledAnchors: ['middle-left', 'middle-right'],
        // set minimum width of text
        boundBoxFunc: function (oldBox, newBox) {
            newBox.width = Math.max(30, newBox.width);
            return newBox;
        },
    });

    nameNode.on('transform', function () {
        // reset scale, so only with is changing by transformer
        nameNode.setAttrs({
            width: nameNode.width() * nameNode.scaleX(),
            scaleX: 1,
        });
    });
    tr.hide();

    layer.add(tr);


    nameNode.on('click', () => {
        tr.show();
        tr.forceUpdate();
        layer.draw();
    });
    nameNode.on('dblclick', editText);

    layer.draw();
    // qrObj.src = '/image/descarga.png'

};


function generateRandomID() {
    let id = "";
    for (let i = 0; i < 3; i++) {
        let first = true;
        for (let j = 0; j < 6; j++) {
            let idTemp = Math.floor(Math.random() * 9);
            if (first) {
                console.log('idTemp: ', idTemp);
                while (idTemp == 0) {
                    idTemp = Math.floor(Math.random() * 9);
                }
                first = false;
            }
            id += idTemp;

        }
        id += " ";
    }
    return id;
}

document.getElementById('profile_pic').onchange = function (evt) {
    var tgt = evt.target || window.event.srcElement,
        files = tgt.files;

    // FileReader support
    if (FileReader && files && files.length) {
        var fr = new FileReader();
        fr.onload = function () {
            profilePic.src = fr.result;
        }
        fr.readAsDataURL(files[0]);
    }

    // Not supported
    else {
        alert("Browser not supported");
        // fallback -- perhaps submit the input to an iframe and temporarily store
        // them on the server until the user's session ends.
    }
}

document.getElementById('qr_pic').onchange = function (evt) {
    var tgt = evt.target || window.event.srcElement,
        files = tgt.files;

    // FileReader support
    if (FileReader && files && files.length) {
        var fr = new FileReader();
        fr.onload = function () {
            qrObj.src = fr.result;
        }
        fr.readAsDataURL(files[0]);
    }

    // Not supported
    else {
        alert("Browser not supported");
        // fallback -- perhaps submit the input to an iframe and temporarily store
        // them on the server until the user's session ends.
    }
}

function editText() {
    // hide text node and transformer:
    nameNode.hide();
    tr.hide();
    layer.draw();

    // create textarea over canvas with absolute position
    // first we need to find position for textarea
    // how to find it?

    // at first lets find position of text node relative to the stage:
    let textPosition = nameNode.absolutePosition();

    // then lets find position of stage container on the page:
    let stageBox = stage.container().getBoundingClientRect();

    // so position of textarea will be the sum of positions above:
    let areaPosition = {
        x: stageBox.left + textPosition.x,
        y: stageBox.top + textPosition.y,
    };

    // create textarea and style it
    let textarea = document.createElement('textarea');
    document.body.appendChild(textarea);

    // apply many styles to match text on canvas as close as possible
    // remember that text rendering on canvas and on the textarea can be different
    // and sometimes it is hard to make it 100% the same. But we will try...
    textarea.value = nameNode.text();
    textarea.style.position = 'absolute';
    textarea.style.top = areaPosition.y - 1 + 'px';
    textarea.style.left = areaPosition.x + 'px';
    textarea.style.width = nameNode.width() - nameNode.padding() * 2 + 'px';
    textarea.style.height =
        nameNode.height() - nameNode.padding() * 2 - 5 + 'px';
    textarea.style.fontSize = nameNode.fontSize() + 'px';
    textarea.style.border = 'none';
    textarea.style.padding = '0px';
    textarea.style.margin = '0px';
    textarea.style.overflow = 'hidden';
    textarea.style.background = 'none';
    textarea.style.outline = 'none';
    textarea.style.resize = 'none';
    textarea.style.lineHeight = nameNode.lineHeight();
    textarea.style.fontFamily = nameNode.fontFamily();
    textarea.style.transformOrigin = 'left top';
    textarea.style.textAlign = nameNode.align();
    textarea.style.color = nameNode.fill();
    let rotation = nameNode.rotation();
    let transform = '';
    if (rotation) {
        transform += 'rotateZ(' + rotation + 'deg)';
    }

    let px = 0;
    // also we need to slightly move textarea on firefox
    // because it jumps a bit
    let isFirefox =
        navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    if (isFirefox) {
        px += 2 + Math.round(nameNode.fontSize() / 20);
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
        nameNode.show();
        layer.draw();
    }

    function setTextareaWidth(newWidth) {
        if (!newWidth) {
            // set width for placeholder
            newWidth = nameNode.placeholder.length * nameNode.fontSize();
        }
        // some extra fixes on different browsers
        var isSafari = /^((?!chrome|android).)*safari/i.test(
            navigator.userAgent
        );
        var isFirefox =
            navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        if (isSafari || isFirefox) {
            newWidth = Math.ceil(newWidth);
        }

        var isEdge =
            document.documentMode || /Edge/.test(navigator.userAgent);
        if (isEdge) {
            newWidth += 1;
        }
        textarea.style.width = newWidth + 'px';
    }

    textarea.addEventListener('keydown', function (e) {
        // hide on enter
        // but don't hide on shift + enter
        if (e.keyCode === 13 && !e.shiftKey) {
            nameNode.text(textarea.value);
            removeTextarea();
        }
        // on esc do not set value back to node
        if (e.keyCode === 27) {
            removeTextarea();
        }
    });

    textarea.addEventListener('keydown', function (e) {
        let scale = nameNode.getAbsoluteScale().x;
        setTextareaWidth(nameNode.width() * scale);
        textarea.style.height = 'auto';
        textarea.style.height =
            textarea.scrollHeight + nameNode.fontSize() + 'px';
    });

    function handleOutsideClick(e) {
        if (e.target !== textarea) {
            nameNode.text(textarea.value);
            removeTextarea();
        }
    }
    setTimeout(() => {
        window.addEventListener('click', handleOutsideClick);
    });
}
