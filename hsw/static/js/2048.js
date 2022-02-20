/**
 * Created by chencheng on 2017/9/24.
 */

var $heightScore ;
var $score ;
var $main ;
var n = 4;//多少行多少列
var items = [];//数字列表 
var isMerge = false;
var historyHtml = [];//记录历史操作
var historyScores = [];//记录历史分数
var second = 0;

$(function () {
    $heightScore = $("#heightScore");
    $score = $("#score");
    $main = $("#main");

    newGame();

    //按键事件
    document.onkeydown=function keyEvent(ev){
        var oE=ev||event;
        if(oE.keyCode===97||oE.keyCode===37){//如果是字母a，向左
            left();
        }else if(oE.keyCode===100||oE.keyCode===39){//如果是字母d，向右
            right();
        }else if(oE.keyCode===115||oE.keyCode===40){//如果是字母s，向下
            down();
        }else if(oE.keyCode===119||oE.keyCode===38){//如果是字母w，向上
            up();
        }
    };

/*    //手机屏幕触摸事件
    $(document).touchwipe({
        wipeLeft: function() { left(); },
        wipeRight: function() { right(); },
        wipeUp: function() { down(); },
        wipeDown: function() { up(); },
        min_move_x: 50,
        min_move_y: 50,
        preventDefaultEvents: true
    });*/

});

/**
 * 开始游戏
 */
function newGame(){
    $main.html("");//清空
    items = [];
    historyScores = [];
    historyHtml = [];
    second = 0;
    //初始化
    for (var i = 0; i < n*n; i++){
        var temp=document.createElement("div");
        items.push($(temp));
        $main.append(temp);
    }

    resetScore();//重置分数

    randomDiv();//生成第一个数字

    countdown();//开始倒计时
}

/**
 * 重置分数
 */
function resetScore() {
    //获取本地最高分数
    if (window.localStorage){
        var heightScore = window.localStorage.getItem('heightScore');
        if (heightScore){
            $heightScore.html(heightScore);
        }else {
            $heightScore.html(0);
        }
    }
    //重置本次游戏分数
    $score.html("0");
}

/**
 *  如果还有空间随机生成一个数字4或2，否则不生成。
 */
function randomDiv() {
    var temp = [];
    for (var i = 0 ; i < items.length; i++){
        if (!items[i].html()){
            temp.push(items[i]);
        }
    }
    if (temp.length === 0){
        return;
    }

    var ranItem = temp[Math.floor((Math.random()*temp.length))];
    var ranNum = Math.random() > 0.7 ? 4:2;
    ranItem.html(ranNum);
    ranItem.addClass("d"+ranNum);

    if ($("#musicSwitch").html() === '关闭音效') {
        if (isMerge) {
            isMerge = false;
            $("#mergeMusic")[0].play();
        } else {
            $("#randomMusic")[0].play();
        }
    }

    isGameOver();//检查是否结束
}

/**
 * 是不是游戏结束了
 */
function isGameOver(){
    if(!isCanMoveOrMerge()){
        setTimeout(function(){
            if(confirm("游戏结束！是否重新开始?")){
                newGame();
            }
        },500);
    }
}
//记录历史操作
function addToHistory() {
    if (historyHtml.length === 10){//最多保存10步
        historyHtml.shift();
        historyScores.shift();
    }
    historyHtml.push($main.html());
    historyScores.push($("#score").html());
}
/**
 * 是否可以移动或者合并
 * @returns {boolean}
 */
function isCanMoveOrMerge(){
    for(var i = 0; i < items.length; i++){
        var $item = items[i];
        if (!$item.html()){//如果为空，表示可以移动
            return true;
        }

        var upIndex = i-n, downIndex = i+n, leftIndex = i-1, rightIndex = i+1;
        if ((i+1) % n === 1){//最左边，左边没数字
            leftIndex = -1;
        }
        if ((i+1) % n === 0){//最右边，右边没数字
            rightIndex = -1;
        }
        if (i < n){//最上边，上边没数字
            upIndex = -1;
        }
        if (i > n*n - 1 - n){//最下边，下边没数字
            downIndex = -1;
        }
        var upValue = upIndex > 0 ? items[upIndex].html() : -1;
        var downValue = downIndex > 0 ? items[downIndex].html() : -1;
        var leftValue = leftIndex > 0 ? items[leftIndex].html() : -1;
        var rightValue = rightIndex > 0 ? items[rightIndex].html() : -1;

        var itemValue = $item.html();
        if (itemValue === upValue || itemValue === downValue || itemValue === leftValue || itemValue === rightValue){//可以合并
            return true;
        }
    }
    return false;
}

