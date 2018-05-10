var rtc = null;
var common = {
	init: function(){
		var _this = this;
		$.ajax({
	        url: "https://ccapi.csslcloud.net/api/room/auth",
	        type: "GET",
	        dataType: "json",
	        data: {
    		    userid: _this.userid,
			    roomid: _this.roomid, 
			    name: _this.name, 
			    password: _this.password,
			    role: _this.role, 
			    client: "0" //登录客户端类型：0: 浏览器， 1: 移动端 （必填）
	        },
	        success: function (data) {
        		console.log(data);
        		if(data.result === 'OK'){
        			var data = data.data;
        			var sessionid = data.sessionid;
        			
        			console.log(sessionid);
        			common.login(sessionid);
        			
        		}else{
        			alert('登录接口验证失败');
        		}
			}
	    });
	},
	
	login: function(sessionid){
		//初始化
		rtc = new Rtc({
            userid: this.userid, // 用户ID
            sessionid: sessionid
        });

					
		rtc.on('login_success', function (data) {
		  	// 登录成功
			console.log(data,'login_success');
		  	
		  	
		});	
		
		rtc.on('login_failed', function (err) {
		    // 登录失败
		    console.error('登录失败',err);
		});
		
		rtc.on('conference_join', function (streams) {
			console.log('conference_join', streams);
            streams.map(function (stream) {
                rtc.trySubscribeStream(stream, null, function(flag, value){
					if(flag){
                        // 订阅流成功
                        var streamId = value.id(); // 获取流id
                        console.log('订阅流成功', streamId);
                        //将视频动态插入盒子中
                        var li = document.createElement('li');
                        li.setAttribute('id', streamId);
                        otherList.appendChild(li);
                        stream.show(streamId);
					}else{
						console.log(value);
					}
				});
            });
		});
		
		rtc.on('conference_join_failed', function (err) {
		    // 加入房间失败
		    console.log('加入房间失败',err);
		});

	
		rtc.on('stream_removed', function (id) {
		    // 删除流
		    console.log('stream_removed', id);
		    var eid = document.getElementById(id);
		    if(eid){
                otherList.removeChild(eid);
			}

		});

        rtc.on('stream_added', function (stream) {
            // 订阅流
            console.log('stream_added', stream);
            rtc.trySubscribeStream(stream, null, function(flag, value){
                if(flag){
                    // 订阅流成功
                    var streamId = value.id(); // 获取流id
                    console.log('订阅流成功', streamId);

                    //将视频动态插入盒子中
                    var li = document.createElement('li');
                    li.setAttribute('id', streamId);
                    otherList.appendChild(li);
                    stream.show(streamId);
                }else{
                    console.log(value);
                }
            });

        });

        rtc.on('server_disconnected', function (stream) {
            // 订阅流
            otherList.innerHTML='';

        });


    }
};




console.log('使用此demo前，必须确保你的roomid、userid、passeord、role是可用的');    
//初始化	，传入房间id，用户id
common.roomid = 'A44FDE22E64D639F9C33DC5901307461';
common.userid = '41E8063FC799ACE5';
common.name = 'bobo'+ parseInt(Math.random()*100) ;
common.password ='111';//# 登陆密码 （如果登陆role是旁听者 或是 互动者，且支持免密码登录，则可不填，其余必填）
common.role = 0;// 登录角色 0: 教师 ,    1:互动者，   2: 旁听者

common.init();






//页面已存在dom元素
var otherList = document.getElementById('others');
var open_live = document.getElementById('open_live');
var close_live = document.getElementById('close_live');
var creat_stream = document.getElementById('creat_stream');
var publish_stream = document.getElementById('publish_stream');






//创建本地流
$(creat_stream).on('click',function(){
	rtc.createLocalStream(null, null, function(flag, value){
		if(flag){
            console.log('本地流创建成功',value.attr('userid'));
            value.show('my'); // 显示流
		}else{
			alert(value);
		}
	});
});

//推送本地流
$(publish_stream).on('click',function(){
    rtc.publish(200, function(flag, value){
    	if(flag){
            console.log('本地流推送成功', value.id());
		}else{
    		alert(value);
		}
	});
});
function mix(s, callback){
	rtc.mix(s,	mix, function(f, v){
		if(f){
			console.log(v);
		}else{
            console.log(v);
		}
	});
}

$(close_live).on('click',function(){
    rtc.stopLive(function(flag, value){
    	if(flag){
			console.log(value);
		}else{
            alert(value);
		}
	});
});

$(open_live).on('click',function(){
    rtc.startLive(function(flag, value){
        if(flag){
            console.log(value);
        }else{
            alert(value);
        }
    });
});

$('#close_my_vodeo').on('click', function(){
    rtc.closeVideo();
});

//停止推送本地流
$('#unpublish_stream').on('click', function(){

	rtc.unPublish(function(flag, value){
		if(flag){
			console.log('停止推送本地流成功');
		}else{
			alert(value);
		}
	});
});

//检查直播状态
$('#check_status').on('click', function(){
    rtc.getLiveStat(function(flag, value){
        if(flag){
            console.log(value);
        }else{
            console.log(value)
        }
	});
});

$('#close_audio').on('click', function(){
	rtc.pauseAudio(function(flag){
		if(flag){
			console.log('操作成功')
		}else{
            console.log('操作失败')
		}
	});
});

$('#open_audio').on('click', function(){

	rtc.playAudio(function(flag){
		if(flag){
			console.log('操作成功')
		}else{
			console.log('操作失败')
		}
	});

});

$('#close_video').on('click', function(){

	rtc.pauseVideo(function(flag){
        if(flag){
            console.log('操作成功')
        }else{
            console.log('操作失败')
        }
    });


});
$('#open_video').on('click', function(){

	rtc.playVideo(function(flag){
		if(flag){
			console.log('操作成功')
		}else{
			console.log('操作失败')
		}
	});

});

$('#cdn_add').on('click', function(){
    rtc.addExternalOutput();
});


$('#remove_cdn_add').on('click', function(){
    rtc.removeExternal(null, function(flag, value){
        console.log(value);
    });
});

$('#update_cdn').on('click', function(){
    rtc.updateExternalOutput('rtmp://push-cc1.csslcloud.net/origin/' + rtc.roomid, function(flag, value){
        console.log(value);
    });
});

$('#leave').on('click', function(){
    rtc.leave();
});

$('#join').on('click', function(){
	rtc.join();
});

$('#mix').on('click',function(){
	rtc.mix(null, function(v,f){
		if(v){
			console.log(f);

		}else{
            console.log(f);
		}
	})
});

$('#unmix').on('click',function(){
    rtc.unMix(null, function(v,f){
        if(v){
            console.log(f);
            rtc.setRegion(rtc.localStream.id());
        }else{
            console.log(f);
        }
    })
});

$('#setRegion').on('click',function(){
	var obj = {id: rtc.localStream.id(), region: '1'};
	rtc.setRegion(obj);
	
});


$('#getConnectionStats').on('click', function(){
	rtc.getConnectionStats(rtc.localStream, function(f,v){
		if(f){
			console.log(v);
		}else{
			console.log(v);
		}
	});
})


//卸载页面关闭本地流和本地远程流
window.onbeforeunload = function(){
	rtc.closeVideo();
	rtc.close();
};
 


	
