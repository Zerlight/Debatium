let counterList = [
    {selector:'#1',type:'state',title:'正方一辩'},
    {selector:'#2',type:'state',title:'反方一辩'},
    {selector:'#1',type:'state',title:'正方二辩'},
    {selector:'#2',type:'state',title:'反方二辩'},
    {selector:'#1',type:'query',title:'正三提问',mainTitle:'质询'},
    {selector:'#2',type:'query',title:'反一回答'},
    {selector:'#2',type:'query',title:'反二回答'},
    {selector:'#2',type:'query',title:'反四回答'},
    {selector:'#2',type:'query',title:'反三提问'},
    {selector:'#1',type:'query',title:'正一回答'},
    {selector:'#1',type:'query',title:'正二回答'},
    {selector:'#1',type:'query',title:'正四回答'},
    {selector:'#1',type:'queryConclude',title:'正方三辩',mainTitle:'质询小结'},
    {selector:'#2',type:'queryConclude',title:'反方三辩'},
    {type:'freeInit',maintitle:'自由辩论',title:['正方','反方']},
    {selector:'#2',type:'freeStart'},
    {selector:'#2',type:'conclusion',title:'反方四辩',mainTitle:'总结'},
    {selector:'#1',type:'conclusion',title:'正方四辩',}
]

