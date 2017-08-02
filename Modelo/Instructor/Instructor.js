ProgramacionApp.controller('InstructorController',
    ['$scope', '$rootScope', '$location', 'InstructorService', '$routeParams', '$sce',
        function ($scope, $rootScope, $location, InstructorService, $routeParams, $sce) {

            var nav = $("#navbar").hasClass("gn-menu-wrapper gn-open-all");
            if (nav == true) {
                $(".Principal").css("width", "80%");

            } else {
                $(".Principal").css("width", "95%");
            }

            $("#atras").hide();
            $("#habilitar").hide();

            //Funciones para la carga del archivo de excel
            $scope.SubirArchivo = function () {
                InstructorService.alerta();
            }

            $scope.Estado = [
                   { Id: 1, Nombre: "Activo" }, { Id: 0, Nombre: "Inactivo" }
            ];

            //Función para abrir una modal
            $scope.AbrirModal = function () {
                $("#ModalInstructor").modal("show");
                $scope.VaciarCampos();
            };

            //Declaración del objeto instructor
            $scope.Instructor = {
                IdInstructor: "",
                Nombre: "",
                Apellido: "",
                Cedula: "",
                Email: "",
                Estado: "",
                Telefono: "",
                IdArea: ""
            };

            //Función para vaciar los campos de las modales
            $scope.VaciarCampos = function () {

                $scope.Instructor.Nombre = "";
                $scope.Instructor.Apellido = "";
                $scope.Instructor.Cedula = "";
                $scope.Instructor.Email = "";
                $scope.Instructor.Telefono = "";
            }

            //Funcion para subir listado de instructores 

            $scope.UploadFileWeb = function () {
                $("#fileUploadWeb").trigger('click');
            };
            $("#fileUploadWeb").change(function () {
                dataweb = new FormData();
                var files = $("#fileUploadWeb").get(0).files;
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
                    return false;
                }
                // Add the uploaded image content to the form data collection
                if (files.length > 0) {
                    readURL(this, "logoweb");
                    dataweb.append("UploadedImage", files[0]);
                    if (dataweb != null) {
                        InstructorService.SubirArchivo(dataweb, function (response) {
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
                                InstructorService.ConsultarInstructores(function (response) {
                                    if (response.success == true) {
                                        $scope.datalists = response.datos;
                                        $scope.ListaCompleta = response.datos;
                                        $scope.numberOfPages = function () {
                                            return Math.ceil($scope.datalists.length / $scope.pageSize);
                                        };
                                    }
                                });
                                $("#fileUploadWeb").replaceWith($("#fileUploadWeb").val('').clone(true));
                                return;
                            }
                        });
                    }
                }
            });

            function readURL(input, control) {
                if (input.files && input.files[0]) {
                    var reader = new FileReader();

                    reader.onload = function (e) {
                        $('#' + control + '').attr('src', e.target.result);
                    }

                    reader.readAsDataURL(input.files[0]);
                }
            };




            //Función para Consultar las areas 
            InstructorService.ConsultarAreasss(function (response) {
                if (response.success == true) {
                    $scope.Area = response.datos;
                }
            });

            //Función para Consultar los instructores 
            InstructorService.ConsultarInstructores(function (response) {
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
                  
            //Función para Guardar los instructores 
            $scope.Guardar = function () {
                $.each($scope.Estado, function (index, value) {
                    if (value.Id == $scope.Estado.Id) {
                        $scope.Instructor.Estado = value.Id
                    }
                });
                $.each($scope.Area, function (index, value) {
                    if (value.IdArea == $scope.Area.IdArea) {
                        $scope.Instructor.IdArea = value.IdArea;
                    }
                });

                if ($scope.Instructor.Nombre == "" || $scope.Instructor.IdArea == "" || $scope.Instructor.Apellido == "" || $scope.Instructor.Cedula == null || $scope.Instructor.Email == "" || $scope.Instructor.Estado == null) {
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
                    InstructorService.GuardarInstructor($scope.Instructor, function (response) {
                        if (response.success == true) {
                            $scope.VaciarCampos();

                            InstructorService.ConsultarInstructores(function (response) {

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
                            $("#ModalInstructor").modal("hide");    
                    })
                }
            }

            //Función para filtrar 
            $scope.Filter = function (e) {



                var Busqueda = $("#Buscar").val();
                var exp = new RegExp(Busqueda);
                if (Busqueda == "") {
                    InstructorService.ConsultarInstructores(function (response) {
                        if (response.success == true) {
                            $scope.datalists = response.datos;
                            $scope.ListaCompleta = response.datos;
                        }
                    });
                }
                var Instructor = [];
                $scope.datalists = $scope.ListaCompleta;
                Instructor = $scope.datalists.filter(function (item) {



                    if (exp.test(item.Nombre.toLowerCase()) || exp.test(item.Nombre.toUpperCase())) {

                        return item;
                    }

                    else if (exp.test(item.Apellido.toLowerCase()) || exp.test(item.Apellido.toUpperCase())) {
                        return item;
                    }

                    else if (exp.test(item.Telefono.toLowerCase()) || exp.test(item.Telefono.toUpperCase())) {
                        return item;
                    }
                    else if (exp.test(item.Email.toLowerCase()) || exp.test(item.Email.toUpperCase())) {
                        return item;
                    }

                });
                $scope.datalists = Instructor;
                //Variable para setear la paginación 
                $scope.curPage = 0;
            };

            //Función para seleccionar todos los instructores de la tabla 
            $scope.SeleccionarTodos = function () {
                $.each($scope.Datos, function (index, value) {
                    value.Seleccionado = $scope.SeleccionTodos;
                });
            };

  
            //Cambiar estado de los instructores
            $scope.CambiarEstadoSeleccionados = function () {
                var UsariosBorrar = $scope.datalists.filter(function (item) {
                    return item.Seleccionado === true;
                });

                if (UsariosBorrar.length == 0) {

                    bootbox.dialog({
                        title: "Inhabilitar",
                        message: "Seleccione por lo menos un instructor ",
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

            //Inhabilitar los instructores
            $scope.inhabilitar = function () {
                var InstructorBorrar = $scope.datalists.filter(function (item) {
                    return item.Seleccionado === true;
                });
                InstructorService.CambiarEstado(InstructorBorrar, function (response) {

                    if (response.success == true) {

                        InstructorService.ConsultarInstructores(function (response) {
                            if (response.success == true) {
                                bootbox.dialog({
                                    title: "Información",
                                    message: "El instructor se inhabilito",
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
            }

            //Función para Consultar los instructores Inhabilitados
            $scope.ConsultarInhabilitados = function () {
                InstructorService.ConsultarInhabilitados(function (response) {

                    if (response.success ==  true) {
                        $scope.datalists = response.datos;
                        $scope.ListaCompleta = response.datos;
                        $scope.numberOfPages = function () {
                            return Math.ceil($scope.datalists.length / $scope.pageSize);
                        };
                    } 
                });


                $("#atras").show();
                $("#habilitar").show();
                $("#eliminar").hide();
                $("#modificar").hide();
                $("#descargar").hide();
                $("#excel").hide();
                $("#inhabilitados").hide();
            };


            //Función para Consultar los instructores Habilitados
            $scope.ConsultarHabilitados = function () {
                InstructorService.ConsultarInstructores(function (response) {
                    if (response.success == true) {
                        $scope.curPage = 0;
                        $scope.pageSize = 8;
                        $scope.datalists = response.datos;

                        $scope.numberOfPages = function () {
                            return Math.ceil($scope.datalists.length / $scope.pageSize);
                        };

                        $scope.Datos = $scope.datalists;
                    }
                }
              )

                $("#atras").hide();
                $("#habilitar").hide();
                $("#eliminar").show();
                $("#modificar").show();
                $("#descargar").show();
                $("#excel").show();
                $("#inhabilitados").show();

            };
  

            //Función para Habilitar los instructores Inhabilitados
            $scope.HabilitarInstructor = function () {
                var InstructorHabilitar = $scope.datalists.filter(function (item) {
                    return item.Seleccionado === true;
                });

                if (InstructorHabilitar.length == 0) {
                    bootbox.dialog({
                        title: "Inhabilitar",
                        message: "Debe por lo menos seleccionar un instructor",
                        buttons: {
                            success: {
                                label: "Cerrar",
                                className: "btn-primary",
                            }
                        }
                    });
                } else {
                    InstructorService.HabilitarInstructor(InstructorHabilitar, function (response) {
                        if (response.success == true) {
                            InstructorService.ConsultarInstructores(function (response) {
                                if (response.success == true) {

                                    $scope.curPage = 0;
                                    $scope.pageSize = 8;
                                    $scope.datalists = response.datos;
                                    $scope.ListaCompleta = response.datos;
                                    $scope.numberOfPages = function () {
                                        return Math.ceil($scope.datalists.length / $scope.pageSize);
                                    };

                                    $scope.Datos = $scope.datalists;
                                }
                            });
                        }
                        $("#atras").hide();
                        $("#habilitar").hide();
                        $("#eliminar").show();
                        $("#modificar").show();
                        $("#descargar").show();
                        $("#excel").show();
                        $("#inhabilitados").show()
                    });
                }

            };


            //Funciona para modificar los datos del instructor
            $scope.Modificar = function () {

                var InstructorModificar = $scope.datalists.filter(function (item) {
                    return item.Seleccionado === true;

                });

                if (InstructorModificar.length == 1) {

                    InstructorService.ModificarInstructor(InstructorModificar, function (response) {

                        if (response.success == true) {

                            $scope.Instructor.IdInstructor = response.Instructor.IdInstructor;
                            $scope.Instructor.Nombre = response.Instructor.Nombre;
                            $scope.Instructor.Apellido = response.Instructor.Apellido;
                            $scope.Instructor.Cedula = parseInt(response.Instructor.Cedula);
                            $scope.Instructor.Email = response.Instructor.Email;
                            $scope.Instructor.Telefono = parseInt(response.Instructor.Telefono);

                            $scope.Instructor.IdArea = response.Instructor.IdArea;
                            $("#AreaLista > option[value='" + response.Instructor.IdArea + "']").attr('selected', "selected");
                 
                            $("#ModalEditar").modal("show");
                        }

                    });

                } else {
                    bootbox.dialog({
                        title: "Editar",
                        message: "Debe seleccionar un instructor",
                        buttons: {
                            success: {
                                label: "Cerrar",
                                className: "btn-primary",
                            }
                        }
                    });
                }

            };
     

            //Funciona para guardar la modificacion del instructor
            $scope.GuardarEdicionInstructor = function () {

                $.each($scope.Estado, function (index, value) {
                    if (value.Id == $scope.Estado.Id) {
                        $scope.Instructor.Estado = value.Id
                    }
                });
                $.each($scope.Area, function (index, value) {
                    if (value.IdArea == $scope.Area.IdArea) {
                        $scope.Instructor.IdArea = value.IdArea;
                    }
                });

                if ($scope.Instructor.Nombre == "" || $scope.Instructor.IdArea == "" || $scope.Instructor.Apellido == "" || $scope.Instructor.Cedula == null || $scope.Instructor.Email == "" || $scope.Instructor.Estado == null) {
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
                    InstructorService.GuardarModificacionInstructor($scope.Instructor, function (response) {
                        if (response.success == true) {
                            $scope.VaciarCampos();

                            InstructorService.ConsultarInstructores(function (response) {

                                if (response.success == true) {
                                    $scope.datalists = response.datos;
                                    $scope.ListaCompleta = response.datos;
                                }
                            });
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
                        }
                        $scope.VaciarCampos();
                        $("#ModalEditar").modal("hide");
                    })
                }


            };



        }]);