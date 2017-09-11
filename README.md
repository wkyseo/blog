## [customizeKeyboard](https://github.com/wkyseo/blog/tree/master/customizeKeyboard/app)

- 适合手机自定义数字键盘和软键盘
- 在横屏模式下效果更好
- 解决虚拟键盘唤起样式错乱问题

> 在安卓下，键盘唤起，输入框不会向上滚动，故最开始做了这样的处理，及人为增加输入区向上滚动，代码如下：
```
//webAPP 用cordova打包
if(window._runtime == 'cordova' && /Android/.test(navigator.appVersion)) {
      window.addEventListener('native.keyboardshow', ()=> {
        if (window.scrollY < 100 && self.refs.inputDialog) //键盘高度一般大于100，如果scrollY小于100，可以认为界面未上移，则需要手动上移
        {
          self.refs.inputDialog.style.top = self.refs.inputDialog.clientHeight+'px';
        }
      });
      window.addEventListener('native.keyboardhide', ()=>{
        if (self.refs.inputDialog != undefined) {
          self.refs.inputDialog.style.top = '';
        }
      });
    }
```

## **正则表达式**

[正则表达式初探一](https://github.com/wkyseo/blog/issues/3)

