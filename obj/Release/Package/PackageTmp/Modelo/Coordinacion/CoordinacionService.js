ProgramacionApp.factory('CoordinacionService',
    ['$http', '$rootScope', '$routeParams',
    function ($http, $rootScope, $routeParams) {
        var service = {};

        service.GuardarCoordinacion = function (Coordinacion1, callback) {
            $http.post(URLServices + "Coordinacion/GuardarCoordinacion/", Coordinacion1)
                .success(function (response) {
                    callback(response);
                });
        };

        service.ConsultarCoordinacionnn = function (callback) {
            $http.get(URLServices + "Coordinacion/ConsultarCoordinacion/")
                .success(function (response) {
                    callback(response);
                });
        };

        service.ModificarCoor = function (Coordi, callback) {

            Item = {
                Parametro1: Coordi[0].Parametro1
            };

            $http.post(URLServices + "Coordinacion/ModificarCoordinacion/", Item)
              .success(function (response) {
                  callback(response);
              })
        };

        service.ConsultarAreasss = function (callback) {
            $http.get(URLServices + "Programa/ConsultarAreas/")
                .success(function (response) {
                    callback(response);
                });
        };

        service.ConsultarCentrosss = function (callback) {
            $http.get(URLServices + "Coordinacion/ConsultarCentros/")
                .success(function (response) {
                    callback(response);
                });
        };

        service.GuardarModificacionCoordinacion = function (coordinacion, callback) {
            $http.post(URLServices + "Coordinacion/GuardarModificacionCoordinacion", coordinacion)
                .success(function (response) {
                    callback(response);
                })
        };


        service.BorrarCoordinacionessss = function (Coordinaciones, callback) {
            var Item = {
                Parametros: []
            };

            $.each(Coordinaciones, function (index, value) {
                Item.Parametros.push(
                    {
                        Parametro1: value.Parametro1
                    })
            });
            $http.post(URLServices + "Coordinacion/EliminarCoordinacion/", Item)
                .success(function (response) {
                    callback(response);
                });
        };


        return service;

    }]);

