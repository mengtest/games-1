/*文件加载器*/
function Loader() {
    this.imgBox = util.$$("imgbox");
    this.imagesArr = [
        'hand/golden-hand-a.png',
        'hand/golden-hand-b.png',
        'hand/normal-hand-a.png',
        'hand/normal-hand-b.png',
        'hand/normal-hand-beated.png',
        'bedding.png',
        'btn-back.png',
        'btn-back-gate.png',
        'btn-no.png',
        'btn-play.png',
        'btn-rank-back.png',
        'btn-share.png',
        'btn-yes.png',
        'gate-bg-four.png',
        'gate-bg-one.png',
        'gate-bg-three.png',
        'gate-bg-two.png',
        'gate-coin-four.png',
        'gate-coin-four-enabled.png',
        'gate-coin-one.png',
        'gate-coin-one-enabled.png',
        'gate-coin-three.png',
        'gate-coin-three-enabled.png',
        'gate-coin-two.png',
        'gate-coin-two-enabled.png',
        'gate-coin-what.png',
        'gate-list-bg.png',
        'go.png',
        'golden-glove.png',
        'hammer-normal.png',
        'hammer-beat.png',
        'index-bg.png',
        'index-btn1.png',
        'index-btn2.png',
        'label-counter.png',
        'label-rank.png',
        'layer-success-bg.png',
        'money.png',
        'money-first.png',
        'money-second.png',
        'money-third.png',
        'rank-bg.png',
        'shadow.png',
        'starshine.png',
        'timer.png'
    ];
}

Loader.prototype.getUrl=function(){
    var _self=this;
    var urls=[];
    var tempArr=[];
    for (var i = 0; i <= _self.imagesArr.length - 1; i++) {
        urls[urls.length] = appConfig.imgSrc + _self.imagesArr[i] + '?_=' + (new Date).getTime();
        var imgObj = document.createElement("img");
        imgObj.src = appConfig.imgSrc + _self.imagesArr[i] + '?_=' + (new Date).getTime();
        tempArr=_self.imagesArr[i].split('/');
        if(tempArr.length>1){
            imgObj.id = tempArr[tempArr.length-1].split(".")[0];
        }else{
            imgObj.id = _self.imagesArr[i].split(".")[0];
        }
        _self.imgBox.appendChild(imgObj);
    }
    return urls;
};

Loader.prototype.loadingImage = function (s) {
    var _self=this;
    var urlset = [],
        undefined,
        toString = Object.prototype.toString;
    switch (toString.apply(s.url)) {
        case '[object String]':
            urlset[urlset.length] = s.url;
            break;
        case '[object Array]':
            if (!s.url.length) {
                return false;
            }
            urlset = s.url;
            break;
        case '[object Function]':
            s.url = s.url();
            //return imageLoad(s);
            return _self.loadingImage(s);
        default:
            return false;
    }
    var imgset = [],
        r = {
            total: urlset.length,
            load: 0,
            error: 0,
            abort: 0,
            complete: 0,
            currentIndex: 0
        },
        timer,
        _defaults = {
            url: '',
            onload: 'function',
            onerror: 'function',
            oncomplete: 'function',
            ready: 'function',
            complete: 'function',
            timeout: 15
        };
    for (var v in _defaults) {
        s[v] = s[v] === undefined ? _defaults[v] : s[v];
    }
    s.timeout = parseInt(s.timeout) || _defaults.timeout;
    timer = setTimeout(_callback, s.timeout * 1000);
    for (var i = 0,
             l = urlset.length,
             img; i < l; i++) {
        img = new Image();
        img.loaded = false;
        imgset[imgset.length] = img;
    }
    for (i = 0, l = imgset.length; i < l; i++) {
        imgset[i].onload = function () {
            _imageHandle.call(this, 'load', i);
        };
        imgset[i].onerror = function () {
            _imageHandle.call(this, 'error', i);
        };
        imgset[i].onabort = function () {
            _imageHandle.call(this, 'abort', i);
        };
        imgset[i].src = '' + urlset[i];
    }
    if (_isFn(s.ready)) {
        s.ready.call({},
            imgset, r);
    }
    function _imageHandle(handle, index) {
        r.currentIndex = index;
        switch (handle) {
            case 'load':
                this.onload = null;
                this.loaded = true;
                r.load++;
                if (_isFn(s.onload)) {
                    s.onload.call(this, r);
                }
                break;
            case 'error':
                r.error++;
                if (_isFn(s.onerror)) {
                    s.onerror.call(this, r);
                }
                break;
            case 'abort':
                r.abort++;
                break;
        }
        r.complete++;
        if (_isFn(s.oncomplete)) {
            s.oncomplete.call(this, r);
        }
        if (r.complete === imgset.length) {
            _callback();
        }
    }

    function _callback() {
        clearTimeout(timer);
        if (_isFn(s.complete)) {
            s.complete.call({},
                imgset, r);
        }
    }

    function _isFn(fn) {
        return toString.apply(fn) === '[object Function]';
    }

    return true;
};

/*
* 加载效果
* */
Loader.prototype.loadingEffect=function(s){
    application.context.beginPath();
    application.context.fillStyle = "#000";
    application.context.rect(0, 0, application.canvas.width, application.canvas.height);
    application.context.fill();
    application.context.font = "normal " + 12 * appConfig.ratio + "px arial";
    application.context.fillStyle = "#fefefe";

    var myText = Math.round((s.complete / s.total) * 100) + " %";
    var myX = (application.canvas.width / appConfig.ratio - (application.context.measureText(myText).width >> 1) >> 1);
    var myY = ((application.canvas.height / appConfig.ratio) >> 1) - 6 * appConfig.ratio;
    application.context.fillText(myText, myX, myY);
};