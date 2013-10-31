/**
 * @file transition
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var dom = require('saber-dom');
    var Resolver = require('saber-promise');

    var exports = {};

    var transitionEndEvents = [
            'transitionend', 'webkitTransitionEnd', 
            'oTransitionEnd', 'MSTransitionEnd',
            'otransitionend' // Opera某些犯2的版本...
        ];

    /**
     * 监听transition完成事件
     * 注册所有可能的transitionend
     * 不会有重入
     *
     * @public
     * @param {HTMLElement} ele
     * @param {Function} callback
     * @param {boolean} useCapture
     */
    exports.onTransitionEnd = function (ele, callback, useCapture) {
        transitionEndEvents.forEach(function (eventName) {
            ele.addEventListener(eventName, callback, useCapture || false);
        });
    };

    /**
     * 取消transition完成事件的监听
     *
     * @public
     * @param {HTMLElement} ele
     * @param {Function} callback
     * @param {boolean} useCapture
     */
    exports.unTransitionEnd = function (ele, callback, useCapture) {
        transitionEndEvents.forEach(function (name) {
            ele.removeEventListener(name, callback, useCapture || false);
        });
    };

    /**
     * 只监听一次transition完成事件
     *
     * @public
     * @param {HTMLElement} ele
     * @param {Function} callback
     * @param {boolean} useCapture
     */
    exports.oneTransitionEnd = function (ele, callback, useCapture) {
        var handler = function (e) {
            if (callback.call(ele, e) !== false) {
                exports.unTransitionEnd(ele, handler, useCapture);
            }
        };

        exports.onTransitionEnd(ele, handler, useCapture);
    };

    /**
     * 设置transition
     *
     * @public
     * @param {Object} options 参数
     * @param {Object} properties 要改变的属性
     * @param {number=} options.duration 持续时间 单位秒
     * @param {string=} options.timing 缓动效果 
     * @param {number=} options.delay 延时 单位秒
     * @return {Promise}
     */
    exports.transition = function (ele, properties, options) {

        if (!properties) {
            return;
        }

        options.timing = options.timing || 'ease';
        options.delay = options.delay || 0;
        options.duration = options.duration || 0;

        var propertyNames = [];
        Object.keys(properties).forEach(function (name) {
            propertyNames.push(name);
            dom.setStyle(ele, name, properties[name]);
        });

        var resolver = new Resolver();
        var callback = function (e) {
            // transitionend会根据设置的transition-property依次触发
            // 所以将最后一个transitionend作为整体的结束
            var res = true;
            if (propertyNames.length <= 1) {
                resolver.fulfill();
            }
            else {
                propertyNames.splice(propertyNames.indexOf(e.propertyName), 1);
                res = false;
            }
            return res;
        };
        if (options.duration) {
            exports.oneTransitionEnd(ele, callback);
        }
        else {
            resolver.fulfill();
        }

        dom.setStyle(ele, 'transition-property', propertyNames.join(','));
        dom.setStyle(ele, 'transition-duration', options.duration + 's');
        dom.setStyle(ele, 'transition-timing-function', options.timing);
        dom.setStyle(ele, 'transition-delay', options.delay + 's');

        return resolver.promise();
    };

    /**
     * 停止transition
     *
     * @public
     * @param {HTMLElement} ele
     */
    exports.stopTransition = function (ele) {
        dom.setStyle(ele, 'transition-property', 'none');
    };

    return exports;
});
