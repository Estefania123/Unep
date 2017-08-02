ProgramacionApp.controller('CoordinacionController',
    ['$scope', '$rootScope', '$location', 'CoordinacionService', '$routeParams', '$sce',
        function ($scope, $rootScope, $location, CoordinacionService, $routeParams, $sce) {

            var nav = $("#navbar").hasClass("gn-menu-wrapper gn-open-all");
            if (nav == true) {
                $(".Principal").css("width", "80%");

            } else {
                $(".Principal").css("width", "95%");
            }

            $scope.Coordinacion = {
                IdCoordinacion: "",
                Cedula: "",
                Nombre: "",
                Apellido: "",
                Telefono: "",
                Correo: "",
                IdCentro: "",
                IdArea: ""
            };
   
            //Función para abrir modal de la coordinacion 
            $scope.AbrirModal = function () {
                $("#ModalCoordinacion").modal("show");
                $scope.VaciarCampos();
            };

            //Función para vaciar los campos 
            $scope.VaciarCampos = function () {
                $scope.Coordinacion.IdArea = "";
                $scope.Coordinacion.IdCentro = "";
                $scope.Coordinacion.Cedula = "";
                $scope.Coordinacion.Nombre = "";
                $scope.Coordinacion.Apellido = "";
                $scope.Coordinacion.Telefono = "";
                $scope.Coordinacion.Correo = "";
            };

            //Función para consultar las areas 
            CoordinacionService.ConsultarAreasss(function (response) {
                if (response.success == true) {
                    $scope.Area = response.datos;
                }
            });

            //Función para consultar los Centros 
            CoordinacionService.ConsultarCentrosss(function (response) {
                if (response.success == true) {
                    $scope.Centro = response.datos;
                }
            });

            //Función para Guardar la coordinacion 
            $scope.Guardar = function () {

                $.each($scope.Area, function (index, value) {
                    if (value.IdArea == $scope.Area.IdArea) {
                        $scope.Coordinacion.IdArea = value.IdArea
                    }
                });
                $.each($scope.Centro, function (index, value) {
                    if (value.IdCentro == $scope.Centro.IdCentro) {
                        $scope.Coordinacion.IdCentro = value.IdCentro;
                    }
                });
                if ($scope.Coordinacion.Cedula == "" || $scope.Coordinacion.Nombre == "" || $scope.Coordinacion.Apellido == "" || $scope.Coordinacion.Telefono == "" || $scope.Coordinacion.Correo == "" || $scope.Coordinacion.IdCentro == "" || $scope.Coordinacion.IdArea == "") {
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
                    return;
                } else {
                    CoordinacionService.GuardarCoordinacion($scope.Coordinacion, function (response) {
                        if (response.success == true) {
                           
                            CoordinacionService.ConsultarCoordinacionnn(function (response) {
                                    if (response.success == true) {
                                        $scope.datalists = response.datos;
                                        $scope.ListaCompleta = response.datos;
                                    }
                                });                                
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

                            $("#ModalCoordinacion").modal("hide");
                            $scope.VaciarCampos();

                        }
                    );
                }
            };

            //Función para consultar la coordinacion 
            CoordinacionService.ConsultarCoordinacionnn(function (response) {
                if (response.success == true) {
                    $scope.curPage = 0;
                    $scope.pageSize = 8;
                    $scope.datalists = response.datos;
             
                    $scope.numberOfPages = function () {
                        return Math.ceil($scope.datalists.length / $scope.pageSize);
                    };

                    $scope.Datos = $scope.datalists;
                }
            });

            //Función para Cambiar estado de la coordinacion 
            $scope.CambiarEstadoSeleccionados = function () {
                var UsariosBorrar = $scope.datalists.filter(function (item) {
                    return item.Seleccionado === true;
                });

                if (UsariosBorrar.length == 0) {

                    bootbox.dialog({
                        title: "Eliminar",
                        message: "Seleccione por lo menos una coordinación",
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
            };

            //Función para inhabilitar la coordinacion 
            $scope.inhabilitar = function () {

                var CoordinacionesBorrar = $scope.datalists.filter(function (item) {
                    return item.Seleccionado === true;
                });
                CoordinacionService.BorrarCoordinacionessss(CoordinacionesBorrar, function (response) {

                    if (response.success == true) {
                        CoordinacionService.ConsultarCoordinacionnn(function (response) {
                            if (response.success == true) {
                                bootbox.dialog({
                                    title: "Información",
                                    message: "La eliminación se realizó con éxito",
                                    buttons: {
                                        success: {
                                            label: "Cerrar",
                                            className: "btn-primary",
                                        }
                                    }
                                });
                                $scope.datalists = response.datos;
                                $scope.ListaCompleta = response.datos;
                            }
                        });
                    }

                });

            };

            //Función para Modificar la coordinacion 
            $scope.Modificar = function () {
                var ModificarC = $scope.datalists.filter(function (item) {
                    return item.Seleccionado === true;
                });

                if (ModificarC.length == 1) {

                    CoordinacionService.ModificarCoor(ModificarC, function (response) {

                        if (response.success == true) {

                            $scope.Coordinacion.IdCoordinacion = response.Coordinacion.IdCoordinacion;
                            $scope.Coordinacion.Cedula = parseInt(response.Coordinacion.Cedula);
                            $scope.Coordinacion.Nombre = response.Coordinacion.Nombre;
                            $scope.Coordinacion.Apellido = response.Coordinacion.Apellido;
                            $scope.Coordinacion.Telefono = parseInt(response.Coordinacion.Telefono);
                            $scope.Coordinacion.Correo = response.Coordinacion.Correo
                            $scope.Coordinacion.IdArea = response.Coordinacion.IdArea;
                            $("#AreaLista > option[value='" + response.Coordinacion.IdArea + "']").attr('selected', "selected");
                            $scope.Coordinacion.IdCentro = response.Coordinacion.IdCentro;
                            $("#CentroLista > option[value='" + response.Coordinacion.IdCentro + "']").attr('selected', 'selected');
                            $("#ModalEditar").modal("show");
  
                        }
                    });
                } else {

                    bootbox.dialog({
                        title: "Editar",
                        message: "Debe seleccionar una Coordinación",
                        buttons: {
                            success: {
                                label: "Cerrar",
                                className: "btn-primary",
                            }
                        }
                    });
                }
            }

            //Función para Guardar la modificación de la coordinacion 
            $scope.GuardarEdicionCoordinacion = function () {
                $.each($scope.Area, function (index, value) {

                    if (value.IdArea == $scope.Area.IdArea) {

                        $scope.Coordinacion.IdArea = value.IdArea
                    }
                });
                $.each($scope.Centro, function (index, value) {

                    if (value.IdCentro == $scope.Centro.IdCentro) {

                        $scope.Coordinacion.IdCentro = value.IdCentro;
                    }
                });
                if ($scope.Coordinacion.Cedula == "" || $scope.Coordinacion.Nombre == "" || $scope.Coordinacion.Apellido == "" || $scope.Coordinacion.Telefono == "" || $scope.Coordinacion.Correo == "" || $scope.Coordinacion.IdCentro == "" || $scope.Coordinacion.IdArea == "") {
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
                    return;
                } else {
                    CoordinacionService.GuardarModificacionCoordinacion($scope.Coordinacion, function (response) {
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
                            $scope.VaciarCampos();
                            $("#ModalEditar").modal("hide");
                            CoordinacionService.ConsultarCoordinacionnn(function (response) {
                                if (response.success == true) {
                                    $scope.datalists = response.datos;
                                    $scope.ListaCompleta = response.datos;
                                }
                            });
                        }
                    });
                }
            };

            //Función para filtrar la coordinacion 
            $scope.Filter = function (e) {



                var Busqueda = $("#Buscar").val();
                var exp = new RegExp(Busqueda);
                if (Busqueda == "") {
                    CoordinacionService.ConsultarCoordinacionnn(function (response) {
                        if (response.success == true) {
                            $scope.datalists = response.datos;
                            $scope.ListaCompleta = response.datos;
                        }
                    });
                }
                var Coordinacion = [];
                $scope.datalists = $scope.ListaCompleta;
                Coordinacion = $scope.datalists.filter(function (item) {

                  

                    if (exp.test(item.Descripcion.toLowerCase()) || exp.test(item.Descripcion.toUpperCase())) {

                        return item;
                    }

                    else if (exp.test(item.NombreCoordinacion.toLowerCase()) || exp.test(item.NombreCoordinacion.toUpperCase())) {
                        return item;
                    }

                });
                $scope.datalists = Coordinacion;
                //Variable para setear la paginación 
                $scope.curPage = 0;
            };
        }]);