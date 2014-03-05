module.exports = function(config) {
    config.set({
        basePath: '../',

        frameworks: ['jasmine', 'requirejs'],

        files: [
            {pattern: 'src/**', included: false},
            {pattern: 'test/dep/**', included: false},
            {pattern: 'test/*.spec.js', included: false},
            'test/loader.js'
        ]
    });
};