const Func = class func {
    constructor(){
        this.duration = class{};
        this.nextKey = 'PageDown';
        this.skipKey = 'PageUp';
        this.pauseKey = 'keyP';
        this.bellKey = 'keyB';
        this.duration.state = 3 * 60;
        this.duration.query = 30;
        this.duration.queryConclude = 2 * 60;
        this.duration.free = 4 * 60;
        this.duration.conclusion = 3 * 60;
        this.counterPage = null;
        this.sparePage = null;
        this.pauseInfo = false;
        this.currentSelector = null;
        this.tempArg = null;
        this.tempSel = null;
    }
    ring30sBell(){
        let audio = document.getElementById('sound');
        audio.play();
    }
    ringFinalBell(){
        let audio = document.getElementById('sound3');
        audio.play();
    }
    pauseCounter(){
        if(funcer.currentSelector == 'free') return;
        if(typeof funcer.pauseInfo == 'string'){
            if(funcer.pauseInfo) $(funcer.currentSelector).children('.counter').children().countdowntimer("pause","resume");
            else $(funcer.currentSelector).children('.counter').children().countdowntimer("pause","pause");
        }else{
            if(funcer.currentSelector == '#1'){
                if(funcer.pauseInfo[0] == null) return;
                if(funcer.pauseInfo[0]) $(funcer.currentSelector).children('.counter').children().countdowntimer("pause","resume");
                else $(funcer.currentSelector).children('.counter').children().countdowntimer("pause","pause");
            }
            if(funcer.currentSelector == '#2'){
                if(funcer.pauseInfo[1] == null) return;
                if(funcer.pauseInfo[1]) $(funcer.currentSelector).children('.counter').children().countdowntimer("pause","resume");
                else $(funcer.currentSelector).children('.counter').children().countdowntimer("pause","pause");
            }
        }
    }
    applyPage(target,callback) {
        $.ajax({
            url: `./pages/${target}.html`,
            success: (data) => {
                $('#content').html(data);
                callback();
            }
        })
    }
    counterDaemon(){
        if(counterList.length == 0){
            $('#content').animate({opacity:0.0},500,'swing',function(){
            $('#content').html(funcer.sparePage);
            $('.title').html('已结束');
            return;
        })
        }
        if(typeof counterList[0].mainTitle != 'undefined') $('.title').html(counterList[0].mainTitle);
        $('.debate-card').each(function(){
            $(this).attr('status','off');
        })
        let second = 0;
        switch(counterList[0].type){
            case 'freeInit':
                funcer.currentSelector = 'free';
                let hintText = `切换计时方=${funcer.nextKey} | 结束=${funcer.skipKey} | 暂停计时=${funcer.pauseKey} | 手动响铃=${funcer.bellKey}`;
                $('.key-hint').html(hintText);
                $('.counter').each(function(){
                    $(this).children().countdowntimer('stop','stop');
                    $(this).children().countdowntimer('destroy');
                })
                funcer.tempArg = 'init';
                funcer.freeDebateHandler();
                return;
            case 'freeStart':
                funcer.tempArg = 'start';
                funcer.tempSel = counterList[0].selector;
                funcer.freeDebateHandler();
                counterList[0] = {type:'free'};
                return;
            case 'free':
                funcer.freeDebateHandler('');
                return;
            case 'state':
                second = funcer.duration.state;
                break;
            case 'query':
                second = funcer.duration.query;
                break;
            case 'queryConclude':
                second = funcer.duration.queryConclude;;
                break;
            case 'conclusion':
                second = funcer.duration.conclusion;
                break;
        }
        funcer.currentSelector = counterList[0].selector;
        $(counterList[0].selector+' > .card-title').html(counterList[0].title);
        if(counterList.length > 1 && counterList[0].selector != counterList[1].selector) $(counterList[1].selector+' > .card-title').html(counterList[1].title);
        try{
            $('.counter').each(function(){
                $(this).children().countdowntimer('stop','stop');
                $(this).children().countdowntimer('destroy');
                $(this).children().html('请等候');
            })
        } catch(e){}
        $(counterList[0].selector).attr('status','on');
        $(counterList[0].selector).children('.counter').children().countdowntimer({seconds:second,timeUp:funcer.ringFinalBell,beforeExpiryTime:'00:00:00:30',beforeExpiryTimeFunction:funcer.ring30sBell});
        counterList.shift();
    }
    freeDebateHandler(){
        if(funcer.tempArg='init'){
            $('.title').html('自由辩论·等候开始');
            $('#1').children('.card-title').html(counterList[0].title[0]);
            $('#2').children('.card-title').html(counterList[0].title[1]);
            $('#1').children('.counter').children().countdowntimer({seconds:funcer.duration.free,timeUp:function(){funcer.ringFinalBell();funcer.pauseInfo[0]=null},beforeExpiryTime:'00:00:00:30',beforeExpiryTimeFunction:funcer.ring30sBell});
            $('#1').children('.counter').children().countdowntimer('pause','pause');
            $('#2').children('.counter').children().countdowntimer({seconds:funcer.duration.free,timeUp:function(){funcer.ringFinalBell();funcer.pauseInfo[1]=null},beforeExpiryTime:'00:00:00:30',beforeExpiryTimeFunction:funcer.ring30sBell});
            $('#2').children('.counter').children().countdowntimer('pause','pause');
            funcer.pauseInfo = [false,false];
            counterList.shift();
            let callback = function(event){
                if(event.code == funcer.nextKey&&funcer.pauseInfo == [null,null]){
                    counterList.shift();
                    $('.counter').each(function(){
                        $(this).children().countdowntimer('stop','stop');
                        $(this).children().countdowntimer('destroy');
                        $(this).children().html('已结束');
                    })
                    return;
                }
                if(event.code != funcer.skipKey) return;
                counterList.shift();
                document.removeEventListener('keydown',callback);
            }
            document.addEventListener('keydown',callback);
            funcer.tempArg = null;
            return;
        }
        if(funcer.tempArg='start'){
            $(funcer.tempSel).attr('status','on');
            $(funcer.tempSel).children('.counter').children().countdowntimer('pause','resume');
            if(funcer.tempSel == '#1') funcer.pauseInfo = [false,true]; else funcer.pauseInfo = [true,false];
            funcer.currentSelector = sel;
            funcer.tempArg = null;
            funcer.tempSel = null;
            return;
        }
        if(funcer.currentSelector == '#1'){
            if(funcer.pauseInfo[1] == null) return;
            funcer.pauseInfo = [true,false];
            $(funcer.currentSelector).children('.counter').children().countdowntimer('pause','pause');
            $(funcer.currentSelector).attr('status','off');
            funcer.currentSelector = '#2';
            $('#2').children('.counter').children().countdowntimer('pause','resume');
        }else{
            if(funcer.pauseInfo[0] == null) return;
            funcer.pauseInfo = [false,true];
            $(funcer.currentSelector).children('.counter').children().countdowntimer('pause','pause');
            $(funcer.currentSelector).attr('status','off');
            funcer.currentSelector = '#1';
            $('#1').children('.counter').children().countdowntimer('pause','resume');
        }
    }
    getPage() {
        $.ajax({
            url: `./pages/counter.html`,
            async: true,
            success: (data) => {
                this.counterPage = data;
            }
        })
        $.ajax({
            url: `./pages/spare.html`,
            async: true,
            success: (data) => {
                this.sparePage = data;
            }
        })
    }
    startMain(){
        $('#content').animate({opacity:0.0},500,'swing',function(){
            $('#content').html(funcer.sparePage);
            $('#content').animate({opacity:1.0},500,'swing')
        })
        $('.title').html('主席介绍')
        let hintText = `继续/跳过=${funcer.nextKey} | 暂停计时=${funcer.pauseKey} | 手动响铃=${funcer.bellKey}`;
        $('.key-hint').html(hintText);
        let callback = function(event){
            if(event.code != funcer.nextKey) return;
            $('#content').animate({opacity:0.0},500,'swing',function(){
                $('#content').html(funcer.counterPage);
                $('#content').animate({opacity:1.0},500,'swing',function(){
                    funcer.counterDaemon();
                    document.addEventListener('keydown',function(event){
                        if(event.code == funcer.nextKey) funcer.counterDaemon();
                        if(event.code == funcer.bellKey) funcer.ring30sBell();
                        if(event.code == funcer.pauseKey) funcer.pauseCounter();
                    })
                })
            })
            document.removeEventListener('keydown',callback);
        }
        document.addEventListener('keydown',callback)
    }
}

