<template>
    <div class="invite-poster-page" v-bind:style="{ width:clientWidth+'px' }">
        <div class="margin-left" v-bind:style="{ width: margin+'px', minHeight:clientHeight+'px' }"></div>
        <div class="margin-right" v-bind:style="{ width: margin+'px', minHeight:clientHeight+'px' }"></div>
        <div class="post-box" v-bind:style="{ width: postBoxWidth+'px', minHeight:clientHeight+'px' }">
            <div class="contenter" v-bind:style="{ minHeight:contenterHeight+'px' }">
                <div class="headbg" v-bind:style="{ height:headbgHeight+'px'}">

                </div>
                <div class="imgbg" style="{ height:100% }">
                    <div class="dragdiv">
                        <img style="position: relative;" src="../assets/logo.png" draggable="true" @mousedown="down" @touchstart="down" @mousemove="move" @touchmove="move" @mouseup="end" @touchend="end">
                    </div>
                </div>
                <div class="texter" v-bind:style="{ height:texterHeight+'px', top: texterDistance+'px' }">
                    <div style="position: relative; width:100%; height: 100%;">
                        <div class="texterMiddle">
                            <div><span style="color:#E7DA71">我是</span><span style="margin-left:10px;letter-spacing:8px;font-weight: 800;font-size: 23px;">郭富城</span></div>
                            <div style="margin-left: 90px;margin-top: 0px;">我是第<span style="color:#E7DA71; margin: 0 5px">8888</span>位宣誓人</div>
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
    import { Button } from 'vant';

    export default {
        name: 'ImagePost',
        components: {
            [Button.name]: Button
        },
        created() {
            this.clientWidth = document.documentElement.clientWidth;
            this.clientHeight = document.documentElement.clientHeight;
            this.postBoxWidth = this.clientWidth*0.9;
            this.contenterHeight = this.postBoxWidth*1.78;
            this.footerHeight = this.clientHeight*0.1;
            this.headbgHeight = this.postBoxWidth/1.8;
            this.headbgSkewHeight = this.postBoxWidth/2.2;
            this.footbgHeight = this.postBoxWidth/1.3;
            this.textbgHeight = this.postBoxWidth/2.84;
            this.textbgDistance = this.contenterHeight/1.73;
            this.textbgSkewHeight = this.postBoxWidth/9.8;
            this.texterHeight = this.textbgHeight-this.textbgSkewHeight;
            this.texterDistance = this.contenterHeight/1.57;
            this.margin = (this.clientWidth*0.1)/2;
        },
        async mounted () {
            //阻止页面img的滑动默认事件
            document.getElementsByTagName('img')[0].onmousedown = function(e){
                e.preventDefault()
            };
            document.getElementsByTagName('img')[0].ontouchmove = function(e){
                e.preventDefault()
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

                window.pageYOffset = 0;
                document.documentElement.scrollTop = 0
                document.body.scrollTop = 0

                var shareContent = document.querySelector('.contenter');//需要截图的包裹的（原生的）DOM 对象
                var width = shareContent.offsetWidth; //获取dom 宽度
                var height = shareContent.offsetHeight; //获取dom 高度
                var canvas = document.createElement("canvas"); //创建一个canvas节点
                var scale = window.devicePixelRatio; //定义任意放大倍数 支持小数
                // var scale = 3; //定义任意放大倍数 支持小数
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
                    // width: width, //dom 原始宽度
                    // height: height, //dom 原始高度
                    // backgroundColor: 'null',
                };
                html2canvas(shareContent, opts).then(function (canvas) {
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
                    div.style.backgroundColor = "rgba(171, 171, 171,0.5)";
                    div.style.zIndex = 2;
                    div.style.top = "0px";
                    div.style.display = "block";
                    div.style.width = "100%";
                    div.style.height = "100px";
                    div.style.margin = "0 auto";
                    div.innerText = "长按屏幕保存图片";
                    div.style.color = "#424040";
                    div.style.lineHeight = "100px";
                    div.style.fontSize = "25px";
                    console.info(document.querySelector(".invite-poster-page"));
                    document.querySelector(".invite-poster-page").appendChild(div);

                })
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
        justify-content: space-between;
    }
    .footer {
        position: relative;
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
        position: relative;
        z-index: 1;
        background-image:url(../assets/011.png);
        width:100%;
        background-repeat:no-repeat;
        background-size:100% 100%;
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
    }
    .imgbg {
        position: absolute;
        width: 100%;
    }
    .dragdiv {
        position: relative;
    }
</style>
