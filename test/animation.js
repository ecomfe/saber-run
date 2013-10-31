/**
 * @file animation测试用例
 * @author treelite(c.xinle@gmail.com);
 */

define(function (require) {
    var magic = require('saber-magic');

    describe('animation', function () {
        it('.requestAnimationFrame', function () {
            var res = false;
            magic.requestAnimationFrame(function () {
                res = true;
            });

            waitsFor(
                function () {
                    return res;
                },
                '应该执行回调',
                500
            );

            runs(function () {
                expect(res).toBeTruthy();
            });
        });

        it('.cancelAnimationFrame', function () {
            var res = false;
            var id = magic.requestAnimationFrame(function () {
                res = true;
            });

            magic.cancelAnimationFrame(id);

            var t = false;
            setTimeout(function () {
                t = true;
            }, 0);

            waitsFor(
                function () {
                    return t;
                },
                '',
                500
            );

            runs(function () {
                expect(res).toBeFalsy();
            });
        });
    });

});
