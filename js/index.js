function win(attr, value) {
    if (typeof value !== "undefined") {
        document.documentElement[attr] = value;
        document.body[attr] = value;
    } else {
        return document.documentElement[attr] || document.body[attr];
    }
}

var lazyLoad = (function () {
    function delayImg(items) {
        let tt = 0;
        for (let i = tt; i < items.length; i++) {
            items[i].index = i;
            delayOneImg(items[i]);
        }
    }

    function delayOneImg(curEle) {
        let tt = curEle.index;
        if (curEle.flag) {
            return;
        }
        let imgH = curEle.offsetHeight;
        let imgT = utils(curEle).offset().top;
        let winH = win("clientHeight");
        let winT = win("scrollTop");
        let newImg = document.createElement("img");
        let trueAddress = curEle.getAttribute("trueImg");
        //图片预加载(异步加载)
        newImg.src = trueAddress;
        if (winT + winH >= imgH + imgT) {
            newImg.onload = () => {
                curEle.getElementsByTagName("img")[0].src = trueAddress;
                curEle.flag = true;
                utils(curEle).fadeIn();
                tt = curEle.index + 1;
            }
        }
    }
    return delayImg;
})();
;(function () {
    let pageNum = 1;
    let data = utils.ajax(),
        oCol = document.getElementsByClassName("col");
    oCol = utils(oCol).toArray();
    bind_data(data);
    let items = document.getElementsByClassName("item");
    lazyLoad(items);

    function bind_data(data) {
        for (let i = 0; i < data.length; i++) {
                let oDiv = document.createElement("div");
                let str = ``;
                oCol.sort(function (a, b) {
                    let aH = a.offsetHeight;
                    let bH = b.offsetHeight;
                    return aH - bH;
                });
            let {id, img, desc} = data[i];
            // var item = data[i];
            str = `
             <div class="item" trueImg="${img}">
                <img src="img/default.jpg" alt="">
                <p>${desc}</p>
             </div>
            `;
            oDiv.innerHTML = str;
            oCol[0].appendChild(oDiv);
        }
    }

    //分页
    /*
    * window.onscroll
    * 滚动卷去的高度+浏览器的可视化高度=整个页面的高度
    * 加载下一页
    * if(pageNum>5)结束加载
    * */
    window.onscroll = () => {
        lazyLoad(items);
        if (pageNum > 5) {
            return;
        }
        //判断页面滚动到底部
        if (win("scrollTop") + win("clientHeight") + 10 >= win("scrollHeight")) {
            //第一步：获取数据
            let articles = utils.ajax();
            //渲染页面
            bind_data(articles);
            pageNum += 1;
        }
    };
})();


