/*! Yet Another Gallery | (c) 2014 Eric Mountain | https://github.com/EricMountain/YetAnotherGallery */

// http://localhost:9000/#/http://localhost:9000/sample/sample
// http://localhost/yagallery/#/http://localhost/yag-sample/Pentax-20140905
// http://10.8.0.1/yagallery/#/http://10.8.0.1/yag-sample/Pentax-20140905
// http://192.168.1.11/yagallery/#/http://192.168.1.11/yag-sample/Pentax-20140905

/*jshint unused: vars */
define(['jquery', 'perfect-scrollbar', 'angular', 'angular-perfect-scrollbar', 'angular-route', 'angular-animate', 'angular-touch'], function($) {
    'use strict';

    // Handle resizing
    function resizeSubBlocks() {
        var pageWidth = $(window).width();
        var pageHeight = $(window).height();

        var image = new Image();
        image.src = $('#main-photo').attr('src');
        var imageWidth = image.naturalWidth;
        var imageHeight = image.naturalHeight;

        var newWidth = imageWidth;
        var newHeight = imageHeight;
        if (imageWidth > pageWidth || imageHeight > pageHeight) {
            newWidth = pageWidth;
            newHeight = imageHeight * pageWidth / imageWidth;

            if (newHeight > pageHeight) {
                newWidth = imageWidth * pageHeight / imageHeight;
                newHeight = pageHeight;
            }
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

            currentImageIndex: -1,
            currentImageUrl: '',
            imageTShirtSize: '/medium/',

            cachedImages: {},
            cachedImagesLowOffset: 0,
            cachedImagesHighOffset: 0,

            // Populate the initial cache.  Configurable size.  Proportional to time it takes to load images?
            // Manage cursor that says where we are in cache, and loads + discards images
            // Home/end moves are disruptive: keep a home+end cache independently of the current position?

            // Process broadcast messages that say what is the image to display next.
            // Load image into cache if not already available, then display
            // Then do cache housekeeping

            SwitchImage: function(event, args) {
                var displacement = 'home';
                if (typeof args.displacement !== 'undefined')
                    displacement = args.displacement;

                if (typeof service.model.images !== 'undefined') {
                    var newIndex = -1;
                    switch(displacement) {
                        case 'home':
                            if (service.currentImageIndex !== 0)
                                newIndex = 0;
                            break;
                        case 'end':
                            if (service.currentImageIndex !== service.model.images.length - 1)
                                newIndex = service.model.images.length - 1;
                            break;
                        case 'next':
                            if (service.currentImageIndex < service.model.images.length - 1)
                                newIndex = service.currentImageIndex + 1;
                            break;
                        case 'previous':
                            if (service.currentImageIndex > 0)
                            newIndex = service.currentImageIndex - 1;
                            break;
                        default:
                            console.error('Bad displacement: ' + displacement);
                    }

                    if (newIndex !== -1) {
                        service.currentImageIndex = newIndex;
                        service.currentImageUrl = service.imageUrl + service.imageTShirtSize + service.model.images[service.currentImageIndex].file;
                        console.log('Model switched image: ' + service.currentImageIndex);
                    }
                }
            },

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

                        service.SwitchImage(null, {displacement: 'home'});

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
        $rootScope.$on('switchimage', service.SwitchImage);

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

        $scope.$on('dataloaded', function() {console.log('Data loaded'); /*$scope.switchImage();*/});

        $scope.keypress = function($event) {
            var isHandledHere = true;

            switch($event.keyCode) {
            case 39: // Right - next image
                $rootScope.$broadcast('switchimage', {displacement: 'next'});
                break;
            case 37: // Left - previous image
                $rootScope.$broadcast('switchimage', {displacement: 'previous'});
                break;
            case 36: // Home - go to 1st image
                $rootScope.$broadcast('switchimage', {displacement: 'home'});
                break;
            case 35: // End - go to last image
                $rootScope.$broadcast('switchimage', {displacement: 'end'});
                break;
            default:
                isHandledHere = false;
            }

            if (isHandledHere) {
                $event.preventDefault();
            }
        };

        $scope.swipeLeft = function($event) {
            $rootScope.$broadcast('switchimage', {displacement: 'next'});
        };

        $scope.swipeRight = function($event) {
            $rootScope.$broadcast('switchimage', {displacement: 'previous'});
        };

        $scope.goFullscreen = function($event) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
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
