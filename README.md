# saber-run

移动端动画效果支持

## Usage

```javascript
var runner = require('saber-run');
var ele = document.getElmentById('saber');

// 首先让元素淡入并且水平移动10像素
var action = runner.transition(
    ele,
    { opacity: 1, tranform: 'translate3d(10px, 0, 0)' },
    { duration: 3, timing: 'ease-out' }
);

// 然后在动画完成后再做点啥
action.then(function () { 
    alert('Surprise');
});
```

## API

### transition

#### .transition( ele, properties, options )

设置元素transition效果

#### .stopTransition( ele )

停止元素的transition效果

#### .onTransitionEnd( ele, callback, useCapture )

监听transitionend事件

#### .unTransitionEnd( ele, callback, useCapture )

取消监听transitionend事件

#### .oneTransitionEnd( ele, callback, useCapture )

只监听一次transitionend事件

### animation

#### .requestAnimationFrame( callback )

添加动画帧

#### .cancelAnimationFrame( idenity )

取消已添加的动画帧

#### .now()

获取当前的时间戳

===

[![Saber](https://f.cloud.github.com/assets/157338/1485433/aeb5c72a-4714-11e3-87ae-7ef8ae66e605.png)](http://ecomfe.github.io/saber/)
