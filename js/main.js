const counterList = [
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
        this.thisKey = null;
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
            funcer.thisKey = key;
            funcer.keyDownCounter ++;
        });
    }
    resetKeyCounter(){
        this.keyDownCounter = 0;
    }
    countdown(query,key,callback){
        let position = 0;
        $(query[position].selector).attr('status','on').children('.counter').countdowntimer({seconds:query[position].second});
        funcer.tempVar = [query,1,key,callback]
        for(let i=0;i<query.length+1;i++){
            document.addEventListener('keydown',funcer.listenerEX(funcer.tempVar[0],funcer.tempVar[1],funcer.tempVar[2],funcer.tempVar[3]));
            funcer.tempVar[1]++;
        }
    }
    listenerEX(query,position,key,callback){
        console.log(funcer.thisKey,query,position,key)
        if(funcer.thisKey != key) return;
        if(funcer.keyDownCounter != position) return;
        if(position>=query.length){
            callback();
            return;
        }
        if(position>0) $(query[position-1].selector).attr('status','off').children('.counter').countdowntimer('destroy').html('00:00');
        $(query[position].selector).attr('status','on').children('.counter').countdowntimer({seconds:query[position].second});
        if(query[position].title) $(query[position].selector).children('.card-title').html(query[position].title);
        document.removeEventListener('keydown',call);
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
                _this.keyDownDaemon(_this.nextKey)
                    _this.countdown(query,_this.nextKey,function(){
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