window.onload = function(){
    funcer.applyPage('home' , function(){
        $('#btn_1').html(funcer.nextKey);
        $('#btn_2').html(funcer.skipKey);
        $('#btn_3').html(funcer.pauseKey);
        $('#btn_4').html(funcer.bellKey);
        funcer.getPage();
        $('#btn_1').click(function(){
            $(this).html('请按按键');
            let callback = function(event){
                $('#btn_1').html(event.code);
                funcer.nextKey = event.code;
                document.removeEventListener('keydown',callback);
            }
            document.addEventListener('keydown',callback);
        })
        $('#btn_2').click(function(){
            $(this).html('请按按键');
            let callback = function(event){
                $('#btn_2').html(event.code);
                funcer.skipKey = event.code;
                document.removeEventListener('keydown',callback);
            }
            document.addEventListener('keydown',callback)
        })
        $('#btn_3').click(function(){
            $(this).html('请按按键');
            let callback = function(event){
                $('#btn_3').html(event.code);
                funcer.pauseKey = event.code;
                document.removeEventListener('keydown',callback);
            }
            document.addEventListener('keydown',callback)
        })
        $('#btn_4').click(function(){
            $(this).html('请按按键');
            let callback = function(event){
                $('#btn_4').html(event.code);
                funcer.bellKey = event.code;
                document.removeEventListener('keydown',callback);
            }
            document.addEventListener('keydown',callback)
        })
        $('#ipt_1').val(funcer.duration.state);
        $('#ipt_2').val(funcer.duration.query);
        $('#ipt_3').val(funcer.duration.queryConclude);
        $('#ipt_4').val(funcer.duration.free);
        $('#ipt_5').val(funcer.duration.conclusion);
        $('#btn_5').click(function(){
            let checkList = ['#ipt_1','#ipt_2','#ipt_3','#ipt_4','#ipt_5'];
            checkList.forEach((item) => {
                if(Number.isNaN(Number($(item).val()))){
                    $('#error-1').html('输入框：'+item+' 中包含无效字符，请更正后再试')
                    return;
                }
            })
            if(!funcer.counterPage||!funcer.sparePage){
                $('#error-1').html('相关资源尚未加载完毕，请稍后再试。')
                return;
            }
            funcer.duration.state = Number($('#ipt_1').val())
            funcer.duration.query = Number($('#ipt_2').val())
            funcer.duration.queryConclude = Number($('#ipt_3').val())
            funcer.duration.free = Number($('#ipt_4').val())
            funcer.duration.conclusion = Number($('#ipt_5').val())
            funcer.startMain();
        })
    });
}

const funcer = new Func();
