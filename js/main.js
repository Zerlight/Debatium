const Func = class func {
    constructor(){
        this.duration = class{};
        this.nextKey = 'PageDown';
        this.skipKey = 'PageUp';
        this.nxbjKey = null;
        this.bellKey = null;
        this.duration.state = 3 * 60;
        this.duration.query = 2 * 60;
        this.duration.queryConclude = 2 * 60;
        this.duration.free = 8 * 60;
        this.duration.conclusion = 3 * 60;
        this.counterPage = null;
        this.sparePage = null;
        this.keyDownCounter = 0;
        this.tempVar = null;
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
    keyDownDaemon(key){
        document.addEventListener('keydown',function(event){
            if(event.code != key) return;
            funcer.keyDownCounter ++;
        });
    }
    resetKeyCounter(){
        this.keyDownCounter = 0;
    }
    countdown(query,position,key,callback){
        $(query[position].selector).attr('status','on').children('.counter').countdowntimer({seconds:query[position].second});
        var position = 1;
        funcer.tempVar = [query,position,key]
        for(position;position<query.length+1;position++){
            let call = function(event,query=funcer.tempVar[0],position=funcer.tempVar[1],key=funcer.tempVar[2],callback){
                if(typeof event !== 'undefined' && event.code !== key) return;
                console.log(funcer.keyDownCounter);
                if(funcer.keyDownCounter != position) return;
                document.addEventListener('keydown',call);
                if(position>0) $(query[position-1].selector).attr('status','off');
                if(position>=query.length){
                    callback();
                    return;
                }
                $(query[position].selector).attr('status','on').children('.counter').countdowntimer({seconds:query[position].second});
                if(query[position].title) $(query[position].selector).children('.card-title').html(query[position].title);
                document.removeEventListener('keydown',call);
            }
            document.addEventListener('keydown',call);
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
    startMain(_this){
        $('#content').animate({opacity:0.0},500,'swing',function(){
            $('#content').html(_this.sparePage);
            $('#content').animate({opacity:1.0},500,'swing')
        })
        $('.title').html('主席介绍')
        let hintText = `继续=${_this.nextKey} | 跳过=${_this.skipKey} | ${_this.nxbjKey ? `你先别急=${_this.nxbjKey}` : `你先别急未启用`} | ${_this.bellKey ? `手动响铃=${_this.bellKey}` : `手动响铃未启用`}`;
        $('.key-hint').html(hintText);
        let callback = function(event){
            if(event.code != _this.nextKey) return;
            $('.title').html('立论陈词');
            $('#content').animate({opacity:0.0},500,'swing',function(){
                $('#content').html(_this.counterPage);
                $('#title_1').html('正方一辩');
                $('#1').attr('status','on');
                $('#title_2').html('反方一辩');
                $('#content').animate({opacity:1.0},500,'swing',function(){
                let i = _this.duration.state;
                _this.keyDownDaemon(_this.nextKey);
                let query = [
                    {selector:'#1',second:i},
                    {selector:'#2',second:i},
                    {selector:'#1',second:i,title:'正方二辩'},
                    {selector:'#2',second:i,title:'反方二辩'},
                    {selector:'#1',second:i,title:'正方三辩'},
                    {selector:'#2',second:i,title:'反方三辩'},
                    {selector:'#1',second:i,title:'正方四辩'},
                    {selector:'#2',second:i,title:'反方四辩'},
                ]
                    _this.countdown(query,0,_this.nextKey,function(){
                        console.log('hello')
                    })
                })
            })
            document.removeEventListener('keydown',callback);
        }
        document.addEventListener('keydown',callback)
    }
}

window.onload = function(){
    func = new Func();
    func.applyPage('home' , function(){
        $('#btn_1').html(func.nextKey);
        $('#btn_2').html(func.skipKey);
        $('#btn_3').html(func.nxbjKey ? func.nxbjKey : '未定义');
        $('#btn_4').html(func.bellKey ? func.bellKey : '未定义');
        func.getPage();
        $('#btn_1').click(function(){
            $(this).html('请按按键');
            let callback = function(event){
                $('#btn_1').html(event.code);
                func.nextKey = event.code;
                document.removeEventListener('keydown',callback);
            }
            document.addEventListener('keydown',callback);
        })
        $('#btn_2').click(function(){
            $(this).html('请按按键');
            let callback = function(event){
                $('#btn_2').html(event.code);
                func.skipKey = event.code;
                document.removeEventListener('keydown',callback);
            }
            document.addEventListener('keydown',callback)
        })
        $('#btn_3').click(function(){
            $(this).html('请按按键');
            let callback = function(event){
                $('#btn_3').html(event.code);
                func.nxbjKey = event.code;
                document.removeEventListener('keydown',callback);
            }
            document.addEventListener('keydown',callback)
        })
        $('#btn_4').click(function(){
            $(this).html('请按按键');
            let callback = function(event){
                $('#btn_4').html(event.code);
                func.bellKey = event.code;
                document.removeEventListener('keydown',callback);
            }
            document.addEventListener('keydown',callback)
        })
        $('#ipt_1').val(func.duration.state);
        $('#ipt_2').val(func.duration.query);
        $('#ipt_3').val(func.duration.queryConclude);
        $('#ipt_4').val(func.duration.free);
        $('#ipt_5').val(func.duration.conclusion);
        $('#btn_5').click(function(){
            let checkList = ['#ipt_1','#ipt_2','#ipt_3','#ipt_4','#ipt_5'];
            checkList.forEach((item) => {
                if(Number.isNaN(Number($(item).val()))){
                    $('#error-1').html('输入框：'+item+' 中包含无效字符，请更正后再试')
                    return;
                }
            })
            if(!func.counterPage||!func.sparePage){
                $('#error-1').html('相关资源尚未加载完毕，请稍后再试。')
                return;
            }
            func.duration.state = Number($('#ipt_1').val())
            func.duration.query = Number($('#ipt_2').val())
            func.duration.queryConclude = Number($('#ipt_3').val())
            func.duration.free = Number($('#ipt_4').val())
            func.duration.conclusion = Number($('#ipt_5').val())
            func.startMain(func);
        })
    });
}

const funcer = new Func();