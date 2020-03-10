<template>
    <div class="invite-poster-page" v-bind:style="{ width:clientWidth+'px' }">
        <div class="margin-left" v-bind:style="{ width: margin+'px', minHeight:clientHeight+'px' }"></div>
        <div class="margin-right" v-bind:style="{ width: margin+'px', minHeight:clientHeight+'px' }"></div>
        <div style="position: absolute" v-bind:style="{top:changeImgYDistance+'px', left:changeImgXDistance+'px'}">
            <div @click="imageUpload" style="position: relative">
                <div class="round">
                    <div class="circle">
                        <span style="cursor:default">换图片</span>
                    </div>
                    <div class="circle_bottom animation "></div>
                </div>
            </div>
            <input type="file" accept="image/*" id="upload" style="display:none"/>
        </div>
        <div style="position: absolute" v-bind:style="{top:changeNameYDistance+'px', left:changeNameXDistance+'px'}">
            <div @click="nameClick" style="position: relative">
                <div class="round">
                    <div class="circle">
                        <span style="cursor:default">改名字</span>
                    </div>
                    <div class="circle_bottom animation "></div>
                </div>
            </div>
        </div>
        <div class="post-box" v-bind:style="{ width: postBoxWidth+'px', minHeight:clientHeight+'px' }">
            <div class="contenter" v-bind:style="{ minHeight:contenterHeight+'px' }">
                <div class="headbg" v-bind:style="{ height:headbgHeight+'px'}">

                </div>
                <div class="imgbg" style="{ height:100% }">
                    <div class="dragdiv">
                        <img style="position: relative;" v-bind:src="imageSrc" v-bind:style="{width:imgWidthInit+'px', height:imgHeightInit+'px'}" draggable="true" @mousedown="down" @touchstart="touchstart" @mousemove="move" @touchmove="touchmove" @mouseup="end" @touchend="touchend">
                    </div>
                </div>
                <div class="texter" v-bind:style="{ height:texterHeight+'px', top: texterDistance+'px' }">
                    <div style="position: relative; width:100%; height: 100%;">
                        <div class="texterMiddle">
                            <div>
                                <span style="color:#E7DA71">我是</span>
                                <span style="margin-left:0px;letter-spacing:8px;font-weight: 800;font-size: 23px;">
                                    <span v-bind:style="nameInputShow">
                                        <input type="text" id="name"/>
                                    </span>
                                    <span v-bind:style="nameContentHidden">
                                        {{name}}
                                    </span>
                                </span>
                            </div>
                            <div style="margin-left: 90px;margin-top: 0px;">我是第<span style="color:#E7DA71; margin: 0 5px">{{number}}</span>位宣誓人</div>
                        </div>
                    </div>
                </div>
                <div class="footbg" v-bind:style="{ height:footbgHeight+'px' }"></div>
            </div>
            <div class="footer" v-bind:style="{ minHeight:footerHeight+'px' }">
                <div class="footer-contenter">
                    <van-button type="primary" style="width: 10rem" @click="createImage">生成</van-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    // import QRCode from 'qrcode'
    import html2canvas from 'html2canvas';
    import logoPNG from '../assets/logo.png'
    import { Button } from 'vant';
    import {getMidpoint, getDistance, getAngle, previewImg} from '../utils/utils'

    export default {
        name: 'ImagePost',
        components: {
            [Button.name]: Button
        },
        created() {
            this.clientWidth = document.documentElement.clientWidth;//计算屏幕宽度
            this.clientHeight = document.documentElement.clientHeight;//计算屏幕高度
            console.info("clientWidth:"+this.clientWidth+"  clientHeight:"+this.clientHeight)
            this.postBoxWidth = this.clientWidth*0.9;//计算海报编辑区域宽度
            this.contenterHeight = this.postBoxWidth*1.78;//计算内容区高度
            let footerBaseHight = 50;
            if((this.clientHeight-this.contenterHeight)>footerBaseHight) {
                this.footerHeight = this.clientHeight-this.contenterHeight;//计算底部高度
            } else {
                this.footerHeight = footerBaseHight;
                this.clientHeight = this.contenterHeight+this.footerHeight
            }
            this.headbgHeight = this.postBoxWidth/1.8;
            this.headbgSkewHeight = this.postBoxWidth/2.2;
            this.footbgHeight = this.postBoxWidth/1.3;
            this.textbgHeight = this.postBoxWidth/2.84;
            this.textbgSkewHeight = this.postBoxWidth/9.8;
            this.texterHeight = this.textbgHeight-this.textbgSkewHeight;
            this.texterDistance = this.contenterHeight/1.62;
            this.margin = (this.clientWidth*0.1)/2;//左右两边留白空间尺寸
            this.imgWidthInitOringin = this.clientWidth*1.5;
            this.imgHeightInitOrigin = this.clientHeight*1.5;
            this.imgWidthInit = this.imgWidthInitOringin;
            this.imgHeightInit = this.imgHeightInitOrigin;
            this.changeImgYDistance = this.contenterHeight/7;
            this.changeImgXDistance = this.postBoxWidth/1.3;
            this.changeNameYDistance = this.contenterHeight/3;
            this.changeNameXDistance = this.postBoxWidth/1.3;



            let _this = this;

            let image = new Image();
            image.src= logoPNG;
            image.onload=function(){
                let width = image.width;
                let height = image.height;
                let widthRadio = width/_this.imgWidthInit
                let heightRadio = height/_this.imgHeightInit
                if(widthRadio<1) {
                    _this.imgWidthInit = image.width;
                    if(heightRadio<1) {
                        _this.imgHeightInit = image.height;
                    } else {
                        _this.imgWidthInit = image.width/heightRadio;
                    }
                } else {
                    height = image.height/widthRadio;
                    heightRadio = height/_this.imgHeightInit
                    if(heightRadio<1) {
                        _this.imgHeightInit = height;
                    } else {
                        _this.imgWidthInit = _this.imgWidthInit/heightRadio
                    }
                }
                _this.imageSrc = image.src;
            };



            //后台请求数据
            let url = "/getnumber"+"?timestamp="+new Date().getTime();
            if(url) {
                this.$http.get(url, {

                }).then(res => {
                    if(res.data.success) {
                        _this.number = res.data.data;
                    } else {
                        alert(res.data.msg)
                    }
                    console.info(res.data);
                }).catch(err => {
                    debugger;
                    alert("后台响应错误："+err)
                });
            }
        },
        async mounted () {
            //图片事件
            previewImg(document.getElementsByTagName('img')[0])
            //阻止页面img的滑动默认事件
            document.getElementsByTagName('img')[0].onmousedown = function(e){
                e.preventDefault()
            };
            document.getElementsByTagName('img')[0].ontouchmove = function(e){
                e.preventDefault()
            };
            let _this = this;
            document.getElementById('name').onblur = function(e){
                console.info(e)
                _this.nameInputShow.position = "absolute";
                _this.nameInputShow.top = "-10000px";

                _this.nameContentHidden.position = "relative";
                _this.nameContentHidden.top = "0px";

                _this.name = e.currentTarget.value;

                _this.$forceUpdate();
            };
            document.getElementById('name').onfocus = function(){
                _this.nameContentHidden.position = "absolute";
                _this.nameContentHidden.top = "-10000px";

                _this.nameInputShow.position = "relative";
                _this.nameInputShow.top = "0px";
            };
        },
        data() {
            return {
                clientWidth: 0,
                clientHeight: 0,
                margin: 0,
                footerHeight: 0,
                contenterHeight: 0,
                postBoxWidth: 0,
                headbgHeight: 0,
                headbgSkewHeight: 0,
                footbgHeight: 0,
                textbgHeight: 0,
                textbgDistance: 0,
                textbgSkewHeight: 0,
                texterHeight: 0,
                texterDistance: 0,
                flags: false,
                positionValue: { x: 0, y: 0 },
                nx: '', ny: '', dx: '', dy: '', xPum: '', yPum: '',
                imageSrc: logoPNG,
                imgWidthInit: 0,
                imgHeightInit: 0,
                changeImgYDistance: 0,
                changeImgXDistance: 0,
                changeNameYDistance: 0,
                changeNameXDistance: 0,
                nameInputShow: {position: "relative", top: "0px"},
                nameContentHidden: {position: "absolute", top: "-10000px"},
                name: '',
                number: 0,
                sTouch: false,
                isDoubleTouch: false, //是否为多触点
                start: [], //存放触点坐标
                timer: null,
                now: null, delta: null, //当前时间，两次触发事件时间差
                startPosition: null, movePosition: null, endPosition: null,//滑动起点，移动，结束点坐标
                //事件声明
                gesturestart: new CustomEvent('gesturestart'),
                gesturechange: new CustomEvent('gesturechange'),
                gestureend: new CustomEvent('gestureend'),
                swipeMove: new CustomEvent('swipeMove'),
                doubleTouch: new CustomEvent("doubleTouch"),
                oneTouch: new CustomEvent("oneTouch"),
            }
        },
        methods: {
            down(event){
                console.info(this);
                let moveDiv = event.target;
                this.flags = true;
                let touch;
                if(event.touches){
                    touch = event.touches[0];
                }else {
                    touch = event;
                }
                this.positionValue.x = touch.clientX;
                this.positionValue.y = touch.clientY;
                this.dx = moveDiv.offsetLeft;
                this.dy = moveDiv.offsetTop;
            },
            move(event){
                if(this.flags){
                    let moveDiv = event.target;
                    let touch ;
                    if(event.touches){
                        touch = event.touches[0];
                    }else {
                        touch = event;
                    }
                    this.nx = touch.clientX - this.positionValue.x;
                    this.ny = touch.clientY - this.positionValue.y;
                    this.xPum = this.dx+this.nx;
                    this.yPum = this.dy+this.ny;
                    moveDiv.style.left = this.xPum+"px";
                    moveDiv.style.top = this.yPum +"px";
                }
            },
            //鼠标释放时候的函数
            end(){
                this.flags = false;
            },
            touchstart(e) {
                let _this = this;
                if (e.touches.length >= 2) { //判断是否有两个点在屏幕上
                    this.isDoubleTouch = true;
                    this.start = e.touches; //得到第一组两个点
                    let screenMinPoint = getMidpoint(this.start[0], this.start[1]); //获取两个触点中心坐标
                    this.gesturestart.midPoint = [screenMinPoint[0] - e.target.offsetLeft, screenMinPoint[1] - e.target.offsetTop]; //获取中心点坐标相对目标元素坐标
                    e.target.dispatchEvent(this.gesturestart);
                } else {
                    this.delta = Date.now() - this.now; //计算两次点击时间差
                    this.now = Date.now();
                    this.startPosition = [e.touches[0].pageX, e.touches[0].pageY];
                    if (this.delta > 0 && this.delta <= 250) { //双击事件
                        clearTimeout(this.timer);
                        this.doubleTouch.position = [e.touches[0].pageX - e.target.offsetLeft, e.touches[0].pageY - e.target.offsetTop];
                        e.target.dispatchEvent(this.doubleTouch);
                    } else { //滑动事件
                        this.timer = setTimeout(function(){ //单击事件
                            e.target.dispatchEvent(_this.oneTouch);
                        })

                    }
                    this.isTouch = true;
                }
            },
            touchmove(e) {
                let _this = this;
                clearTimeout(_this.timer);
                if (e.touches.length >= 2 && this.isDoubleTouch) { //手势事件
                    let now = e.touches; //得到第二组两个点
                    let scale = getDistance(now[0], now[1]) / getDistance(this.start[0], this.start[1]); //得到缩放比例
                    let rotation = getAngle(now[0], now[1]) - getAngle(this.start[0], this.start[1]); //得到旋转角度差
                    this.gesturechange.scale = scale.toFixed(2);
                    this.gesturechange.rotation = rotation.toFixed(2);
                    e.target.dispatchEvent(this.gesturechange);
                } else if (this.isTouch) {
                    this.movePosition = [e.touches[0].pageX, e.touches[0].pageY];
                    this.endPosition = this.movePosition;
                    this.movePosition = [this.movePosition[0] - this.startPosition[0], this.movePosition[1] - this.startPosition[1]];
                    this.startPosition = [e.touches[0].pageX, e.touches[0].pageY];
                    this.swipeMove.distance =[this.movePosition[0].toFixed(2) , this.movePosition[1].toFixed(2)];
                    e.target.dispatchEvent(this.swipeMove);
                }
            },
            touchend(e) {
                if (this.isDoubleTouch) {
                    this.isDoubleTouch = false;
                    this.gestureend.position = this.endPosition;
                    e.target.dispatchEvent(this.gestureend);
                }
            },
            createImage() {
                // html2canvas(document.querySelector(".contenter"),{
                //     dpi: window.devicePixelRatio * 4, // 对应屏幕的dpi，适配高清屏，解决canvas模糊问题
                //     scale: 2, // 缩放
                //     allowTaint: true, // 是否使用图片跨域
                //     useCORS: true, // 是否使用图片跨域
                //     // y: window.scrollY // 根据滚动条来截取--主要用于截取某一个区域
                // }).then(function(canvas){
                //     let imgUri = canvas.toDataURL("image/png");
                //     console.log(imgUri);//生成base64的编码图片
                //
                //     let a = document.createElement("img");
                //     a.id = "download";
                //     a.src = imgUri;
                //     document.body.appendChild(a);
                // })
                let _this = this
                this.beforeCreate();

                window.pageYOffset = 0;
                document.documentElement.scrollTop = 0
                document.body.scrollTop = 0

                let shareContent = document.querySelector('.contenter');//需要截图的包裹的（原生的）DOM 对象
                let width = shareContent.offsetWidth; //获取dom 宽度
                let height = shareContent.offsetHeight; //获取dom 高度
                let canvas = document.createElement("canvas"); //创建一个canvas节点
                // let scale = window.devicePixelRatio; //定义任意放大倍数 支持小数
                let scale = 2; //定义任意放大倍数 支持小数
                canvas.width = width * scale; //定义canvas 宽度 * 缩放
                canvas.height = height * scale; //定义canvas高度 *缩放
                canvas.style.width = width + "px";
                canvas.style.height = height + "px";
                // canvas.getContext("2d").scale(scale,scale); //获取context,设置scale

                let opts = {
                    dpi: window.devicePixelRatio * scale * 2,
                    scale: scale , // 添加的scale 参数
                    useCORS: true,
                    canvas:canvas, //自定义 canvas
                    logging: true, //日志开关
                    // y: window.scrollY // 根据滚动条来截取--主要用于截取某一个区域
                    width: width, //dom 原始宽度
                    height: height, //dom 原始高度
                    backgroundColor: 'null',
                };
                html2canvas(shareContent, opts).then(function (canvas) {
                    let context = canvas.getContext("2d");
                    context.imageSmoothingEnabled = false;
                    let imgUri = canvas.toDataURL("image/png");
                    let a = document.createElement("img");
                    a.src = imgUri;
                    a.style.position = "fixed";
                    a.style.opacity = 0;
                    a.style.backgroundColor = "red";
                    a.style.zIndex = 3;
                    a.style.top = "0px";
                    a.style.display = "block";
                    console.info(document.querySelector(".invite-poster-page"));
                    document.querySelector(".invite-poster-page").appendChild(a);


                    let div = document.createElement("div");
                    div.style.position = "fixed";
                    div.style.backgroundColor = "rgba(0, 0, 0,0.5)";
                    div.style.zIndex = 2;
                    div.style.top = "0px";
                    div.style.display = "block";
                    div.style.width = "100%";
                    div.style.height = "100px";
                    div.style.margin = "0 auto";
                    div.innerText = "长按屏幕保存图片";
                    div.style.color = "#FFF705";
                    div.style.lineHeight = "100px";
                    div.style.fontSize = "25px";
                    console.info(document.querySelector(".invite-poster-page"));
                    document.querySelector(".invite-poster-page").appendChild(div);


                    //后台请求数据
                    let url = "/create"+"?timestamp="+new Date().getTime();
                    if(url) {
                        _this.$http.get(url, {

                        }).then(res => {
                            if(!res.data.success) {
                                alert(res.data.msg)
                            }
                            console.info(res.data);
                        }).catch(err => {
                            debugger;
                            alert("后台响应错误："+err)
                        });
                    }
                })
            },
            imageUpload() {
                let filedom = document.getElementById('upload')
                let _this = this;
                filedom.onchange = function () {
                    let file = this.files[0];
                    if (window.FileReader) {
                        let reader = new FileReader();
                        reader.readAsDataURL(file);
                        //监听文件读取结束后事件
                        reader.onloadend = function(e) {
                            //图片显示区域恢复到初始宽高
                            _this.imgWidthInit = _this.imgWidthInitOringin;
                            _this.imgHeightInit = _this.imgHeightInitOrigin;

                            let image = new Image();
                            let data = e.target.result;
                            image.onload=function(){
                                let width = image.width;
                                let height = image.height;
                                let widthRadio = width/_this.imgWidthInit
                                let heightRadio = height/_this.imgHeightInit
                                if(widthRadio<1) {
                                    _this.imgWidthInit = image.width;
                                    if(heightRadio<1) {
                                        _this.imgHeightInit = image.height;
                                    } else {
                                        _this.imgWidthInit = image.width/heightRadio;
                                    }
                                } else {
                                    height = image.height/widthRadio;
                                    heightRadio = height/_this.imgHeightInit
                                    if(heightRadio<1) {
                                        _this.imgHeightInit = height;
                                    } else {
                                        _this.imgWidthInit = _this.imgWidthInit/heightRadio
                                    }
                                }
                                _this.imageSrc = image.src;

                                //图片事件
                                previewImg(document.getElementsByTagName('img')[0])
                            };
                            image.src= data;
                        };
                    }
                }
                filedom.click();
            },
            nameClick() {
                document.getElementById('name').focus();
            },
            beforeCreate() {
                this.nameInputShow.position = "absolute";
                this.nameInputShow.top = "-10000px";

                this.nameContentHidden.position = "relative";
                this.nameContentHidden.top = "0px";
            }
        }
    }
