// @auther: yedonglai
// @time: 2022/12/17
// @File: index.js
// @name: web期末项目作业
// @email: donglog69@163.com

//全局变量
//定义存储数组
let dataChunks =[];
let recorder;
let downloadButton =document.getElementById("download");
let username = document.getElementById("username");
let textarea = document.getElementById("txt");


//相馆
// 打开摄像头功能
function getMedia(){
    let constraints ={
        //定义大小
        video:{width:500,height:500}, 
        audio:true
    };
    //定义video对象
    let video =document.getElementById("video");
    //返回一个 Promise 对象，成功后会resolve回调一个 MediaStream 对象
    //请求打开摄像头
    var promise = navigator.mediaDevices.getUserMedia(constraints);
    //console.log(promise);
    promise.then(function(MediaStream){
        video.srcObject =MediaStream;
        video.onloadedmetadata =function(e){
            video.play();
        };
    })
    promise.catch(function(err){
        console.log(err.name + ": " + err.message);
        // 总是在最后检查错误
    });
}
// 拍照截图的功能
function takephoto(){
    //定义canvas对象并调参
    var canvas = document.getElementById("canvas");
    //创建一个CanvasRenderingContext2D对象作为2D渲染的上下文。
    var ctx = canvas.getContext('2d');
    //截图在canvas绘画上面
    var photo = ctx.drawImage(video, 0, 0,500,500);
    //转换程jpg格式
    // var type = 'image/jpg';
    // var dataurl = canvas.toDataURL(type);
}

//关闭摄像头
function stopVideo(videoElem){
    const stream = videoElem.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(function(track) {
        track.stop();
    });

    videoElem.srcObject = null;
}
//录制
function startRecorder(){
    var videocheck = document.getElementById("video");
    var stream =videocheck.srcObject ;
    videocheck.captureStream = videocheck.captureStream || videocheck.mozCaptureStream;
    recorder = new MediaRecorder(videocheck.captureStream());
    downloadButton.href = stream;
    if(stream){
        console.log(recorder);
        recorder.ondataavailable =(event) =>{
            let data =event.data;
            dataChunks.push(data);
        } 
        recorder.start(1000);
        console.log(recorder.state + "开始录制中");
    }else{
        console.log("摄像头都没开")
        alert("摄像头都没开")
    }
}
//停止录像
function stopRecorder(){
    var videocheck = document.getElementById("video");
        const stream = videocheck.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(function(track) {
            track.stop();
    });
    recorder.stop();
    //图像存储格式
    let recordedBlob = new Blob(dataChunks,{ type:"video/mp4"} );
    var recordstop =document.getElementById("stop");
    recordstop.src = URL.createObjectURL(recordedBlob);
    //下载格式定义
    downloadButton.href = recordstop.src;
    downloadButton.download = "RecordedVideo.mp4";
}

//本地存储版-留言板
var arr=[];
window.onload = function(){
    //保存
    if(localStorage.arrayes){
        arr=JSON.parse(localStorage.arrayes);
        showmessage(arr);
    }else{
        arr=[];
    }
}
//校验按钮
function textfunction(){
    if(textarea.value == ''||username.value == ''){
        alert("请输入你的昵称和留言")
    }
    else{
        //创建对象组
        var obj = {
            name: username.value,
            content: textarea.value,
            time: timer()
        }
        //将新项添加到数组起始位置
        console.log(obj);
        arr.unshift(obj);
        //进行存储
        localStorage.arrayes =JSON.stringify(arr);
        console.log(localStorage.arrayes);
        showmessage(arr);
    }
}
//留言板渲染
function showmessage(arr){
    var str='';
    //获取留言div
    var contents = document.getElementById("content");
    for(var i=0;i<arr.length;i++){
        str +=`
            <div class = "list">
                昵称：<span class="nicheng">${arr[i].name} </span>
                <br/>
                <span class="liuyan">${arr[i].content}</span>
                <span class="timearea">${arr[i].time}</span>
                <button onclick="del(${arr[i].id})">删除</button>
                <hr style="width: 20%;"/>
            </div>
        `
    }
    contents.innerHTML = str;
}
//删除同样的留言函数
function del(id){
    arr.forEach(function(ele,index){
        if(id == arr[index].id){
            arr.splice(index,1);
            showmessage(arr);
            localStorage.arrayes = JSON.stringify(arr);
        }
    })
}
//获取时间
function timer(){
     var now = new Date()
     var month = now.getMonth()+1
     var day = now.getDate()
     var hours = now.getHours()
     var min = now.getMinutes()
     var result = check(month)+"月"+check(day)+"日"+check(hours)+":"+check(min)
     return result
}
//检查时间少于10前面添上0
function check(n){
    n = n<10 ? "0"+n : n;
    return n
}
