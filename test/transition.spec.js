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

            it('should return resolved promise when noting happened', function (done) {
                var promise = runner.transition();
                promise.then(function () {
                    expect(true).toBeTruthy();
                    done();
                });
            });

            it('should return resolved promise without duration', function (done) {
                var promise = runner.transition(ele, {width: '200px'});
                promise.then(function () {
                    expect(ele.style.width).toEqual('200px');
                    done();
                });
            });

            it('should return resolved promise when property not change', function (done) {
                var promise = runner.transition(
                        ele,
                        {
                            width: '100px'
                        },
                        { duration: 0.5 }
                    );

                promise.then(function () {
                    expect(ele.style.width).toEqual('100px');
                    done();
                });
            });

        });

    });

});
