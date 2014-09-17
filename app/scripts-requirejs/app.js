/*! Task Slayer | (c) 2014 Eric Mountain | https://github.com/EricMountain/TaskSlayer */

/*jshint unused: vars */
define(['jquery', 'perfect-scrollbar', 'angular', 'angular-perfect-scrollbar', 'angular-route', 'angular-animate'], function($) {
    'use strict';

    // Handle resizing
    function resizeSubBlocks() {
        var marginPct = 0;
        var pageHeight = $(window).height();
        var marginHeight = pageHeight * marginPct / 100;
        var usableHeight = pageHeight - marginHeight * 2;

        // Make sub-blocks half the size of the page
        var subBlockHeight = usableHeight / 2;
        $('.sub-block').css({'height': subBlockHeight});

        // Make the scrolled areas take up what's left of the sub-blocks
        var scrollNoneHeight = $('.scroll-none').outerHeight(true);
        var scrollerHeight = subBlockHeight - scrollNoneHeight;
        $('.scroller').css({'height': scrollerHeight});
    }

    $(window).resize(function() {
        resizeSubBlocks();
    });

    // Bootstrap Angular
    var yaGalleryApp = angular.module('yaGalleryApp', ['ngRoute', 'ngAnimate', 'perfect_scrollbar']);

    yaGalleryApp.factory('dataModelService', ['$rootScope', '$http', function ($rootScope, $http) {

        var service = {

            jsonUrl: undefined,

            imageUrl: undefined,

            model: {},

            LoadData: function (event, args) {
                if (typeof args.location === 'undefined') {
                    service.imageUrl = 'sample';
                } else {
                    service.imageUrl = args.location;
                }

                service.jsonUrl = service.imageUrl + '/sample.json';

                console.log('image url:', service.imageUrl);
                console.log('json url: ', service.jsonUrl);

                $http.get(service.jsonUrl)
                    .success(function(json, status, headers, config) {
                        console.log('JSON loaded');

                        var data = angular.fromJson(json);
                        service.model = data;

                        $rootScope.$broadcast('dataloaded', args);
                    })
                    .error(function(data, status, headers, config) {
                        console.log('Error loading JSON');
                        console.log(status);
                        console.log(headers);
                    });

            }
        };

        $rootScope.$on('loaddata', service.LoadData);

        return service;
    }]);

    yaGalleryApp.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('', { controller: 'yaGalleryCtrl'})
            .otherwise({ controller: 'yaGalleryCtrl'});
    }]);

    yaGalleryApp.controller('yaGalleryCtrl', ['$scope', '$rootScope', '$route', '$timeout', '$location', '$routeParams', 'dataModelService', function($scope, $rootScope, $route, $timeout, $location, $routeParams, dataModelService) {

        $scope.message = '';
        $scope.showMessage = false;

        $scope.currentImage = 0;

        // FIXME - not working
        $scope.galleryJson = $routeParams.target;
        console.log('galleryJson');
        console.log($scope.galleryJson);

        $scope.dataModelService = dataModelService;

        $scope.$on('$routeChangeSuccess', function( $currentRoute, $previousRoute ) {
            $rootScope.$broadcast('loaddata', {location: $scope.galleryJson});
        });
    }]);

    angular.bootstrap(document, ['yaGalleryApp']);

    resizeSubBlocks();

    // Hide the loading pane...
    $('#wait-pane-master').css({visibility: 'hidden'});

    // Ugly, but can't seem to get the scrollable blocks sized correctly until
    // after the initial load
    setTimeout(function() {
        resizeSubBlocks();
    }, 10);

});
