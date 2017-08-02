ProgramacionApp.controller('CentroController',
    ['$scope', '$rootScope', '$location', 'CentroService', '$routeParams', '$sce',
        function ($scope, $rootScope, $location, CentroService, $routeParams, $sce) {

            $scope.AbrirModal = function () {
                $("#ModalCentro").modal("show");
                $scope.VaciarCampos();
            };
            var nav = $("#navbar").hasClass("gn-menu-wrapper gn-open-all");
            if (nav == true) {
                $(".Principal").css("width", "80%");

            } else {
                $(".Principal").css("width", "95%");
            }
            $("#atras").hide();


            $scope.centro = {
                IdCentro: "",
                NombreCentro: "",
                IdRegional:"",
                Codigo: "",
                Direccion: "",
              
            };

            $scope.Zona = {
                IdZona: "",
                Nombre: ""
            };

            $scope.Regional = {
                IdRegional: "",
                NombreRegional: "",
                IdZona: ""
            };

            // pagination
            $scope.curPage = 0;
            $scope.pageSize = 8;


            //Funcion para guardar los campos 
            $scope.Guardar = function () {
                $.each($scope.Regional, function (index, value) {
                    if (value.IdRegional == $scope.Regional.IdRegional) {
                        $scope.centro.IdRegional = value.IdRegional;
                    }
                });
                if ($scope.centro.NombreCentro != "" || $scope.centro.IdRegional != "" || $scope.centro.Codigo != "" || $scope.centro.Direccion != "") {
                    CentroService.GuardarCentrooo($scope.centro, function (response) {
                        if (response.success == true) {
                            CentroService.ConsultarCentros(function (response) {
                                if (response.success == true) {
                                    $scope.datalists = response.datos;
                                    $scope.ListaCompleta = response.datos;
                                    bootbox.dialog({
                                        title: "Información",
                                        message: "El registro se realizó con éxito",
                                        buttons: {
                                            success: {
                                                label: "Cerrar",
                                                className: "btn-primary",
                                            }
                                        }
                                    });
                                }
                                $("#ModalCentro").modal("hide");
                                $scope.VaciarCampos();
                            });
                        } else {
                            bootbox.dialog({
                                title: "Información",
                                message: "El centro ya se encuentra resgistrado",
                                buttons: {
                                    success: {
                                        label: "Cerrar",
                                        className: "btn-primary",
                                    }
                                }
                            });
                        }
                    });
                } else {
                    bootbox.dialog({
                        title: "Información",
                        message: "Debe diligenciar todos los campos",
                        buttons: {
                            success: {
                                label: "Cerrar",
                                className: "btn-primary",
                            }
                        }
                    });
                }
            };

           //Funcion para vaciar los campos
            $scope.VaciarCampos = function () {
                $scope.centro.NombreCentro = "";
                $scope.centro.Descripcion = "";
                $scope.centro.Direccion = "";
                $scope.centro.Codigo = "";
                $scope.centro.IdZona = "";
                $scope.centro.IdRegional = "";
            };

            //Funcion para consultar los centros
            CentroService.ConsultarCentros(function (response) {
                if (response.success == true) {
              
                    $scope.datalists = response.datos;
        
                    $scope.numberOfPages = function () {
                        return Math.ceil($scope.datalists.length / $scope.pageSize);
                    };

                    $scope.Datos = $scope.datalists;
                }
            });

            //Funcion para consultar las zonas
            CentroService.ConsultarZona(function (response) {
                if (response.success == true) {
                    $scope.Zona = response.datos;
                }
            });

            //Funcion para consultar las regionales
            $scope.ConsultarZonasRegionales = function (IdZona) {

                $.each($scope.Zona, function (index, value) {
                    if (value.IdZona == IdZona) {


                        CentroService.ConsultarRegionales(value.IdZona, function (response) {

                            if (response.success == true) {
                                $scope.Regional = response.datos;
                            }
                        });
                    }

                });
            };

            //Funcion para Modificar los centros
            $scope.Editar = function () {

                var CentroModificar = $scope.datalists.filter(function (item) {
                        return item.Seleccionado === true;
                    });

                if (CentroModificar.length == 1) {

                    CentroService.ModificarCentrooo(CentroModificar, function (response) {

                        if (response.success == true) {
                            $scope.centro.IdCentro = response.centro.IdCentro;
                            $scope.centro.NombreCentro = response.centro.NombreCentro;
                            $scope.centro.IdRegional = response.centro.IdRegional;
                            $scope.centro.Direccion = response.centro.Direccion;
                            $scope.centro.Codigo = response.centro.Codigo;

                            CentroService.ConsultarZonaxRegional($scope.centro.IdRegional, function (response) {

                                if (response.success == true) {
                                    $("#zona > option[value='" + response.datos.IdZona + "']").attr('selected', 'selected');

                                    CentroService.ConsultarRegionales(response.datos.IdZona, function (response) {

                                        if (response.success == true) {

                                            $scope.Regional = response.datos;

                                            setTimeout(function () {
                                                $("#regional > option[value='" + $scope.centro.IdRegional + "']").attr('selected', 'selected');
                                            }, 1000)

                                        }

                                    });
                                }

                            });


                            $("#ModalEditar").modal("show");
                        }
                    });
                } else {

                    bootbox.dialog({
                        title: "Editar",
                        message: "Debe seleccionar un Centro de formación",
                        buttons: {
                            success: {
                                label: "Cerrar",
                                className: "btn-primary",
                            }
                        }
                    });
                }
            };

            //Funcion para Guardar la modificación de los centros
            $scope.GuardarEdicionCentro = function () {


                $.each($scope.Regional, function (index, value) {
                    if (value.IdRegional == $scope.Regional.IdRegional) {

                        $scope.centro.IdRegional = value.IdRegional;

                    }

                });

                if ($scope.centro.NombreCentro != "" || $scope.centro.IdRegional != "" || $scope.centro.Codigo != "" || $scope.centro.Direccion != "") {

                    CentroService.GuardarModificacionCentrooo($scope.centro, function (response) {

                        if (response.success == true) {
                            bootbox.dialog({
                                title: "Información",
                                message: "La modificación se realizó con éxito",
                                buttons: {
                                    success: {
                                        label: "Cerrar",
                                        className: "btn-primary",
                                    }
                                }
                            });
                            $("#ModalEditar").modal("hide");
                 
                            CentroService.ConsultarCentros(function (response) {
                                if (response.success == true) {
                                    $scope.datalists = response.datos;
                                    $scope.ListaCompleta = response.datos;
                                }
                            });
                        }
                    });
                } else {
                    bootbox.dialog({
                        title: "Información",
                        message: "Debe diligenciar todos los campos",
                        buttons: {
                            success: {
                                label: "Cerrar",
                                className: "btn-primary",
                            }
                        }
                    });
                }
            }

            //Funcion para Seleccionar los centros
            $scope.SeleccionarTodos = function () {

                contador = (($scope.curPage + 1) * 3) - 3;
                var item = (($scope.curPage + 1) * 3) - 3;
                var items1 = (($scope.curPage + 1) * 3);

                $.each($scope.datalists, function (index, value) {
                    if (contador < items1) {
                        value[contador];
                        value.Seleccionado = $scope.SeleccionTodos;
                        contador++;
                    }
                });
            };

            //Función 1 para filtrar la tabla
            $scope.Filter = function (e) {

                var Busqueda = $("#Buscar").val();
                var exp = new RegExp(Busqueda);
                if (Busqueda == "") {
                    CentroService.ConsultarCentros(function (response) {
                        if (response.success == true) {
                            $scope.datalists = response.datos;
                            $scope.ListaCompleta = response.datos;
                        }
                    });
                }
                var centro = [];
                $scope.datalists = $scope.ListaCompleta;
                centro = $scope.datalists.filter(function (item) {

                    if (exp.test(item.Parametro5.toLowerCase()) || exp.test(item.Parametro5.toUpperCase())) {

                        return item;
                    }

                    else if (exp.test(item.Parametro4.toLowerCase()) || exp.test(item.Parametro4.toUpperCase())) {
                        return item;
                    }

                    else if (exp.test(item.Parametro3.toLowerCase()) || exp.test(item.Parametro3.toUpperCase())) {
                        return item;
                    }
                    else if (exp.test(item.Parametro2.toLowerCase()) || exp.test(item.Parametro2.toUpperCase())) {
                        return item;
                    }
                 

                });
                $scope.datalists = centro;
                //Variable para setear la paginación 
                $scope.curPage = 0;
            };

            //Funcion para Cambiar estado de un centro
            $scope.CambiarEstadoSeleccionados = function () {
                var UsariosBorrar = $scope.datalists.filter(function (item) {
                    return item.Seleccionado === true;
                });

                if (UsariosBorrar.length == 0) {

                    bootbox.dialog({
                        title: "Eliminar",
                        message: "Seleccione por lo menos un Centro",
                        buttons: {
                            success: {
                                label: "Cerrar",
                                className: "btn-primary",
                            }
                        }
                    });
                } else {

                    $("#modalInhabilitar").modal("show");
                }
            }

            //Funcion para eliminar un centro
            $scope.Eliminar = function () {
                var BorrarCentro = $scope.datalists.filter(function (item) {
                    return item.Seleccionado === true;
                });
                CentroService.EliminarCentroo(BorrarCentro, function (response) {

                    if (response.success == true && response.respuesta == true) {
                        CentroService.ConsultarCentros(function (response) {
                            if (response.success == true) {
                                $scope.datalists = response.datos;
                                $scope.ListaCompleta = response.datos;
                            }
                        })

                        bootbox.dialog({
                            title: "Eliminar",
                            message: "Se eliminaron las siguientes cantidad de registros " + response.contadorTrue,
                            buttons: {
                                success: {
                                    label: "Cerrar",
                                    className: "btn-primary",
                                }
                            }
                        });


                    } else {

                        bootbox.dialog({
                            title: "Inhabilitar",
                            message: "No se puede eliminar el dato porque esta asociado a otras tablas.",
                            buttons: {
                                success: {
                                    label: "Cerrar",
                                    className: "btn-primary",
                                }
                            }
                        });
                    }
                });
            };
        }]);