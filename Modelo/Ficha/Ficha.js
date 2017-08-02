ProgramacionApp.controller('FichaController',
    ['$scope', '$rootScope', '$location', 'FichaService', '$routeParams', '$sce',
        function ($scope, $rootScope, $location, FichaService, $routeParams, $sce) {

            var nav = $("#navbar").hasClass("gn-menu-wrapper gn-open-all");
            if (nav == true) {
                $(".Principal").css("width", "80%");

            } else {
                $(".Principal").css("width", "95%");    
            }

            $scope.AbrirModal = function () {
                $("#ModalFicha").modal("show");
                $scope.VaciarCampos();
            };

            $("#atras").hide();

            //Datos de la ficha
            $scope.Ficha = {
                IdFicha: "",
                NumFicha:"",
                NumAprendices:"",
                Estado:"",
                TipoFormacion:"",
                FechaInicio:"",
                FechaFin:"",
                FechaLimite:"",
                FechaMomentoDos:"",
                FechaMomentoTres:"",
                Jornada:"",
                IdPrograma:""
            };


            //Datos del programa de formación
            $scope.Programa = {
                IdPrograma: "",
                CodigoPrograma: "",
                Nivel: "",
                IdArea: "",
                NombrePrograma: ""
            };

            $scope.curPage = 0;
            $scope.pageSize = 8;

            //Función para vaciar los campos
            $scope.VaciarCampos = function () {
                $scope.Ficha.IdArea = "";
                $scope.Ficha.NumFicha = "";
                $scope.Ficha.NumAprendices = "";
            };

            //Datos fecha guardar
            $('#FechaInicio').datepicker({
                language: 'es',
                autoclose: true,
            });

            //Datos fecha guardar
            $('#FechaFin').datepicker({
                language: 'es',
                autoclose: true,
            });

            //Datos fecha modificar
            $('#FechaMomentoDos').datepicker({
                language: 'es',
                autoclose: true,
            });

            //Datos fecha modificar
            $('#FechaMomentoTres').datepicker({
                language: 'es',
                autoclose: true,
            });

            //Datos fecha modificar
            $('#FechaFin1').datepicker({
                language: 'es',
                autoclose: true,
            });

            //Datos fecha modificar
            $('#FechaInicio1').datepicker({
                language: 'es',
                autoclose: true,
            });

            //Función para selecionar el nivel academico
            $scope.SeleccionarNivelAcademico = function (programa) {

                $.each($scope.Programa, function (index, value) {

                    if (value.IdPrograma == programa) {

                        $("#Nivel > option[value='" + value.Nivel.toUpperCase() + "']").attr('selected', 'selected');
                        $scope.Ficha.TipoFormacion = value.Nivel.toUpperCase();
                    }
                });
            };

            //Función para seleccionar todos los datos de la tabla
            $scope.SeleccionarTodos = function () {
                $.each($scope.Datos, function (index, value) {
                    value.Seleccionado = $scope.SeleccionTodos;
                });
            };

            //Función para consultar las areas de formacion
            FichaService.ConsultarAreas(function (response) {

                if (response.success == true) {
                    $scope.Area = response.datos;
                }
            });

            //Función para consultar los programas por area
            $scope.ConsultarProgramaxArea = function (IdArea) {
                FichaService.ConsultarProgramaxArea(IdArea, function (response) {

                    if (response.success == true) {
                        $scope.Programa = response.programa;
                    }
                });

            };

            //Función para duardar los datos de la ficha
            $scope.Guardar = function () {
                $.each($scope.Programa, function (index, value) {
                    if (value.IdPrograma == $scope.Programa.IdPrograma) {
                        $scope.Ficha.IdPrograma = value.IdPrograma
                    }
                });

                var x = $("#FechaInicio").val().split('/');
                var y = $("#FechaFin").val().split('/');

                var StartDate = x[1] + "-" + x[2] + "-" + x[0];
                var EndDate = y[1] + "-" + y[2] + "-" + y[0];
                if (Date.parse(StartDate) >= Date.parse(EndDate)) {
                    bootbox.dialog({
                        title: "Información",
                        message: "La fecha final debe ser mayor a la fecha inicial",
                        buttons: {
                            success: {
                                label: "Cerrar",
                                className: "btn-primary",
                            }
                        }
                    });
                    return;
                }

                if ($scope.Ficha.NumFicha == "" || $scope.Ficha.NumAprendices == null || $scope.Ficha.IdPrograma == "" || $scope.Ficha.TipoFormacion == "" ||
                    $scope.Ficha.FechaInicio == "" || $scope.Ficha.FechaFin == "" || $scope.Ficha.Jornada == "") {
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
                } else {
                    FichaService.GuardarFicha($scope.Ficha, function (response) {
                        if (response.success == true) {
                            FichaService.ConsultarFichas(function (response) {
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
                            $("#ModalFicha").modal("hide");
                            $scope.VaciarCampos();
                        }
                    });

                }
            };

            //Función para consultar las fichas
            FichaService.ConsultarFichas(function (response) {
                if (response.success == true) {
                    $scope.datalists = response.datos;
                    $scope.ListaCompleta = response.datos;
                    $scope.numberOfPages = function () {
                        return Math.ceil($scope.datalists.length / $scope.pageSize);
                    };
                    $.each($scope.datalists, function (index, value) {
                        var fechaInicio = value.Parametro6.toString().substring(0, 10);
                        var fechaFin = value.Parametro7.toString().substring(0, 10);
                        var fechaMomDos = value.Parametro11.toString().substring(0, 10);
                        var FechaMomTres = value.Parametro12.toString().substring(0, 10);


                        $scope.datalists[index].Parametro11 = fechaMomDos;
                        $scope.datalists[index].Parametro12 = FechaMomTres;
                        $scope.datalists[index].Parametro6 = fechaInicio;
                        $scope.datalists[index].Parametro7 = fechaFin;
                    });
                }
            });

            //Función para modificar una ficha
            $scope.ModificarFicha = function () {
                var ModificarF = $scope.datalists.filter(function (item) {
                    return item.Seleccionado === true;
                });
                if (ModificarF.length == 1) {

                    FichaService.ModificarFicha(ModificarF, function (response) {

                        if (response.success == true) {
                            $scope.Ficha.IdFicha = response.Ficha.IdFicha
                            $scope.Ficha.NumFicha = response.Ficha.NumFicha;
                            $scope.Ficha.NumAprendices = response.Ficha.NumAprendices;
                            $scope.Ficha.TipoFormacion = response.Ficha.TipoFormacion;
                            $scope.Ficha.FechaInicio = response.Ficha.FechaInicio.toString().substring(0, 10);
                            $scope.Ficha.FechaFin = response.Ficha.FechaFin.toString().substring(0, 10);
                            $scope.Ficha.FechaMomentoDos = response.Ficha.FechaMomentoDos.toString().substring(0, 10);
                            $scope.Ficha.FechaMomentoTres = response.Ficha.FechaMomentoTres.toString().substring(0, 10);
                            $scope.Ficha.Jornada = response.Ficha.Jornada;
                            $scope.Ficha.Estado = response.Ficha.Estado;

                            $scope.Ficha.IdPrograma = response.Ficha.IdPrograma;

                            FichaService.ConsultarAreaxPrograma(response.Ficha.IdPrograma, function (response) {

                                if (response.success == true) {

                                    $("#listas > option[value='" + response.dato.Parametro1 + "']").attr('selected', 'selected');

                                    FichaService.ConsultarProgramaxArea(response.dato.Parametro1, function (response) {

                                        if (response.success == true) {
                                            $scope.Programa = response.programa;
                                            setTimeout(function () {
                                                $("#ListaProgramasModificar > option[value='" + $scope.Ficha.IdPrograma + "']").attr('selected', 'selected');
                                            }, 500);
                                            $("#TipoFormacion > option[value='" + $scope.Ficha.TipoFormacion + "']").attr('selected', 'selected');
                                            $("#Jornada > option[value='" + $scope.Ficha.Jornada + "']").attr('selected', 'selected');
                                            $("#ModalEditar").modal("show");
                                        }
                                    });
                                }
                            });
                        } 
                    });
                } else {
                    bootbox.dialog({
                        title: "Editar",
                        message: "Debe seleccionar una ficha",
                        buttons: {
                            success: {
                                label: "Cerrar",
                                className: "btn-primary",
                            }
                        }
                    });
                }
            };

            //Función para guardar la edición de unas ficha
            $scope.GuardarEdicionFicha = function () {
                $.each($scope.Programa, function (index, value) {
                    if (value.NombrePrograma == $scope.Programa.NombrePrograma) {
                        $scope.Ficha.IdPrograma = value.IdPrograma
                    }
                });

                if ($scope.Ficha.NumFicha == "" || $scope.Ficha.NumAprendices == null || $scope.Ficha.IdPrograma == "" || $scope.Ficha.TipoFormacion == "" ||
                    $scope.Ficha.FechaInicio == "" || $scope.Ficha.FechaMomentoDos == "" || $scope.Ficha.FechaMomentoTres == "" || $scope.Ficha.FechaFin == "" || $scope.Ficha.Jornada == "") {

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
                } else {
                    FichaService.GuardarModificacionFicha($scope.Ficha, function (response) {
                        if (response.success == true) {
                            $("#ModalEditar").modal("hide");

                            FichaService.ConsultarFichas(function (response) {
                                if (response.success == true) {

                                    $scope.datalists = response.datos;
                                    $scope.ListaCompleta = response.datos;
                                    $scope.numberOfPages = function () {
                                        return Math.ceil($scope.datalists.length / $scope.pageSize);
                                    };
                                    $.each($scope.datalists, function (index, value) {
                                        var fechaInicio = value.Parametro6.toString().substring(0, 10);
                                        var fechaFin = value.Parametro7.toString().substring(0, 10);
                                        var fechaMomDos = value.Parametro11.toString().substring(0, 10);
                                        var FechaMomTres = value.Parametro12.toString().substring(0, 10);
                                        $scope.datalists[index].Parametro11 = fechaMomDos;
                                        $scope.datalists[index].Parametro12 = FechaMomTres;
                                        $scope.datalists[index].Parametro6 = fechaInicio;
                                        $scope.datalists[index].Parametro7 = fechaFin;
                                    });
                                }
                            });
                        }
                    });
                }

            };

            $scope.Filter = function (e) {
                var Busqueda = $("#Buscar").val();
                var exp = new RegExp(Busqueda);
                if (Busqueda == "") {

                    FichaService.ConsultarFichas(function (response) {
                            if (response.success == true) {
                                $scope.datalists = response.datos;
                                $scope.ListaCompleta = response.datos;
                                $.each($scope.datalists, function (index, value) {
                                    var fechaInicio = value.Parametro6.toString().substring(0, 10);
                                    var fechaFin = value.Parametro7.toString().substring(0, 10);
                                    var fechaMomDos = value.Parametro11.toString().substring(0, 10);
                                    var FechaMomTres = value.Parametro12.toString().substring(0, 10);


                                    $scope.datalists[index].Parametro11 = fechaMomDos;
                                    $scope.datalists[index].Parametro12 = FechaMomTres;
                                    $scope.datalists[index].Parametro6 = fechaInicio;
                                    $scope.datalists[index].Parametro7 = fechaFin;
                                });
                                $scope.numberOfPages = function () {
                                    return Math.ceil($scope.datalists.length / $scope.pageSize);
                                };
                            }
                        });

                }
                var Ficha = [];
                $scope.datalists = $scope.ListaCompleta;
                Ficha = $scope.datalists.filter(function (item) {

                    if (exp.test(item.Parametro8.toLowerCase()) || exp.test(item.Parametro8.toUpperCase())) {

                        return item;
                    }

                    else if (exp.test(item.Parametro2.toLowerCase()) || exp.test(item.Parametro2.toUpperCase())) {
                        return item;
                    }

                    else if (exp.test(item.Parametro3.toLowerCase()) || exp.test(item.Parametro3.toUpperCase())) {
                        return item;
                    }

                    else if (exp.test(item.Parametro4.toLowerCase()) || exp.test(item.Parametro4.toUpperCase())) {
                        return item;
                    }
                    else if (exp.test(item.Parametro6.toLowerCase()) || exp.test(item.Parametro6.toUpperCase())) {
                        return item;
                    }
                    else if (exp.test(item.Parametro7.toLowerCase()) || exp.test(item.Parametro7.toUpperCase())) {
                        return item;
                    }

                });
                $scope.datalists = Ficha;
                //Variable para setear la paginación 
                $scope.curPage = 0;
            };

        }]);