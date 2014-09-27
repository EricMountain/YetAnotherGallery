/*! Task Slayer | (c) 2014 Eric Mountain | https://github.com/EricMountain/TaskSlayer */

// http://localhost:9000/#/http://localhost:9000/sample/sample
// http://localhost:9000/#/http://localhost/yag-sample/Pentax-20140905
// http://10.8.0.1/yagallery/#/http://10.8.0.1/yag-sample/Pentax-20140905
// http://192.168.1.11/yagallery/#/http://192.168.1.11/yag-sample/Pentax-20140905

/*jshint unused: vars */
define(['jquery', 'perfect-scrollbar', 'angular', 'angular-perfect-scrollbar', 'angular-route', 'angular-animate', 'angular-touch'], function($) {
    'use strict';

    // Handle resizing
    function resizeSubBlocks() {
        //var marginPct = 0;
        var pageWidth = $(window).width();
        //var marginWidth = pageWidth * marginPct / 100;
        //var usableWidth = pageWidth - marginWidth * 2;
        var pageHeight = $(window).height();
        //var marginHeight = pageHeight * marginPct / 100;
        //var usableHeight = pageHeight - marginHeight * 2;

        var image = new Image();
        image.src = $('#main-photo').attr('src');
        var imageWidth = image.naturalWidth;
        var imageHeight = image.naturalHeight;

        var newWidth = pageWidth;
        var newHeight = imageHeight * pageWidth / imageWidth;
        if (newHeight > pageHeight) {
            newWidth = imageWidth * pageHeight / imageHeight;
            newHeight = pageHeight;
        }
        $('#main-photo').css({'width': newWidth});
        $('#main-photo').css({'height': newHeight});

        $('#main-photo-container').css({'height': $('#main-photo').height()});
    }

    $(window).resize(function() {
        resizeSubBlocks();
    });

    // Bootstrap Angular
    var yaGalleryApp = angular.module('yaGalleryApp', ['ngRoute', 'ngAnimate', 'ngTouch', 'perfect_scrollbar']);

    yaGalleryApp.factory('dataModelService', ['$rootScope', '$http', function ($rootScope, $http) {

        var service = {

            jsonUrl: undefined,

            imageUrl: undefined,

            model: {},

            LoadData: function (event, args) {

                if (typeof args.location === 'undefined') {
                    console.error('No gallery URL supplied.');
                    return;
                }

                service.jsonUrl = args.location + '.json';
                service.imageUrl = args.location;

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
        $routeProvider
            .when('/:target*', { controller: 'yaGalleryCtrl'})
            .otherwise({ controller: 'yaGalleryCtrl'});
    }]);

    yaGalleryApp.controller('yaGalleryCtrl', ['$scope', '$rootScope', '$route', '$timeout', '$location', '$routeParams', 'dataModelService', function($scope, $rootScope, $route, $timeout, $location, $routeParams, dataModelService) {

        $scope.message = '';
        $scope.showMessage = false;

        $scope.currentImage = 0;

        $scope.dataModelService = dataModelService;

        $scope.$on('$routeChangeSuccess', function( $currentRoute, $previousRoute ) {
            if (typeof $routeParams.target !== 'undefined') {

                console.log('target: ' + $routeParams.target);

                $scope.galleryBaseUrl = $routeParams.target;

                console.log('Gallery base URL from routeParams: ' + $scope.galleryBaseUrl);
            } else {
                $scope.galleryBaseUrl = 'sample/sample';
                console.log('No target URL specified for JSON -> using: ' + $scope.galleryBaseUrl);
            }

            $rootScope.$broadcast('loaddata', {location: $scope.galleryBaseUrl});
        });

        $scope.keypress = function($event) {
            var isHandledHere = true;

            switch($event.keyCode) {
            case 39: // Right - next image
                if ($scope.currentImage < $scope.dataModelService.model.images.length - 1)
                    $scope.currentImage += 1;
                break;
            case 37: // Left - previous image
                if ($scope.currentImage > 0)
                    $scope.currentImage -= 1;
                break;
            case 36: // Home - go to 1st image
                $scope.currentImage = 0;
                break;
            case 35: // End - go to last image
                $scope.currentImage = $scope.dataModelService.model.images.length - 1;
                break;
            default:
                isHandledHere = false;
            }

            if (isHandledHere)
                $event.preventDefault();
        };

        $scope.swipeLeft = function($event) {
            console.log('swiped left');
            if ($scope.currentImage < $scope.dataModelService.model.images.length - 1)
                $scope.currentImage += 1;
        };

        $scope.swipeRight = function($event) {
            console.log('swiped right');
            if ($scope.currentImage > 0)
                $scope.currentImage -= 1;
        };

    }]);

    yaGalleryApp.directive('centreImage', function() {
        return {
            link: function(scope, element, attrs) {
                element.bind('load', function(e) {
                    resizeSubBlocks();
                });
            }
        };
    });

    angular.bootstrap(document, ['yaGalleryApp']);

    // Hide the loading pane...
    $('#wait-pane-master').css({visibility: 'hidden'});

    // Ugly, but can't seem to get the scrollable blocks sized correctly until
    // after the initial load
    setTimeout(function() {
        resizeSubBlocks();
    }, 10);

});
