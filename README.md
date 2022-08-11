# Debatium
辩论现场实用工具，一个美观，高自定义性的现场倒计时工具。

## 特点
🚩 使用暗色设计，更适合作为现场屏幕背景

💡 轻量，美观，合理的CSS和JQuery动画设计

🛵 功能完全，支持普通计时和自由辩论计时，还支持暂停计时，手动响铃，跳过等功能

🎨 高可自定义性，赛制，顺序，时长，过程由你决定

🐱 友好，易于理解的配置格式，内嵌于主js文件中

🍀 全程使用键盘操作，快捷键可以自定义

## 缺点
🙉 用到了不知道有没有用的后台加载，由于现代浏览器跨域政策，所以需要后端提供页面

## 配置
配置文件在`main.js`中的`CounterList`中。

`CounterList`是一个`array`对象，每个元素都是一个`JSON`对象。

计时器在读取时，会从第一个依次向后读取元素并依次展示。编写配置时，像清单一样依次向后添加即可表明顺序。

`JSON`对象中可以包含如下内容：

### JSON.selector
选择要操作的计时器对象。

支持的参数有两种：`#1`和`#2`，作为JQuery选择器使用。

其中`#1`代表左方的计时器，`#2`代表右方的计时器。

除在`JSON.type`为`freeInit`时，其他情况都需要提供选择器。

### JSON.type
表面当前项目的计时类型。必填。

在开始之前，计时器会要求填写时长参数。填写对应的`type`即可使用相应设置的时长。

支持的类型：

|类型|对应名称|说明|
|----|----|----|
|state|立论陈词||
|query|质询|代表质询中的单个过程|
|queryConclude|质询小结||
|conclusion|总结陈词||
|freeInit|初始化自由辩论|当需要自由辩论时必需|
|freeStart|开始自由辩论|当需要自由辩论时必需|

需要自由辩论时，上述两个项目都为必需且必须放在一起。freeStart中的selector代表先开始计时的计时器

### JSON.title
用于设置相应计时器的标题，留空则不会变更

当`type`为`freeInit`时，`title`需要设置为一个`array`对象，其中包含两个`string`，依次为第一个和第二个计时器的标题，用于表示自由辩论中双方的名称。（例如：`['正方','反方']`）

### JSON.mainTitle
设置主标题，留空则保持不变

# Credit 致谢
特别感谢[z-spider/Timer](https://github.com/z-spider/Timer) 本计时器的响铃音频来自于此。

JQuery，JQuerycountdownTimer，Google fonts & icons.

## Made with ❤️ & [SparrowHe](https://github.com/sparrowhe)