function up() {
    if (isCanMoveOrMerge()){
        addToHistory();//记录历史

        var isMergeOrMove = false;
        for (var i = n*n-n; i < n*n; i++){
            var array = [];
            for (var j = i ; j >= 0; j-=4){
                array.push(items[j]);
            }
            if(mergeAndMove(array)){
                isMergeOrMove = true;
            }
        }

        if (isMergeOrMove) {
            randomDiv();
        }else {
            historyHtml.pop();
            historyScores.pop()
        }
    }
}

function down() {
    if (isCanMoveOrMerge()){
        addToHistory();//记录历史

        var isMergeOrMove = false;
        for (var i = 0; i < n; i++){
            var array = [];
            for (var j = i ; j < n*n; j+=4){
                array.push(items[j]);
            }
            if(mergeAndMove(array)){
                isMergeOrMove = true;
            }
        }


        if (isMergeOrMove) {
            randomDiv();
        }else {
            historyHtml.pop();
            historyScores.pop()
        }
    }
}

function left() {
    if (isCanMoveOrMerge()){
        addToHistory();//记录历史

        var isMergeOrMove = false;
        for (var i = n-1; i < n*n; i+=4){
            var array = [];
            for (var j = i ; j > i-n; j--){
                array.push(items[j]);
            }
            if(mergeAndMove(array)){
                isMergeOrMove = true;
            }
        }


        if (isMergeOrMove) {
            randomDiv();
        }else {
            historyHtml.pop();
            historyScores.pop()
        }
    }
}

function right() {
    if (isCanMoveOrMerge()){
        addToHistory();//记录历史

        var isMergeOrMove = false;
        for (var i = 0; i < n*n; i+=4){
            var array = [];
            for (var j = i ; j < i+n; j++){
                array.push(items[j]);
            }
            if(mergeAndMove(array)){
                isMergeOrMove = true;
            }
        }


        if (isMergeOrMove) {
            randomDiv();
        }else {
            historyHtml.pop();
            historyScores.pop()
        }
    }
}

function mergeAndMove(array){
    var curValue, preValue;
    var isMergeOrMove = false;
    //合并
    for(var i = array.length-1; i > 0; i--){
        curValue = array[i].html();
        if (!curValue){//跳过空格
            continue;
        }

        for(var j=i-1; j >= 0; j--){
            preValue = array[j].html();
            if (!preValue){//跳过空格
                continue
            }
            if (preValue !== curValue){//数字不同，不能合并
                break;
            }else {//进行合并
                setDiv(array[i], curValue*2);
                setDiv(array[j], 0);
                addScore(curValue);//增加分数
                isMergeOrMove = true;
                isMerge = true;
                break;
            }
        }
    }

    //移动
    for(var i = array.length-1; i > 0 ; i--){
        curValue = array[i].html();
        if (curValue){
            continue;
        }
        for(var j = i-1; j >= 0; j--){
            preValue = array[j].html();
            if (!preValue){
                continue;
            }
            setDiv(array[i],preValue);
            setDiv(array[j],0);
            isMergeOrMove = true;
            break;
        }
    }
    return isMergeOrMove;
}

/**
 * 设置div的内容和样式
 */
function setDiv($item,num){
    if(num===0){
        $item.html("");
        $item.attr("class","");
    }else{
        $item.html(num);
        $item.attr("class","d"+num);
    }
}

//更新分数
function addScore(cscore) {
    var score = parseInt($score.html()) + parseInt(cscore);
    $score.html(score);

    var heightScore = parseInt($heightScore.html());
    if (score > heightScore){
        $heightScore.html(score);
        if (window.localStorage){
            localStorage.setItem("heightScore",score);
        }
    }

    cscore = parseInt(cscore);
    if(cscore*2 === 2048 || cscore*2 === 4096 || cscore*2 === 8192){
        setTimeout(function(){
            if(!confirm("哎哟，不错哦。是否继续?")){
                // isContinue=false;
            }
        },500);
    }
}

//音乐开关
function musicSwitch(){
    var $musicSwitch = $("#musicSwitch");
    if ($musicSwitch.html() === '关闭音效'){
        $musicSwitch.html('开启音效');
    }else {
        $musicSwitch.html('关闭音效');
    }
}

//重新开始
function reStart() {
    if(!confirm("真的要重新开始吗？")){
        return;
    }
    newGame();
}

//上一步
function preOperate() {
    if (historyHtml.length > 0){
        $("#score").html(historyScores.pop());
        $main.html(historyHtml.pop());
        items = [];
        $("#main").find('div').each(function () {
            items.push($(this));
        });
    }else {
        alert("不能再退了");
    }
}

function countdown() {
    setInterval(function () {
        second++;
        $("#logo").html(second)
    },1000);
}
