using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Globalization;
using System.Text;
using System.Net.Mail;
using LogicaNegocio.Logica;
using Datos.Modelo;
using ProgramacionAmbientes.Controllers;
using LinqToExcel;
using System.Data.OleDb;
using System.Data;

namespace CORONA.ValidacionRef.Servicios.Controllers
{
    public class FileController : ApiController
    {
        [HttpPost]
        public IHttpActionResult UploadFileInstructor()
        {
            Model1 entity = new Model1();
            try
            {
                var httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count > 0)
                {
                    var fileSavePath = string.Empty;

                    var docfiles = new List<string>();

                    var URLArchivo = "";

                    foreach (string file in httpRequest.Files)
                    {
                        var postedFile = httpRequest.Files[file];
                        var filePath = "C:/UploadedFiles/";

                        var GUID = Guid.NewGuid().ToString();

                        if (!Directory.Exists(filePath))
                        {
                            Directory.CreateDirectory(filePath);
                        }

                        fileSavePath = Path.Combine(filePath, GUID + "." + postedFile.FileName.Split('.')[1]);

                        postedFile.SaveAs(fileSavePath);

                        docfiles.Add(filePath);

                        URLArchivo = "C:/UploadedFiles/" + GUID + "." + postedFile.FileName.Split('.')[1];


                        string e = Path.GetExtension(URLArchivo);
                        if (e != ".xlsx")
                        {
                            return Ok(new { success = false, message = "La extencion del archivo no es valida" });
                        }
                    }
                        
                    InstructorBl instructor = new InstructorBl();

                    var book = new ExcelQueryFactory(URLArchivo);
                    var hoja = book.GetWorksheetNames();
                    var resultado = (from i in book.Worksheet(hoja.FirstOrDefault())
                                     select i).ToList();

                    foreach (var values in resultado)
                    {
                        Instructor oInstructor = new Instructor();
                        var cedula = instructor.ConsultarInstructorCedula(values[2]);
                        if (cedula == null)
                        {
                            oInstructor.Nombre = values[0];
                            oInstructor.Apellido = values[1];
                            oInstructor.Cedula = values[2];
                            oInstructor.Email = values[3];
                            oInstructor.Estado = true;
                            oInstructor.Telefono = values[4];

                            var codigo = int.Parse(values[5]);
                            var area = (from i in entity.Area
                                        where i.Codigo == codigo
                                        select i).FirstOrDefault();
                            oInstructor.IdArea = area.IdArea;
                         

                            ProgramaBl oProgramaBl = new ProgramaBl();
                            AreaBl oAreaBl = new AreaBl();

                            var idArea = oAreaBl.ConsultarAreaCodigo(int.Parse(values[5]));
                            oInstructor.IdArea = idArea.IdArea;
                            instructor.GuardarInstructor(oInstructor);
                        }
                    }
                    return Ok(new { success = true, path = URLArchivo, });
                }
                else
                {
                    return Ok(new { success = false, message = "No File" });
                }

            }
            catch (Exception exc)
            {

                return Ok(new { success = false, message = exc.Message });
            }
        }

