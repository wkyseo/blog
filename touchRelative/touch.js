/*
 *
 * touch事件整合（DOM2级、单点触控）
 *
 * e.data.changeX //x变化值
 * e.data.changeY //y变化值
 * e.data.changeXAbs //x变化绝对值
 * e.data.changeYAbs //y变化绝对值
 * e.data.initialAxis //null | 'x' | 'y'
 * e.data.endAction //null | 'left' | 'right' | 'top' | 'down' | 'click' | 'long'
 * e.data.endSpeed //速度
 *
 */
var touch = (function() {
    var defaults = {
        start: noopFunc, //开始
        move: noopFunc, //移动
        end: noopFunc, //结束
        click: noopFunc, //结束---点击
        long: noopFunc, //结束---长按
        mainAxis: null, //主滑动轴（null | 'x' | 'y'）
        stopPropagation: false, //事件传播
        namespace: '' //事件命名空间（用于事件解除、事件的触发）
    };

    function noopFunc(e) {}
    var stamp = '_touchData' + new Date().getTime();
    var speedValve = 64;
    var isElement = function(element) { //元素判定
        var _nodeType = element && element.nodeType;
        if (_nodeType !== 1 && _nodeType !== 9) return false;
        return true;
    };
    var merging = function(defaults, params) { //参数与默认值合并
        var temp = {};
        for (var i in defaults) {
            if (defaults.hasOwnProperty(i)) {
                temp[i] = params[i] === undefined ? defaults[i] : params[i];
            }
        }
        if (typeof temp.stopPropagation !== 'boolean') temp.stopPropagation = defaults.stopPropagation;
        return temp;
    };
    var addEventData = function(e, data) { //事件对象处理
        e.data = typeof e.data === 'object' ? e.data : {};
        for (var i in data) {
            if (data.hasOwnProperty(i)) {
                e.data[i] = data[i];
            }
        }
    };
    var eventLog = function(element, functions, namespace) { //记录事件
        if (element[stamp]) {
            element[stamp].push(functions);
        } else {
            element[stamp] = [
                functions
            ];
        }
        element[stamp][element[stamp].length - 1].namespace = namespace;
    };
    var removeEvents = (function() { //事件解除
        var _removeEvents = function(element, functions) {
            element.removeEventListener('touchstart', functions[0]);
            element.removeEventListener('touchmove', functions[1]);
            element.removeEventListener('touchend', functions[2]);
        };
        return function(element, param) {
            param = param.trim().split('.');
            if (param[0] === 'off') {
                if (element[stamp]) {
                    for (var i = 0; i < element[stamp].length; i++) {
                        if (param[1]) {
                            if (element[stamp][i].namespace === param[1]) {
                                _removeEvents(element, element[stamp][i]);
                                element[stamp].splice(i, 1);
                                i--;
                            }
                        } else {
                            _removeEvents(element, element[stamp][i]);
                            element[stamp].splice(i, 1);
                            i--;
                        }
                    }
                    if (element[stamp].length === 0) {
                        delete element[stamp];
                    }
                }
            }
        };
    })();

    var touch = function(element, option) {
        if (!isElement(element)) return element;
        if (typeof option === 'object') {
            option = merging(defaults, option);
            var started = false;
            var startD = {},
                data = {};
            var touchstart = function(e) {
                if (option.stopPropagation) e.stopPropagation();
                else e.stopPropagation = noopFunc;
                if (e.targetTouches.length === 1) {
                    started = true;
                    startD = {};
                    startD.x = e.targetTouches[0].pageX;
                    startD.y = e.targetTouches[0].pageY;
                    startD.t = e.timeStamp;
                    data = {};
                    data.changeX = 0;
                    data.changeY = 0;
                    data.changeXAbs = 0;
                    data.changeYAbs = 0;
                    data.initialAxis = null;
                    data.endAction = null;
                    data.endSpeed = 0;
                    addEventData(e, data);
                    option.start.apply(this, arguments);
                }
            };
            var touchmove = function(e) {
                if (option.stopPropagation) e.stopPropagation();
                else e.stopPropagation = noopFunc;
                if (e.targetTouches.length === 1 && started) {
                    data.changeX = e.targetTouches[0].pageX - startD.x;
                    data.changeY = e.targetTouches[0].pageY - startD.y;
                    data.changeXAbs = Math.abs(data.changeX);
                    data.changeYAbs = Math.abs(data.changeY);
                    if (!data.initialAxis) {
                        if (data.changeXAbs > 5 || data.changeYAbs > 5) {
                            if (option.mainAxis === 'y') {
                                data.initialAxis = data.changeXAbs / 2 > data.changeYAbs ? 'x' : 'y';
                            } else if (option.mainAxis === 'x') {
                                data.initialAxis = data.changeYAbs / 2 > data.changeXAbs ? 'y' : 'x';
                            } else {
                                data.initialAxis = data.changeXAbs > data.changeYAbs ? 'x' : 'y';
                            }
                            startD.x = e.targetTouches[0].pageX;
                            startD.y = e.targetTouches[0].pageY;
                        }
                    }
                    addEventData(e, data);
                    option.move.apply(this, arguments);
                }
            };
            var touchend = function(e) {
                if (option.stopPropagation) e.stopPropagation();
                else e.stopPropagation = noopFunc;
                if (e.targetTouches.length === 0 && started) {
                    started = false;
                    var totalTime = e.timeStamp - startD.t;
                    data.endSpeed = (Math.sqrt(Math.pow(data.changeXAbs, 2) + Math.pow(data.changeYAbs, 2))) / totalTime * 300;
                    if (data.initialAxis === 'x') {
                        if (data.endSpeed > speedValve) {
                            if (data.changeX < 0) {
                                data.endAction = 'left';
                            } else {
                                data.endAction = 'right';
                            }
                        }
                    } else if (data.initialAxis === 'y') {
                        if (data.endSpeed > speedValve) {
                            if (data.changeY < 0) {
                                data.endAction = 'top';
                            } else {
                                data.endAction = 'down';
                            }
                        }
                    } else if (totalTime < 300) {
                        data.endAction = 'click';
                    } else {
                        data.endAction = 'long';
                    }
                    addEventData(e, data);
                    option.end.apply(this, arguments);
                    if (data.endAction === 'click' || data.endAction === 'long') {
                        option[data.endAction].apply(this, arguments);
                    }
                    startD = data = {};
                }
            };
            element.addEventListener('touchstart', touchstart);
            element.addEventListener('touchmove', touchmove);
            element.addEventListener('touchend', touchend);
            eventLog(element, [touchstart, touchmove, touchend], option.namespace); //记录事件
            touchend.long = option.long; //用于事件触发器
            touchend.click = option.click; //同上
            touchend.propagate = !option.stopPropagation; //同上
        }
        //事件的移除
        else if (typeof option === 'string') {
            removeEvents(element, option);
        }
        return element;
    };

    touch.triggerEnd = (function() { //事件触发器（仅用于'click'及'long'），事件对象中只有target可用
        return function(element, param) {
            if (!isElement(element)) return element;
            param = param.trim().split('.');
            var event = {};
            event.target = element;
            if (param[0] === 'click' || param[0] === 'long') {
                var propagate = true;
                var fireEvent = function(_el) {
                    var data = _el[stamp];
                    if (data) {
                        for (var i = 0; i < data.length; i++) {
                            if (param[1]) {
                                if (data[i].namespace === param[1]) {
                                    data[i][2][param[0]].call(_el, event);
                                    if (data[i][2].propagate === false) {
                                        propagate = false;
                                    }
                                }
                            } else {
                                data[i][2][param[0]].call(_el, event);
                                if (data[i][2].propagate === false) {
                                    propagate = false;
                                }
                            }
                        }
                    }
                    if (propagate && (_el !== document)) { //递归冒泡
                        if (_el.parentElement) {
                            fireEvent(_el.parentElement);
                        } else {
                            fireEvent(document);
                        }
                    }
                };
                fireEvent(element);
            }
            return element;
        };
    })();

    return touch;
})();



//使用情况
touch(document, { //添加事件
    start: function(e) {
        console.log('start：', JSON.stringify(e.data), '\n\n');
    },
    move: function(e) {
        console.log('move：', JSON.stringify(e.data));
    },
    end: function(e) {
        console.log('\n\nend：', JSON.stringify(e.data));
    },
    click: function(e) {
        console.log('end(click)：', e);
    },
    long: function(e) {
        console.log('end(long)：', e);
    },
    mainAxis: 'y',
    stopPropagation: true,
    namespace: 'namespace'
});
touch(document, {
    move: throttle(function(e) { //配合节流器：http://www.cnblogs.com/af-art/articles/5671919.html
        console.log(JSON.stringify(e.data));
    }, 300)
});
touch(document, {
    click: function(e) {
        console.log(e.target);
    }
});

touch(document, 'off'); //解除由touch添加的所有事件
touch(document, 'off.namespace'); //解除由touch添加的指定事件

touch.triggerEnd(document, 'click'); //触发由touch添加的所有事件（click）
touch.triggerEnd(document, 'click.namespace'); //触发由touch添加的指定事件（click）
touch.triggerEnd(document, 'long'); //同理



function debounce(fn, time) {
	return function() {
		
	}
}