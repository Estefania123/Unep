using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using LogicaNegocio.Logica;
using Datos.Modelo;
using Unep.parametros;

namespace Unep.Controllers
{
    public class CoordinacionController : ApiController
    {
        [HttpPost]
        public IHttpActionResult GuardarCoordinacion(Coordinacion oCoordinacion)
        {
            try
            {
                CoordinacionBl oCoordinacionBl = new CoordinacionBl();
                var coordinador = oCoordinacionBl.GuardarCoordinacion(oCoordinacion);
                return Ok(new { success = true, coordinador });
            }
            catch (Exception exc)
            {
                return Ok(new { success = false, exc = exc.Message });
            }
        }


        [HttpGet]
        public IHttpActionResult ConsultarCoordinacion()
        {

           

            try
            {
                CoordinacionBl oCoordinBl = new CoordinacionBl();
                var Datos = oCoordinBl.ConsultarCoordinacion();
                AreaBl AreaBl = new AreaBl();
                CentroBl CentroBl = new CentroBl();

                List<ParametrosDTO> ListaParametro = new List<ParametrosDTO>();


                foreach (var item in Datos)
                {
                    ParametrosDTO oParametro = new ParametrosDTO();
                    var NombreArea = AreaBl.ConsultarAreaId(item.IdArea);
                    var NombreCentro = CentroBl.ConsultarCentroId(item.IdCentro);

                    oParametro.Parametro1 = item.IdCoordinacion.ToString();
                    oParametro.Parametro3 = item.Cedula.ToString();
                    oParametro.Parametro4 = item.Nombre.ToString();
                    oParametro.Parametro5 = item.Apellido.ToString();
                    oParametro.Parametro6 = item.Correo.ToString();
                    oParametro.Parametro7 = item.Telefono.ToString();
                    oParametro.Parametro8 = item.IdArea.ToString();
                    oParametro.Parametro9 = item.IdCentro.ToString();
                    oParametro.Parametro10 = NombreArea.Nombre.ToString();
                    oParametro.Parametro11 = NombreCentro.NombreCentro.ToString();

                    ListaParametro.Add(oParametro);
                }
                return Ok(new { datos = ListaParametro, success = true });
            }
            catch (Exception exc)
            {
                return Ok(new { success = false, exc = exc.Message });
            }

            //try
            //{
            //    CoordinacionBl oCoordiBl = new CoordinacionBl();
            //    var Datoscoor = oCoordiBl.ConsultarCoordinacion();

            //    return Ok(new { datos = Datoscoor, success = true });
            //}
            //catch (Exception exc)
            //{
            //    return Ok(new { success = false, exc = exc.Message });
            //}

        }

        [HttpPost]
        public IHttpActionResult ModificarCoordinacion(ParametrosDTO oParametro)
        {
            try
            {
                CoordinacionBl oCoordinacionBl = new CoordinacionBl();
                var Coordinacion = oCoordinacionBl.ConsultarCoordinacionId(int.Parse(oParametro.Parametro1));

                return Ok(new { success = true, Coordinacion = Coordinacion });
            }
            catch (Exception exc)
            {
                return Ok(new { success = false, exc = exc.Message });
            }
        }

        [HttpPost]
        public IHttpActionResult GuardarModificacionCoordinacion(Coordinacion oCoordinacion)
        {
            try
            {
                CoordinacionBl oCoordinacionBl = new CoordinacionBl();
                oCoordinacionBl.ActualizarRegistro(oCoordinacion);
                return Ok(new { success = true });
            }
            catch (Exception exc)
            {
                return Ok(new { success = false, exc = exc.Message });
            }
        }

        [HttpPost]
        public IHttpActionResult EliminarCoordinacion(ParametrosDTO oParametrosDTO)
        {
            try
            {
                CoordinacionBl oCoordinacionBl = new CoordinacionBl();
                foreach (var item in oParametrosDTO.Parametros)
                {
                    oCoordinacionBl.EliminarCoordinacion(int.Parse(item.Parametro1));
                }
                return Ok(new { success = true });
            }
            catch (Exception exc)
            {
                return Ok(new { success = false, exc = exc.Message });
            }
        }
        [HttpGet]
        public IHttpActionResult ConsultarCentros()
        {
            try
            {
                CentroBl oCentroBl = new CentroBl();
                var Datos = oCentroBl.ConsultarCentros();
                return Ok(new { datos = Datos, success = true });
            }
            catch (Exception exc)
            {
                return Ok(new { success = false, exc = exc.Message });
            }
        }
    }
}