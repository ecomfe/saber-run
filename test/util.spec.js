/**
 * @file animation测试用例
 * @author treelite(c.xinle@gmail.com);
 */

define(function (require) {
    var runner = require('saber-run');

    describe('util', function () {

        it('.requestAnimationFrame should fire animation callback', function (done) {
            runner.requestAnimationFrame(function () {
                expect(true).toBeTruthy();
                done();
            });
        });

        it('.cancelAnimationFrame should cancel animation', function (done) {
            var id = runner.requestAnimationFrame(function () {
                expect(true).toBeFalsy();
                done();
            });

            runner.cancelAnimationFrame(id);

            setTimeout(function () {
                expect(false).toBeFalsy();
                done();
            }, 0);
        });

    });

});
