/*
 * 两点的距离
 */
export function getDistance(p1, p2) {
    var x = p2.pageX - p1.pageX,
        y = p2.pageY - p1.pageY;
    return Math.sqrt((x * x) + (y * y));
}
/*
 * 两点的夹角
 */
export function getAngle(p1, p2) {
    var x = p1.pageX - p2.pageX,
        y = p1.pageY - p2.pageY;
    return Math.atan2(y, x) * 180 / Math.PI;
}
/*
 * 获取中点
 */
export function getMidpoint(p1, p2) {
    var x = (p1.pageX + p2.pageX) / 2,
        y = (p1.pageY + p2.pageY) / 2;
    return [x, y];
}

/*
 * 事件处理
 */
export function previewImg(imgdom) {

    var $imgs = imgdom;

    var imgWidth = parseInt(window.getComputedStyle($imgs).width); //图片宽
    var imgHeight = parseInt(window.getComputedStyle($imgs).height); //图片高

    $imgs.addEventListener('gesturestart', gesturef, false);
    $imgs.addEventListener('gesturechange', gesturef, false);
    $imgs.addEventListener('gestureend', gesturef, false);
    $imgs.addEventListener('swipeMove', gesturef, false);
    $imgs.addEventListener('doubleTouch', gesturef, false);
    $imgs.addEventListener('oneTouch', gesturef, false);


    var tMatrix = [1, 0, 0, 1, 0, 0]; //x缩放，无，无，y缩放，x平移，y平移
    var originLast, maxSwipeLeft = imgWidth*2, maxSwipeRight = imgWidth*2, maxSwipeTop = imgHeight*2, maxSwipeBottom = imgHeight*2; //上下左右可拖动距离

    function maxMove() {
        //最大可拖动范围
        var sca = tMatrix[0];
        maxSwipeLeft = Math.abs(sca - 1) * originLast[0];
        maxSwipeRight = Math.abs(sca - 1) * (imgWidth - originLast[0]);
        maxSwipeTop = Math.abs(sca - 1) * originLast[1];
        maxSwipeBottom = Math.abs(sca - 1) * (imgHeight - originLast[1]);
    }

    function gesturef(event) {

        switch (event.type) {
            case "gesturestart":
                var x = event.midPoint[0];
                var y = event.midPoint[1];
                originLast = event.midPoint;
                $imgs.style.transformOrigin = x + "px " + y + "px";
                break;

            case "gesturechange":
                var sc = parseFloat(event.scale);
                tMatrix[0] = tMatrix[0] + sc - 1 > 0.5 && tMatrix[0] + sc - 1 < 3 ? tMatrix[0] + sc - 1 : tMatrix[0];
                tMatrix[3] = tMatrix[3] + sc - 1 > 0.5 && tMatrix[3] + sc - 1 < 3 ? tMatrix[3] + sc - 1 : tMatrix[3];
                var temp = tMatrix.join(",");
                $imgs.style.transform = "matrix(" + temp + ")";
                break;

            case "gestureend":
                maxMove();
                break;

            case "swipeMove":
                if (!maxSwipeLeft || !maxSwipeRight || !maxSwipeTop || !maxSwipeBottom) return;
                if (event.distance[0] > 0 && maxSwipeLeft < tMatrix[4]) return;
                if (event.distance[0] < 0 && maxSwipeRight < -tMatrix[4]) return;
                if (event.distance[1] > 0 && maxSwipeTop < tMatrix[5]) return;
                if (event.distance[1] < 0 && maxSwipeBottom < -tMatrix[5]) return;

                tMatrix[4] = tMatrix[4] + parseInt(event.distance[0]);
                tMatrix[5] = tMatrix[5] + parseInt(event.distance[1]);

                temp = tMatrix.join(",");
                $imgs.style.transform = "matrix(" + temp + ")";
                break;

            case "doubleTouch":
                originLast = event.position;
                $imgs.style.transformOrigin = event.position[0] + "px " + event.position[1] + "px";
                tMatrix[0] = 2;//缩放倍数为2
                tMatrix[3] = 2;
                temp = tMatrix.join(",");
                $imgs.style.transform = "matrix(" + temp + ")";
                maxMove();
                break;

            case "oneTouch":

                break;
        }


    }
}
