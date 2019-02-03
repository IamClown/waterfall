;(function () {
    let reg = /^(width|height|left|right|padding|margin|top|bottom)$/;
    let Utils = function (ele) {
        //给实例添加一个私有属性
        this.ele = ele;
    };
    Utils.prototype = {
        constructor: Utils,
        getCss: function (attr) {
            //通过.前面的对象调用里面的方法
            let ele = this.ele,
                value = null;
            if ("getComputedStyle" in window) {
                value = getComputedStyle(ele)[attr];
            } else {
                value = ele.currentStyle[attr];
            }
            if (reg.test(attr)) {
                if (parseFloat(value)) {
                    return parseFloat(value);
                }
            }
            return value;
        },
        setCss: function (attr, val) {
            let ele = this.ele;
            if (typeof val === "number") {
                if (reg.test(attr)) {
                    val += "px";
                }
            } else {
                ele.style[attr] = val;
            }
            //将实例返回，用做链式调用
            return this;
        },
        fadeIn: function () {
            let ele = this.ele;
            let tempNum = 0.3;
            ele.style.opacity = tempNum;
            let timer = setInterval(function () {
                tempNum += 0.1;
                ele.style.opacity = tempNum;
                if (tempNum >= 1) {
                    tempNum = 1;
                    ele.style.opacity = tempNum;
                    clearInterval(timer);
                }
            }, 30)
        },
        offset: function () {
            let ele = this.ele,
                oLeft = ele.offsetLeft,
                oTop = ele.offsetTop,
                oParent = ele.offsetParent;
            while (oParent !== document.body) {
                oLeft = oParent.clientLeft + oParent.offsetLeft;
                oTop = oParent.clientTop + oParent.offsetTop;
                oParent = oParent.offsetParent;
            }
            return {
                left: oLeft,
                top: oTop
            }
        },
        toArray: function () {
            let ele = this.ele;
            return [].slice.call(ele);
        }
    };
    let utils = (ele) => {
        return new Utils(ele);
    };
    utils.ajax = () => {
        let xhr = new XMLHttpRequest(),
            data = null;
        xhr.open("GET", "./json/articles.json", false);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                data = xhr.responseText;
            }
        };
        xhr.send(null);
        data = window.JSON.parse(data);
        return data;
    };
    window.utils = utils;
})();
