/**
 * @file 动画
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var Resolver = require('saber-promise');

    var dom = require('saber-dom');

    var extend = require('saber-lang/extend');

    var runner = require('./transition');


    /**
     * 动画缓动效果
     *
     * @const
     * @type {Object}
     */
    var TIMING_FUNCTION = {
            'default': 'ease',
            'in': 'ease-in',
            'out': 'ease-out',
            'in-out': 'ease-in-out',
            'snap': 'cubic-bezier(0,1,.5,1)',
            'linear': 'cubic-bezier(0.250, 0.250, 0.750, 0.750)',
            'ease-in-quad': 'cubic-bezier(0.550, 0.085, 0.680, 0.530)',
            'ease-in-cubic': 'cubic-bezier(0.550, 0.055, 0.675, 0.190)',
            'ease-in-quart': 'cubic-bezier(0.895, 0.030, 0.685, 0.220)',
            'ease-in-quint': 'cubic-bezier(0.755, 0.050, 0.855, 0.060)',
            'ease-in-sine': 'cubic-bezier(0.470, 0.000, 0.745, 0.715)',
            'ease-in-expo': 'cubic-bezier(0.950, 0.050, 0.795, 0.035)',
            'ease-in-circ': 'cubic-bezier(0.600, 0.040, 0.980, 0.335)',
            'ease-in-back': 'cubic-bezier(0.600, -0.280, 0.735, 0.045)',
            'ease-out-quad': 'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
            'ease-out-cubic': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
            'ease-out-quart': 'cubic-bezier(0.165, 0.840, 0.440, 1.000)',
            'ease-out-quint': 'cubic-bezier(0.230, 1.000, 0.320, 1.000)',
            'ease-out-sine': 'cubic-bezier(0.390, 0.575, 0.565, 1.000)',
            'ease-out-expo': 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
            'ease-out-circ': 'cubic-bezier(0.075, 0.820, 0.165, 1.000)',
            'ease-out-back': 'cubic-bezier(0.175, 0.885, 0.320, 1.275)',
            'ease-in-out-quad': 'cubic-bezier(0.455, 0.030, 0.515, 0.955)',
            'ease-in-out-cubic': 'cubic-bezier(0.645, 0.045, 0.355, 1.000)',
            'ease-in-out-quart': 'cubic-bezier(0.770, 0.000, 0.175, 1.000)',
            'ease-in-out-quint': 'cubic-bezier(0.860, 0.000, 0.070, 1.000)',
            'ease-in-out-sine': 'cubic-bezier(0.445, 0.050, 0.550, 0.950)',
            'ease-in-out-expo': 'cubic-bezier(1.000, 0.000, 0.000, 1.000)',
            'ease-in-out-circ': 'cubic-bezier(0.785, 0.135, 0.150, 0.860)',
            'ease-in-out-back': 'cubic-bezier(0.680, -0.550, 0.265, 1.550)'
        };

    function Animation(ele, options) {
        this.action = {};
        this.options = {};
        this.defaultOptions = {};
        this.main = ele;

        options = options || {};
        this.defaultOptions.duration = options.duration || Animation.DURATION;
        this.defaultOptions.delay = options.delay || Animation.DELAY;
        this.defaultOptions.timing = TIMING_FUNCTION[options.timing]
                                || TIMING_FUNCTION[Animation.TIMING];

        this.reset();

        this.promise = Resolver.resolved();
    }

    // 默认的动画时间间隔
    Animation.DURATION = 0.3;
    // 默认的动画延迟时间
    Animation.DELAY = 0;
    // 默认的动画缓动效果
    Animation.TIMING = 'default';

    /**
     * 注册动作
     *
     * @public
     * @param {string} name 动作名称
     * @param {Function} fn 动作处理函数
     */
    Animation.addAction = function (name, fn) {
        var prototype = this.prototype;
        if (!prototype.hasOwnProperty(name)) {
            prototype[name] = function () {
                var me = this;
                var args = Array.prototype.slice.call(arguments);
                var res = fn.apply(me, args) || {};
                var value;
                Object.keys(res).forEach(function (key) {
                    value = res[key];
                    me.set(key, value);
                });
                return me;
            };
        }
    };

    /**
     * 设置变化的样式
     *
     * @public
     * @param {string} property 样式名
     * @param {string} value 样式值
     * @return {Animation}
     */
    Animation.prototype.set = function (property, value) {
        this.action[property] = value;
        return this;
    };

    /**
     * 设置动画时长
     * 单位为s
     *
     * @public
     * @param {number} value 时长
     * @return {Animation}
     */
    Animation.prototype.duration = function (value) {
        this.options.duration = value;
        return this;
    };

    /**
     * 动画延迟时间
     * 单位为s
     *
     * @public
     * @param {number} value 时长
     * @return {Animation}
     */
    Animation.prototype.delay = function (value) {
        this.options.delay = value;
        return this;
    };

    /**
     * 设置动画缓动效果
     *
     * @public
     * @param {string} name 缓动名称
     * @return {Animation}
     */
    Animation.prototype.ease = function (name) {
        this.options.timing = TIMING_FUNCTION[name] || TIMING_FUNCTION['default'];
        return this;
    };

    /**
     * 重置动画参数
     *
     * @public
     * @return {Animation}
     */
    Animation.prototype.reset = function () {
        this.action = {};
        this.options = extend({}, this.defaultOptions);
        return this;
    };

    /**
     * 执行动画
     *
     * @public
     * @return {Animation}
     */
    Animation.prototype.run = function () {
        var ele = this.main;
        var action = extend({}, this.action);

        if (Object.keys(action).length <= 0) {
            return this;
        }

        var options = this.options;

        this.reset();
        this.promise = this.promise.then(function () {
            var item;
            Object.keys(action).forEach(function (key) {
                item = action[key];
                if (typeof item == 'function') {
                    item = item(ele) || {};
                    delete action[key];
                    extend(action, item);
                }
            });
            return runner.transition(ele, action, options);
        });

        return this;
    };

    /**
     * 设置动画完成后的回调函数
     *
     * @public
     * @param {Function} callback
     * @return {Animation}
     */
    Animation.prototype.finish = function (callback) {
        this.promise.then(callback);
        return this;
    };

    // 添加`moveTo`动作
    Animation.addAction(
        'moveTo', 
        /**
         * 移动到某位置
         *
         * @public
         * @param {number=} x
         * @param {number=} y
         * @return {Animation}
         */
        function (x, y) {
            var res = {};
            if (x != null) {
                res.left = x + 'px';
            }
            if (y != null) {
                res.top = y + 'px';
            }
            return res;
        }
    );

    Animation.addAction(
        'move', 
        /**
         * 在原有基础上移动
         *
         * @public
         * @param {number=} x
         * @param {number=} y
         * @return {Animation}
         */
        function (x, y) {
            return {
                move: function (ele) {
                    var res = {};
                    var v = dom.getStyle(ele, 'left');
                    if (x && v) {
                        x += parseInt(v, 10);
                        res.left = x + 'px';
                    }
                    v = dom.getStyle(ele, 'top');
                    if (y && v) {
                        y += parseInt(v, 10);
                        res.top = y + 'px';
                    }
                    return res;
                }
            };
        }
    );

    return Animation;
});
