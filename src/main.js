/**
 * @file saber-magic
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var exports = {};
    
    function extend(target, source) {
        Object.keys(source).forEach(function (key) {
            target[key] = source[key];
        });
    }

    extend(exports, require('./transition'));
    extend(exports, require('./animation'));

    return exports;
});