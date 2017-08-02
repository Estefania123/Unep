ProgramacionApp.factory('CentroService',
    ['$http', '$rootScope', '$routeParams',
    function ($http, $rootScope, $routeParams) {
        var service = {};

        service.GuardarCentrooo = function (Centro1, callback) {
            $http.post(URLServices + "Centro/GuardarCentros/", Centro1)
                .success(function (response) {
                    callback(response);
                });
        };

        service.IdCentro = function (callback) {
            debugger;

            $http.post(URLServices + "Centro/IdCentro/")
            .success(function (response) {
                callback(response);
            });
        };

        service.ConsultarCentros = function (callback) {
            $http.get(URLServices + "Centro/ConsultarCentros/")
                .success(function (response) {
                    callback(response);
                });
        };

        service.ModificarCentrooo = function (centro, callback) {

            Item = {
                Parametro1: centro[0].Parametro1
            };

            $http.post(URLServices + "Centro/ModificarCentros/", Item)
                .success(function (response) {
                    callback(response);
                });
        };

        service.GuardarModificacionCentrooo = function (Centro1, callback) {
            $http.post(URLServices + "Centro/GuardarModificacion/", Centro1)
                .success(function (response) {
                    callback(response);
                });
        };

        service.EliminarCentroo = function (Centro, callback) {

            var Item = {
                Parametros: []
            }
            $.each(Centro, function (index, value) {
                Item.Parametros.push(
                    {
                        Parametro1: value.Parametro1
                    })
            });

            $http.post(URLServices + "Centro/EliminarCentro/", Item)
                .success(function (response) {
                    callback(response);
                });
        };

        service.ConsultarZona = function (callback) {
            $http.post(URLServices + "Centro/ConsultarZonas/")
            .success(function (response) {
                callback(response);
            });
        };

        service.ConsultarZonaxRegional = function (IdRegional, callback) {

            Item = {
                Parametro1: IdRegional,
            };
            $http.post(URLServices + "Centro/ConsultarZonaXRegionales/", Item)
            .success(function (response) {
                callback(response);
            });
        };

        service.ConsultarRegionales = function (IdZona, callback) {
            Item = {
                Parametro1: IdZona
            };
            $http.post(URLServices + "Centro/ConsultarRegionales/", Item)
            .success(function (response) {
                callback(response);
            });
        };


        return service;
    }]);
