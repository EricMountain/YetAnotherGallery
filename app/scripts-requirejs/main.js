// FIXME add map for noconflict - cf requirejs docs

/*jshint unused: vars */
requirejs.config({
    paths: {
        angular: '../../bower_components/angular/angular',
        'angular-animate': '../../bower_components/angular-animate/angular-animate',
        'angular-mocks': '../../bower_components/angular-mocks/angular-mocks',
        'angular-route': '../../bower_components/angular-route/angular-route',
        'angular-touch': '../../bower_components/angular-touch/angular-touch',
        'angular-scenario': '../../bower_components/angular-scenario/angular-scenario',
        jquery: 'vendor/jquery-1.10.2.min'
    },
    shim: {
        angular: {
            exports: 'angular'
        },
        'angular-route': {
            deps: [
                'angular'
            ]
        },
        'angular-animate': {
            deps: [
                'angular'
            ]
        },
        'angular-touch': {
            deps: [
                'angular'
            ]
        },
        'angular-mocks': {
            deps: [
                'angular'
            ],
            exports: 'angular.mock'
        }
    },
    priority: [
        'angular'
    ],
    packages: [

    ]
});

// Load the main app module to start the app
requirejs(['app']);
