# saber-run

提供动画相关功能

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