        public IHttpActionResult UploadFileArea()
        {
            try
            {
                //                List<LogResponseDTO> lstErrores = new List<LogResponseDTO>();
                var httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count > 0)
                {
                    var fileSavePath = string.Empty;

                    var docfiles = new List<string>();

                    var URLArchivo = "";

                    foreach (string file in httpRequest.Files)
                    {

                        var postedFile = httpRequest.Files[file];
                        //  var filePath = HttpContext.Current.Server.MapPath("C:/UploadedFiles/");
                        var filePath = "C:/UploadedFiles/";

                        var GUID = Guid.NewGuid().ToString();

                        if (!Directory.Exists(filePath))
                        {
                            Directory.CreateDirectory(filePath);
                        }

                        fileSavePath = Path.Combine(filePath, GUID + "." + postedFile.FileName.Split('.')[1]);



                        postedFile.SaveAs(fileSavePath);

                        docfiles.Add(filePath);

                        // URLArchivo = "~/UploadedFiles/" + GUID + "." + postedFile.FileName.Split('.')[1];
                        URLArchivo = "C:/UploadedFiles/" + GUID + "." + postedFile.FileName.Split('.')[1];


                        string e = Path.GetExtension(URLArchivo);
                        if (e != ".xlsx")
                        {
                            return Ok(new { success = false, message = "La extencion del archivo no es valida" });
                        }

                    }

                    string FilePath = URLArchivo.Split('/')[2];

                    // var reader = new StreamReader(File.OpenRead(HttpContext.Current.Server.MapPath("~/UploadedFiles/") + FilePath), Encoding.GetEncoding(1252));
                    //var reader = new StreamReader(File.OpenRead(("C:/UploadedFiles/") + FilePath), Encoding.GetEncoding(1252));


                    Area oArea = new Area();
                    AreaBl oAreaBl = new AreaBl();

                    var book = new ExcelQueryFactory(URLArchivo);

                    var hoja = book.GetWorksheetNames();
                    var resultado = (from i in book.Worksheet(hoja.FirstOrDefault())
                                     select i).ToList();

                    foreach (var values in resultado)
                    {
                        var codigo = oAreaBl.ConsultarAreaCodigo(int.Parse(values[0]));
                        if (codigo == null)
                        {
                            oArea.Codigo = int.Parse(values[0]);
                            oArea.Nombre = values[1];
                            oArea.Descripcion = values[2];
  
                            oAreaBl.GuardarArea(oArea);

                        }
                    }
                    return Ok(new { success = true, path = URLArchivo });
                }
                else
                {
                    return Ok(new { success = false, message = "No File" });
                }

            }
            catch (Exception exc)
            {

                return Ok(new { success = false, message = exc.Message });
            }
        }

        public IHttpActionResult UploadFilePrograma()
        {
            try
            {
                //                List<LogResponseDTO> lstErrores = new List<LogResponseDTO>();
                var httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count > 0)
                {
                    var fileSavePath = string.Empty;

                    var docfiles = new List<string>();

                    var URLArchivo = "";

                    foreach (string file in httpRequest.Files)
                    {

                        var postedFile = httpRequest.Files[file];
                        //var filePath = HttpContext.Current.Server.MapPath("~/UploadedFiles/");
                        var filePath = "C:/UploadedFiles/";

                        var GUID = Guid.NewGuid().ToString();

                        if (!Directory.Exists(filePath))
                        {
                            Directory.CreateDirectory(filePath);
                        }

                        fileSavePath = Path.Combine(filePath, GUID + "." + postedFile.FileName.Split('.')[1]);



                        postedFile.SaveAs(fileSavePath);

                        docfiles.Add(filePath);

                        // URLArchivo = "~/UploadedFiles/" + GUID + "." + postedFile.FileName.Split('.')[1];
                        URLArchivo = "C:/UploadedFiles/" + GUID + "." + postedFile.FileName.Split('.')[1];


                        string e = Path.GetExtension(URLArchivo);
                        if (e != ".xlsx")
                        {
                            return Ok(new { success = false, message = "La extencion del archivo no es valida" });
                        }

                    }

                    string FilePath = URLArchivo.Split('/')[2];

                    //var reader = new StreamReader(File.OpenRead(HttpContext.Current.Server.MapPath("~/UploadedFiles/") + FilePath), Encoding.GetEncoding(1252));
                    //var reader = new StreamReader(File.OpenRead(("C:/UploadedFiles/") + FilePath), Encoding.GetEncoding(1252));

                    Programa oPrograma = new Programa();
                    ProgramaBl oProgramaBl = new ProgramaBl();
                    List<string> ProgramaNoRegistro = new List<string>();

                    Area oArea = new Area();
                    AreaBl oAreaBl = new AreaBl();

                    var book = new ExcelQueryFactory(URLArchivo);

                    var hoja = book.GetWorksheetNames();
                    var resultado = (from i in book.Worksheet(hoja.FirstOrDefault())
                                     select i).ToList();

                    var contador = 0; 


                    foreach (var values in resultado)
                    {
                        if (values[0] == "")
                        {
                            break;
                        }
                        var codigo = oProgramaBl.ConsultarProgramaCodigo(int.Parse(values[0].ToString()));
                        if (codigo != null)
                        {
                            ProgramaNoRegistro.Add(values[1]);
                            continue;
                        }
                        if (codigo == null)
                        {
                            oPrograma.CodigoPrograma = int.Parse(values[0].ToString());
                            oPrograma.NombrePrograma = values[1];
                            oPrograma.Nivel = values[2];
                     

                            oPrograma.IdArea = oAreaBl.ConsultarAreaCodigo(int.Parse(values[3])).IdArea;

                            oProgramaBl.GuardarPrograma(oPrograma);
                            contador++;

                        }


                    }

                    var no = ProgramaNoRegistro;
                    return Ok(new { success = true, path = URLArchivo });


                }
                else
                {
                    return Ok(new { success = false, message = "No File" });
                }

            }
            catch (Exception exc)
            {

                return Ok(new { success = false, message = exc.Message });
            }
        }

        public IHttpActionResult UploadFileFicha()
        {
            try
            {
                //                List<LogResponseDTO> lstErrores = new List<LogResponseDTO>();
                var httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count > 0)
                {
                    var fileSavePath = string.Empty;

                    var docfiles = new List<string>();

                    var URLArchivo = "";

                    foreach (string file in httpRequest.Files)
                    {

                        var postedFile = httpRequest.Files[file];
                        //var filePath = HttpContext.Current.Server.MapPath("~/UploadedFiles/");
                        var filePath = "C:/UploadedFiles/";

                        var GUID = Guid.NewGuid().ToString();

                        if (!Directory.Exists(filePath))
                        {
                            Directory.CreateDirectory(filePath);
                        }

                        fileSavePath = Path.Combine(filePath, GUID + "." + postedFile.FileName.Split('.')[1]);

                        postedFile.SaveAs(fileSavePath);

                        docfiles.Add(filePath);

                        //URLArchivo = "~/UploadedFiles/" + GUID + "." + postedFile.FileName.Split('.')[1];
                        URLArchivo = "C:/UploadedFiles/" + GUID + "." + postedFile.FileName.Split('.')[1];

                        string e = Path.GetExtension(URLArchivo);
                        if (e != ".xlsx")
                        {
                            return Ok(new { success = false, message = "La extencion del archivo no es valida" });
                        }

                    }

                    string FilePath = URLArchivo.Split('/')[2];

                    //var reader = new StreamReader(File.OpenRead(HttpContext.Current.Server.MapPath("~/UploadedFiles/") + FilePath), Encoding.GetEncoding(1252));
                    //var reader = new StreamReader(File.OpenRead(("C:/UploadedFiles/") + FilePath), Encoding.GetEncoding(1252));

                    Ficha oFicha = new Ficha();
                    FichaBl oFichaBl = new FichaBl();
                    List<string> idProgramasNoRegistro = new List<string>();

                    ProgramaBl oProgramaBl = new ProgramaBl();

                    var book = new ExcelQueryFactory(URLArchivo);
                    var hoja = book.GetWorksheetNames();
                    var resultado = (from i in book.Worksheet(hoja.FirstOrDefault())
                                     select i).ToList();

                    foreach (var values in resultado)
                    {
                        if (values[0] == "")
                        {
                            break;
                        }
                        var Programa = oProgramaBl.ConsultarProgramaCodigo(int.Parse(values[0]));

                        if (Programa == null)
                        {
                           
                            idProgramasNoRegistro.Add(values[0]);
                            continue;
                        }
                        oFicha.IdPrograma = oProgramaBl.ConsultarProgramaCodigo(int.Parse(values[0])).IdPrograma;

                        oFicha.NumAprendices = int.Parse(values[2]);
                        oFicha.TipoFormacion = values[3].ToString();
                        oFicha.Jornada = values[6].ToString();

                        if (DateTime.Parse(values[4]) <= DateTime.Parse(values[5]))
                        {
                            oFicha.FechaInicio = DateTime.Parse(values[4]);
                            oFicha.FechaFin = DateTime.Parse(values[5]);
                        }

                        oFicha.Estado = "EN FORMACION";
                        oFichaBl.GuardarFicha(oFicha);
                       
                    }
                    var no = idProgramasNoRegistro;

                    return Ok(new { success = true, path = URLArchivo });


                }
                else
                {
                    return Ok(new { success = false, message = "No File" });
                }

            }
            catch (Exception exc)
            {

                return Ok(new { success = false, message = exc.Message });
            }
        }

    }
}
