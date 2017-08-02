ProgramacionApp.controller('ProgramaController',
    ['$scope', '$rootScope', '$location', 'ProgramaService', '$routeParams', '$sce',
        function ($scope, $rootScope, $location, ProgramaService, $routeParams, $sce) {

            var nav = $("#navbar").hasClass("gn-menu-wrapper gn-open-all");
            if (nav == true) {
                $(".Principal").css("width", "80%");

            } else {
                $(".Principal").css("width", "95%");
            }

            $scope.UploadFileWeb = function () {
                $("#fileUploadWeb").trigger('click');
            };

            $("#fileUploadWeb").change(function () {
                dataweb = new FormData();

                var files = $("#fileUploadWeb").get(0).files;

                //
                var fileExtension = ['xlsx'];
                if ($.inArray($(this).val().split('.').pop().toLowerCase(), fileExtension) == -1) {
                    bootbox.dialog({
                        title: "Importar Archivo",
                        message: "La extencion del archivo no es valida",
                        buttons: {
                            success: {
                                label: "Cerrar",
                                className: "btn-primary",
                            }
                        }
                    });
                    $("#fileUploadWeb").replaceWith($("#fileUploadWeb").val('').clone(true));

                    //waitingDialog.hide();
                    return false;

                }


                // Add the uploaded image content to the form data collection
                if (files.length > 0) {

                    readURL(this, "logoweb");

                    dataweb.append("UploadedImage", files[0]);
                    if (dataweb != null) {
                        ProgramaService.SubirArchivo(dataweb, function (response) {
                            if (response.success) {

                                bootbox.dialog({
                                    title: "Importar Archivo",
                                    message: "La importación del archivo se realizó con éxito ",
                                    buttons: {
                                        success: {
                                            label: "Cerrar",
                                            className: "btn-primary",
                                        }
                                    }
                                });


                                $scope.path = response.path;

                                $("#fileUploadWeb").replaceWith($("#fileUploadWeb").val('').clone(true));
                                ProgramaService.ConsultarProgramas(function (response) {
                                    if (response.success == true) {
                                        $scope.datalists = response.datos;
                                        $scope.ListaCompleta = response.datos;
                                    }
                                });

                                $("#fileUploadWeb").replaceWith($("#fileUploadWeb").val('').clone(true));
                                //waitingDialog.hide();

                                return;
                            }
                        });
                    }
                } });

                function readURL(input, control) {
                if (input.files && input.files[0]) {
                    var reader = new FileReader();

                    reader.onload = function (e) {
                        $('#' + control + '').attr('src', e.target.result);
                    }

                    reader.readAsDataURL(input.files[0]);
                }
            };

            $scope.curPage = 0;
            $scope.pageSize = 8;

            $scope.Programa = {
                IdPrograma: "",
                CodigoPrograma: "",
                Nivel: "",
                IdArea: "",
                NombrePrograma: ""
            };

            $scope.Area = {
                IdArea: "",
                Codigo: "",
                Nombre: "",
                Descripcion: "",
                IdCoordinacion: ""

            };

            $scope.AbrirModal = function () {

                $("#ModalPrograma").modal("show");
            
            };


            //Funcion para vaciar los campos
            $scope.VaciarCampos = function () {
                $scope.Programa.IdPrograma = "";
                $scope.Programa.CodigoPrograma = "";
                $scope.Programa.Nivel = "";
                $scope.Programa.IdArea = "";
                $scope.Programa.NombrePrograma = "";
            };

            //Función para consultar las áreas
            ProgramaService.ConsultarAreas(function (response) {
                if (response.success == true) {
                    $scope.Area = response.datos;

                }
            });

            //Función para guardar un Programa
            $scope.GuardarPrograma = function () {
                $.each($scope.Area, function (index, value) {
                    if (value.IdArea == $scope.Area.IdArea) {
                        $scope.Programa.IdArea = value.IdArea;
                    }
                });
                if ($scope.Programa.CodigoPrograma != "" || $scope.Programa.Nivel != "" || $scope.Programa.IdArea != "" || $scope.Programa.NombrePrograma != "") {

                    ProgramaService.GuardarProgramaaa($scope.Programa, function (response) {
                        if (response.success == true) {

                            $scope.VaciarCampos();

                            $("#ModalPrograma").modal("hide");

                            ProgramaService.ConsultarProgramas(function (response) {
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

            //Función para consultar los programas
            ProgramaService.ConsultarProgramas(function (response) {

                    if (response.success == true) {

                        $scope.datalists = response.datos;
                        $scope.ListaCompleta = response.datos;
                        $scope.Datos = $scope.datalists;
                        $scope.numberOfPages = function () {
                            return Math.ceil($scope.datalists.length / $scope.pageSize);
                        };
                    }
                });
            
            //Función para Seleccionar todos las registros de la tabla
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

            //Función 1 para el borrado de los programas
            $scope.CambiarEstadoSeleccionados = function () {
                var UsariosBorrar = $scope.datalists.filter(function (item) {
                    return item.Seleccionado === true;
                });

                if (UsariosBorrar.length == 0) {

                    bootbox.dialog({
                        title: "Eliminar",
                        message: "Debe por lo menos seleccionar un Programa",
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

            //Función 2 para el borrado de los programas
            $scope.inhabilitar = function () {

                var ProgramaBorrar = $scope.datalists.filter(function (item) {
                    return item.Seleccionado === true;
                });
                ProgramaService.BorrarPrograma(ProgramaBorrar, function (response) {

                    if (response.success == true && response.respuesta == true) {
                        ProgramaService.ConsultarProgramas(function (response) {
                            if (response.success == true) {
                                $scope.datalists = response.datos;
                                $scope.ListaCompleta = response.datos;
                            }

                        })

                        bootbox.dialog({
                            title: "Eliminar",
                            message: "Se elimaron las siguiente cantidad de registros " + response.contadorTrue,
                            buttons: {
                                success: {
                                    label: "Cerrar",
                                    className: "btn-primary",
                                }
                            }
                        });


                    } else {

                        bootbox.dialog({
                            title: "Eliminar",
                            message: "No se puedieron elimanar la siguiente cantidad de registros " + response.contadorFalse + " porque estan asociados a otras tablas.",
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

            //Función 1 para editar los programas
            $scope.Modificar = function () {
                var ProgramaModificar = $scope.datalists.filter(function (item) {
                return item.Seleccionado === true;
                });


                if (ProgramaModificar.length == 1) {

                    ProgramaService.ModificarPrograma(ProgramaModificar, function (response) {

                        if (response.success == true) {

                            $scope.Programa.IdPrograma = response.programa.IdPrograma;
                            $scope.Programa.CodigoPrograma = response.programa.CodigoPrograma;
                            $scope.Programa.Nivel = response.programa.Nivel;
                          
                            $scope.Programa.NombrePrograma = response.programa.NombrePrograma;
                            $scope.Programa.IdArea = response.programa.IdArea;
                            $("#AreaLista > option[value='" + response.programa.IdArea + "']").attr('selected', 'selected');
                            console.log(response.programa.Nivel);
                            $("#NivelLista > option[value='" + response.programa.Nivel + "']").attr('selected', 'selected');
                            $("#ModalEditar").modal("show");


                        }
                    });
                } else {

                    bootbox.dialog({
                        title: "Editar",
                        message: "Debe seleccionar un Programa",
                        buttons: {
                            success: {
                                label: "Cerrar",
                                className: "btn-primary",
                            }
                        }
                    });
                }
            }

            //Función 2 para guardar edición de los programas
            $scope.GuardarEdicionPrograma = function () {
                $.each($scope.Area, function (index, value) {
                    if (value.IdArea == $scope.Area.IdArea) {

                        $scope.Programa.IdArea = value.IdArea;

                    }

                });

                if ($scope.Programa.CodigoPrograma != "" || $scope.Programa.Nivel != "" || $scope.Programa.IdArea != 0 || $scope.Programa.NombrePrograma != "") {
                    ProgramaService.GuardarModificacionPrograma($scope.Programa, function (response) {
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

                            ProgramaService.ConsultarProgramas(function (response) {
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

            //Función para descargar reporte de los programas
            $scope.DescargarReporte = function () {


                $scope.AreasExport = [];

                $.each($scope.Area, function (index, value) {

                    $scope.AreasExport.push({
                        Codigo_Area: value.Codigo, Nombre: value.Nombre
                    });

                });


                alasql('SELECT * INTO XLSX("Códigos Area.xlsx",{headers:true}) FROM ?', [$scope.AreasExport]);

            };

            //Función 1 para filtrar la tabla
            $scope.Filter = function (e) {
                var Busqueda = $("#Buscar").val();
                var exp = new RegExp(Busqueda);
                if (Busqueda == "") {
                    if ($rootScope.globals.currentUser.tipousuario == 2) {
                        ProgramaService.ProgramaxCoordinacion($rootScope.globals.currentUser.idpersona, function (response) {
                            if (response.success == true) {
                                $scope.datalists = response.datos;
                                $scope.Datos = $scope.datalists;
                                $scope.ListaCompleta = response.datos;
                                $scope.numberOfPages = function () {
                                    return Math.ceil($scope.datalists.length / $scope.pageSize);
                                };
                            }

                        });
                    } else {
                        ProgramaService.ConsultarProgramas(function (response) {

                            if (response.success == true) {

                                $scope.datalists = response.datos;
                                $scope.ListaCompleta = response.datos;
                                $scope.Datos = $scope.datalists;
                                $scope.numberOfPages = function () {
                                    return Math.ceil($scope.datalists.length / $scope.pageSize);
                                };
                            }
                        });
                    }
                }
                var Programa = [];
                $scope.datalists = $scope.ListaCompleta;
                Programa = $scope.datalists.filter(function (item) {

                    if (exp.test(item.Parametro2.toLowerCase()) || exp.test(item.Parametro2.toUpperCase())) {

                        return item;
                    }
                    else if (exp.test(item.Parametro9.toLowerCase()) || exp.test(item.Parametro9.toUpperCase())) {

                        return item;
                    }
                    else if (exp.test(item.Parametro7.toLowerCase()) || exp.test(item.Parametro7.toUpperCase())) {

                        return item;
                    }
                    else if (exp.test(item.Parametro5.toLowerCase()) || exp.test(item.Parametro5.toUpperCase())) {

                        return item;
                    }
                    else if (exp.test(item.Parametro3.toLowerCase()) || exp.test(item.Parametro3.toUpperCase())) {

                        return item;
                    }
                    else if (exp.test(item.Parametro8.toLowerCase()) || exp.test(item.Parametro8.toUpperCase())) {

                        return item;
                    }

                });
                $scope.datalists = Programa;
                //Variable para setear la paginación 
                $scope.curPage = 0;


            };
        }]);