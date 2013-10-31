/**
 * @file transition测试用例
 * @author treelite(c.xinle@gmail.com);
 */

define(function (require) {
    var magic = require('saber-magic');

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
                /*
                if (ele) {
                    ele.parentNode.removeChild(ele);
                    ele = null;
                }
                */
            });

            it('set one property', function () {
                ele.style.width = '200px';

                var startTime = new Date().getTime();
                var promise = magic.transition(
                        ele, 
                        { width: '200px' },
                        { duration: 0.5 }
                    );

                var endTime;
                promise.then(function () {
                    endTime = new Date().getTime();
                });

                waitsFor(
                    function () {return endTime;},
                    '应该触发完成回调',
                    600
                );

                runs(function () {
                    expect(endTime - startTime).toBeGreaterThan(500);
                    expect(ele.style.width).toBe('200px');
                });
            });

            it('set multi properties', function () {
                var promise = magic.transition(
                        ele, 
                        {
                            width: '200px',
                            height: '200px',
                        },
                        { duration: 0.5 }
                    );

                var count = 0;
                promise.then(function () {
                    count++;
                    endTime = new Date().getTime();
                });

                var stop = true;
                setTimeout(function () {
                    stop = false;
                }, 600);

                waitsFor(
                    function () {return !stop;},
                    '',
                    650
                );

                runs(function () {
                    expect(count).toBe(1);
                    expect(ele.style.width).toBe('200px');
                    expect(ele.style.height).toBe('200px');
                });
            });
        });
    });
});
