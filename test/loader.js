var tests = [];

for (var file in window.__karma__.files) {
    if (/spec\.js$/.test(file)) {
        tests.push(file);
    }
}

requirejs.config({
    baseUrl: '/base',

    packages: [
        {
            name: 'saber-promise',
            location: './test/dep/saber-promise/0.1.2-beta.3/src',
            main: 'promise'
        },
        {
            name: 'saber-dom',
            location: './test/dep/saber-dom/0.3.0/src'
        },
        {
            name: 'saber-lang',
            location: './test/dep/saber-lang/0.2.0/src'
        },
        {
            name: 'saber-run',
            location: './src'
        }
    ],

    deps: tests,

    callback: window.__karma__.start
});
