//Http://thepaper.cn, By Jgl@thepaper.cn, 2014-11-17
//制作人员：蔺涛、季国亮、赵冠群、吴恒、吕妍、赵佳峰、黄志强

// loader

$(function(){
    loadImages()
    function loadImages(){
        var imgs = [];
        $.each($('.container img'), function(){
            imgs.push($(this).attr('src'));
        });
        var loader = new createjs.LoadQueue();
        loader.setMaxConnections(30);
        loader.on('complete', function(){
            $('#loading').fadeOut();
            $('.cover').addClass('loaded');
        });
        loader.on('progress', function(e){
            $('#persent').text(((this.progress+0.000)*100).toFixed(0)+'%');
        });
        loader.on('error', function(){
            alert("加载图片失败，请尝试重新进入页面");
        });
        loader.loadManifest(imgs);
    }
    /*global paras*/
    var $window = $(window);
    var winWidth = $window.width(),
        winHeight =$window.height()
        pc_width = 800;
    var bgaudio = document.getElementById('bg-audio');
    //user event parameters
    var ue={
            startY:0,
            endY:0,
            minDistance:50,
            cur_slide:0,
            nex_slide:0,
            eOrient:'a',
            slide_count:0
        }
    //detect mobile device;
    function isMobile() {
        return /iPad|iPod|iPhone|Android/.test(navigator.userAgent);
    }
    //detect whether opened in weixin app;
    var isWeixin = function (){
        return /MicroMessenger/.test(navigator.userAgent);
    }
    //wei xin share bridge;
    function onBridgeReady() {
        WeixinJSBridge.on('menu:share:appmessage', function(argv)
        {
            WeixinJSBridge.invoke('sendAppMessage',{
                        "link":share_link,
                        "desc":descContent,
                        "title":shareTitle,
                        'img_url': imgUrl
            }, function(res) {
            });
        });
        WeixinJSBridge.on('menu:share:timeline', function(argv)
        {
        WeixinJSBridge.invoke("shareTimeline",{
                           "link":share_link,
                        "desc":descContent,
                        "title":shareTitle+"。"+descContent,
                        'img_url': imgUrl
            },
            function(e){
            })
        });
    }
    /*add wei xin share tip*/
    function addWeixinTip(){
        $('.main').append("<div class='weixin-tip'></div>");
        var $weixin_tip = $('.weixin-tip')
                                .append('<div class="absolute tip-arrow"></div>')
                                .append('<div class="mt100"><p>请点击右上角</p><p>【分享到朋友圈】</p><p>或</p><p>【发送给朋友】</p></div>')
                                .append('<div class="logo"><a href="http://thepaper.cn"><img src="assets/paper-logo.svg"/></a></div>')
                                .click(function(){
                                    $(this).fadeOut('fast',function(){$(this).remove();});
                                    });
    }

    function setDimension(){
        winWidth = $window.width();
        winHeight =$window.height();
        var box_width = (isMobile())?winWidth:pc_width;
        $('.c-box').width(box_width).height(winHeight);
        if(!isMobile()){
            $('.fixed-tip').css('right',function(){return (winWidth-pc_width)/2+10+'px';});
            $('.prompt-m').css('display','none');
            $('.prompt-pc').css('display','block');
        }
    }

	function swipe(){
	    $('#page-count').fadeIn().html((ue.nex_slide+1)+'/'+ue.slide_count);
		$('.promt-arrow').css('display','block');
	    if(ue.nex_slide<0){
	        ue.cur_slide = ue.nex_slide=0;
	        $('#page-count').fadeIn().html(1+'/'+ue.slide_count);
	    }else if(ue.nex_slide<ue.slide_count){
	        $('.slide-in').removeClass('slide-in');
	        $('.slide-out').removeClass('slide-out');
	        $('.slide').eq(ue.cur_slide).addClass('slide-out');
	        $('.slide').eq(ue.nex_slide).addClass('slide-in');
	        ue.cur_slide = ue.nex_slide;
	    }
        if(ue.nex_slide>=(ue.slide_count-1)){
	        $('.sound-btn').fadeOut();
	        $('#page-count, .promt-arrow').css('display','none');
	    }
	}

	function started (event){
	    if(event.originalEvent.targetTouches){
	        ue.startY = event.originalEvent.targetTouches[0].clientY;
	    }else{
	        ue.startY = event.clientY;
	    }
	}
	function moved (event){
	    event.preventDefault();
	    if(ue.startY>0){
	        if(event.originalEvent.targetTouches){
	        ue.endY = event.originalEvent.changedTouches[0].clientY;
	    }else{
	        ue.endY = event.clientY;
	        }
	     }
	}
	function ended (event){
	    var  yDis = ue.endY - ue.startY;
	    if(Math.abs(yDis)>ue.minDistance&&ue.endY>0){
	        ue.nex_slide = yDis>0? ue.cur_slide-1:ue.cur_slide+1;
	        swipe();
	    }else{
	    	ue.startY = ue.endY=0;
	    }
	}

    //winRation
    var winRation = winWidth/winHeight;
    if(winRation>1&&isMobile()){
    	$('#turn-box').css({'display':'block','opacity':1});
    }
    $('#turn-box').off('mousedown touchstart');

    setDimension()
    ue.slide_count = $('.container .slide').length;

    $('.cover,.container').on('mousemove mouseup touchstart touchmove touchend',function(event){
       // event.preventDefault();
    });

    //cover touched or click will trigger to show the content;
    $('.cover').on('touchstart mousedown',function(){
        $('.container').css('display','block');
        $('.slide').eq(0).addClass('slide-in');

        var vmel = $('.vmiddle');
	    var vmeltop = (winHeight-vmel.eq(0).height())/2;
	    vmel.css("top",vmeltop);

        //bgaudio.play();
        //$('#play-btn').fadeIn();
        $('#page-count').fadeIn().html((ue.cur_slide+1)+'/'+ue.slide_count);
        $(this).fadeOut();
    })

    $('.container').on('mousedown touchstart',started);
    $('.container').on('mousemove touchmove',moved);
    $('.container').on('mouseup touchend',ended);

    //sound-btn switch
    $('.sound-btn').click(function(event){
        event.stopPropagation();
        $('.sound-btn').css('display','none');
        var id =$(this).attr('id');
        if(id=='mute-btn'){
            $('#play-btn').css('display','block');
            bgaudio.play();
        }else if(id=='play-btn'){
            $('#mute-btn').css('display','block');
            bgaudio.pause();
            bgaudio.currentTime=0;
        }
    })

    //from weixin
    var weixin_share = $('#paper-share a').eq(0);
     //set weixin share show or hide in different device or app;
    if(isMobile()){
        if(isWeixin()){
            weixin_share.remove();
            $('#paper-share>div').prepend('<a class="paper-weixin"><span></span></a>')        
        }else{
            weixin_share.css('display','none');
        }
    }
    $('.paper-weixin').on('click',function(){addWeixinTip();});

    //WeixinJSBridge
    if (typeof WeixinJSBridge === "undefined"){
        if (document.addEventListener){
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
        }
    }else{
        onBridgeReady();
    }
    //when mobile device orientation change show/hide the turn-box;
    window.onorientationchange = function(){
        if(window.orientation==90||window.orientation==-90){
            $('#turn-box').css({'display':'block','opacity':1});
            $('.main').css('display','none');
        }else {
            $('.main').css('display','block');
            setTimeout(function(){
                $('#turn-box').animate({'opacity':0},500,function(){
                    setDimension();
                    $(this).css('display','none')
                });
            },1000);
        }
    }
    window.onresize = function(){
        if(!isMobile())
        setDimension();
    }


})

//jiathis
// weibo and weixin share configue;
var directory = location.origin+location.pathname.substring(0, location.pathname.lastIndexOf('/')),
    imgUrl = directory+"/wxshare.jpg",
    shareTitle = '澎湃新闻-14张图读懂南水北调中线',
    descContent = '花的钱能买3000万台iPhone6 Plus，搬迁人口相当于15个摩纳哥，减少了4000个天安门广场大小的耕地。那么问题来了，工程一共用了多少台挖掘机？',
    share_link=location.href;
//微博分享配置
var jiathis_config = {
    data_track_clickback:true,
    hideMore:true,
    title:shareTitle,
    summary:descContent,
    pic:imgUrl,
    url:share_link,
    appkey:{"tsina":"1918686509",
            "tqq":"1a19d5534ef00089838fea7b03410e22",
            },
}
