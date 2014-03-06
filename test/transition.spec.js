/**
 * @file transition测试用例
 * @author treelite(c.xinle@gmail.com);
 */

define(function (require) {
    var runner = require('saber-run/transition');

    describe('transition', function () {

        describe('.transition', function () {
            var ele; 

            beforeEach(function () {
                ele = document.createElement('div');
                ele.style.width = '100px';
                ele.style.height = '100px';
                document.body.appendChild(ele);
                // 强制刷新
                !!ele.offsetHeight;
            });

            afterEach(function () {
                if (ele) {
                    ele.parentNode.removeChild(ele);
                }
            });

            it('should set one property', function (done) {
                var promise = runner.transition(
                        ele, 
                        { width: '200px' },
                        { duration: 0.5 }
                    );

                promise.then(function () {
                    expect(ele.style.width).toBe('200px');
                    done();
                });

            });

            it('should set multi properties', function (done) {
                var promise = runner.transition(
                        ele, 
                        {
                            width: '200px',
                            height: '200px',
                        },
                        { duration: 0.5 }
                    );

                promise.then(function () {
                    expect(ele.style.width).toBe('200px');
                    expect(ele.style.height).toBe('200px');
                    done();
                });
            });

        });

    });

});