</script>

<style scoped>
    html {
        touch-action:none;
    }
    .invite-poster-page {
        position: relative;
        overflow: hidden;
    }
    .margin-left {
        position: absolute;
        z-index: 1;
        left:0px;
        background-color: #FFFFFF;
    }
    .margin-right {
        position: absolute;
        right:0;
        z-index: 1;
        background-color: #FFFFFF;
    }
    .post-box {
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }
    .footer {
        position: relative;
        width:100%;
        background-color: #FFFFFF;
    }
    .footer-contenter {
        position: absolute;
        transform: translate(-50%, -50%);
        left: 50%;
        top: 50%;
    }
    .contenter {
        position: relative;
        background-color: #FFFFFF;
    }
    .headbg {
        position: absolute;
        z-index: 1;
        background-image:url(../assets/010.png);
        width:100%;
        background-repeat:no-repeat;
        background-size:100% 101%;
        -webkit-background-origin:content-box; /* Safari */
        background-origin:content-box;
    }
    .footbg {
        position: absolute;
        bottom: 0px;
        background-image:url(../assets/04.png);
        width:100%;
        background-repeat:no-repeat;
        background-size:100% 100%;
        -webkit-background-origin:content-box; /* Safari */
        background-origin:content-box;
    }
    .texter {
        position: absolute;
        left: 0px;
        width: 100%;
        background-color: rgba(255,255,255,0);
        transform:rotate(-5.6deg);
        transform-origin: left;
        z-index: 1;
    }
    .texterMiddle {
        position: absolute;
        transform: translate(-50%, -50%);
        left: 50%;
        top: 50%;
        color: #FFFFFF;
        font-size: 20px;
        width: 100%;
        font-style: oblique;
    }
    .imgbg {
        position: absolute;
        width: 100%;
        top: 14%;
    }
    .dragdiv {
        position: relative;
    }
    #name {
        width: 100px;
        height: 24px;
        border: none;
        border-bottom: 2px solid white;
        background-color: #0044AA;
    }
















    .round:nth-child(1) {
        position:absolute;
        padding:13px;
        left:0px;
        top:79px;
    }
    .round:nth-child(1) div {
        /*background:#3a96e1;*/
    }
    .round:nth-child(1) div:first-child {
        width:40px;
        height:40px;
    }
    .round:nth-child(1) div:first-child span {
        line-height:40px;
    }
    .round:nth-child(1) div:nth-child(2) {
        width:40px;
        height:40px;
    }
    .circle span {
        font-size:12px;
        line-height:40px;
        color:#0044AA;
        font-weight:bold;
    }
    .circle {
        border-radius:100%;
        width:40px;
        height:40px;
        z-index:999;
        text-align:center;
        top:18px;
        left:18px;
        position:absolute;
    }
    .circle_bottom {
        background:rgba(58,150,225,0.4);
        border-radius:100%;
        width:40px;
        height:40px;
        filter:alpha(opacity=40);
        z-index:800;
        position:absolute;
        top:18px;
        left:18px;
    }
    .animation {
        ;-webkit-animation:twinkling 2.1s infinite ease-in-out;
        animation:twinkling 2.1s infinite ease-in-out;
        -webkit-animation-fill-mode:both;
        animation-fill-mode:both;
    }
    @-webkit-keyframes twinkling {
        0% {
            opacity:0.2;
            filter:alpha(opacity=20);
            -webkit-transform:scale(1);
        }
        50% {
            opacity:0.5;
            filter:alpha(opacity=50);
            -webkit-transform:scale(1.5);
        }
        100% {
            opacity:0.2;
            filter:alpha(opacity=20);
            -webkit-transform:scale(1);
        }
    }
    @keyframes twinkling {
        0% {
            opacity:0.2;
            filter:alpha(opacity=20);
            -webkit-transform:scale(1);
        }
        50% {
            opacity:0.5;
            filter:alpha(opacity=50);
            -webkit-transform:scale(1.5);
        }
        100% {
            opacity:0.2;
            filter:alpha(opacity=20);
            -webkit-transform:scale(1);
        }
    }
</style>
