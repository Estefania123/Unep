// create the module and name it scotchApp
var ProgramacionApp = angular.module('ProgramacionApp', ['ngRoute', 'ngCookies', 'ngNotify']);


ProgramacionApp.config(function ($routeProvider) {

    $routeProvider
          .when('/Centro', {
              templateUrl: 'Vistas/CentroVista.html',
              controller: 'CentroController'
          })
       .when('/Area', {
           templateUrl: 'Vistas/AreaVista.html',
           controller: 'AreaController'
       })
      .when('/Coordinacion', {
          templateUrl: 'Vistas/CoordinacionVista.html',
          controller: 'CoordinacionController'
      })
          .when('/Programa', {
              templateUrl: 'Vistas/ProgramaVista.html',
              controller: 'ProgramaController'
     })
                .when('/Instructor', {
                    templateUrl: 'Vistas/InstructorVista.html',
                    controller: 'InstructorController'
              })

               .when('/Ficha', {
                   templateUrl: 'Vistas/FichaVista.html',
                   controller: 'FichaController'
     })

     //     .when('/Login', {
     //         templateUrl: 'Vistas/LoginVista.html',
     //         controller: 'LoginController'
     //     })

          })



//.run(['$rootScope', '$location', '$cookies', '$cookieStore', '$http', '$templateCache',
//    function ($rootScope, $location, $cookies, $cookieStore, $http, $templateCache) {
//        $rootScope.$on('$locationChangeStart', function (event, next, current) {
//            $rootScope.globals = $cookieStore.get('username');

//            if ($rootScope.globals != undefined) {
//                if ($location.path() !== '/Login' && !$rootScope.globals) {
//                    if ($location.path() == "/Solicitud") {
//                        var url = $location.search();
//                        if (url != "") {
          
//                            $location.url("/Login");
//                            return;
//                        }
//                    }
//                    $cookies.put("solicitud", undefined);
//                } else {
//                    $("#BodyPrincipal").css("display", "block");
//                    $("#username").text($rootScope.globals.currentUser.nombre + " " + $rootScope.globals.currentUser.apellido);
              
//                    if ($rootScope.globals.currentUser.tipousuario == 3) {
//                        $(".items-menu-principal").css("display", "none");
                     
//                    }
//                    if ($rootScope.globals.currentUser.tipousuario == 2) {
//                        $(".not-coor").css("display", "none");
                 
//                    }
//                    if ($rootScope.globals.currentUser.tipousuario == 1) {
//                        $(".not-admin").css("display", "none");
                  
//                    }
//                }
//            }

//            if ($location.path() !== '/Login' && !$rootScope.globals) {
//                $location.path('/Login');
//            }
//        });
//    }]);



    // create the controller and inject Angular's $scope
ProgramacionApp.controller('PrincipalController',
    ['$scope', '$rootScope', '$cookies', '$cookieStore', 'InstructorService', 'LoginService', '$http', '$location',
    function ($scope, $rootScope, $cookies, $cookieStore, InstructorService, LoginService, $http, $location) {



            $scope.CerrarSesion = function () {
                $cookies.remove("username");
                $location.url('/Login');
            };


            $scope.AbrirCentro = function () {
                $location.url("/Centro");
            };
            $scope.AbrirArea = function () {
                $location.url("/Area");
            };
            $scope.AbrirCoordinacion = function () {
                $location.url("/Coordinacion");
            };
            $scope.AbrirPrograma = function () {
                $location.url("/Programa");
            };
            $scope.AbrirInstructor = function () {
                $location.url("/Instructor");
            };
            $scope.AbrirFicha = function () {
                $location.url("/Ficha");
            };

            $scope.UsuarioCambiarPass = {
                Password: "",
                newPass: ""
            };

            $scope.AbrirModalCambiarPass = function () {
                $("#ModalCambiarPass").modal("show");
            };

            $scope.CambiarPass = function () {
                LoginService.CambiarPassword($scope.UsuarioCambiarPass, $rootScope.globals.currentUser.id, function (response) {
                    if (response.success = true) {

                        bootbox.dialog({
                            title: "Información",
                            message: "El cambio de contraseña se realizó con éxito",
                            buttons: {
                                success: {
                                    label: "Cerrar",
                                    className: "btn-primary",
                                }
                            }
                        });
                    }
                })
            };


        }]); 
