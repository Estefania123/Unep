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
    public class CentroController : ApiController
    {
        [HttpPost]
        public IHttpActionResult GuardarCentros(Centro oCentro)
        {
            try
            {
                CentroBl oCentroBl = new CentroBl();

                var Centro = oCentroBl.GuardarCentro(oCentro);
                if (Centro == true)
                {
                    return Ok(new { success = true });
                }
                else
                {
                    return Ok(new { success = false });
                }

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
                List<ParametrosDTO> ListaParametro = new List<ParametrosDTO>();



                CentroBl oCentroBll = new CentroBl();
                var Datos = oCentroBll.ConsultarCentros();


                foreach (var item in Datos)
                {
                    ParametrosDTO oParametro = new ParametrosDTO();

                    var NombreRegional = oCentroBll.consultarRegionalxId(item.IdRegional);

                    oParametro.Parametro1 = item.IdCentro.ToString();
                    oParametro.Parametro2 = item.NombreCentro;
                    oParametro.Parametro3 = NombreRegional.NombreRegional;
                    oParametro.Parametro4 = item.Direccion;
                    oParametro.Parametro5 = item.Codigo.ToString();
                    oParametro.Parametro6 = item.IdRegional.ToString();
                    ListaParametro.Add(oParametro);
                }



                return Ok(new { datos = ListaParametro, success = true });

                // return Ok(new { datos = Datos, success = true });

            }
            catch (Exception exc)
            {
                return Ok(new { success = false, exc = exc.Message });
            }
        }

        [HttpPost]
        public IHttpActionResult IdCentro()
        {
            try
            {
                CentroBl oCentroBl = new CentroBl();
                var Datos = oCentroBl.IdCentro();
                return Ok(new { datos = Datos, success = true });

            }
            catch (Exception exc)
            {
                return Ok(new { success = false, exc = exc.Message });
            }
        }

        [HttpPost]
        public IHttpActionResult ModificarCentros(ParametrosDTO oParametros)
        {
            try
            {
                CentroBl oCentroBl = new CentroBl();
                var Centro = oCentroBl.ConsultarCentroId(int.Parse(oParametros.Parametro1));

                return Ok(new { success = true, centro = Centro });
            }
            catch (Exception exc)
            {

                return Ok(new { success = false, exc = exc.Message });
            }
        }

        [HttpPost]
        public IHttpActionResult GuardarModificacion(Centro oCentro)
        {
            try
            {
                CentroBl oCentroBl = new CentroBl();
                oCentroBl.ActualizarCentro(oCentro);

                return Ok(new { success = true });
            }
            catch (Exception exc)
            {

                return Ok(new { success = false, exc = exc.Message });
            }
        }

        [HttpPost]
        public IHttpActionResult EliminarCentro(ParametrosDTO oParametros)
        {
            try
            {
                bool Respuesta = false;
                int contadorTrue = 0;
                int contadorFalse = 0;

                CentroBl oCentroBl = new CentroBl();
                foreach (var item in oParametros.Parametros)
                {
                    Respuesta = oCentroBl.EliminarCentro(int.Parse(item.Parametro1));
                    if (Respuesta)
                    {
                        contadorTrue++;
                    }
                    else
                    {
                        contadorFalse++;
                    }
                }
                return Ok(new { respuesta = Respuesta, contadorTrue = contadorTrue, contadorFalse = contadorFalse, success = true, });
            }
            catch (Exception exc)
            {

                return Ok(new { success = false, exc = exc.Message });
            }
        }

        [HttpPost]
        public IHttpActionResult ConsultarZonas()
        {
            try
            {
                CentroBl oCentroBl = new CentroBl();

                var Datos = oCentroBl.ConsultarZona();

                return Ok(new { datos = Datos, success = true });
            }
            catch (Exception exc)
            {
                return Ok(new { success = false, exc = exc.Message });
            }
        }

        [HttpPost]
        public IHttpActionResult ConsultarRegionales (ParametrosDTO Oparametros)
        {
            try
            {
                CentroBl oCentroBl = new CentroBl();
                var Datos = oCentroBl.consultarRegionales(int.Parse(Oparametros.Parametro1));

                return Ok(new { datos = Datos, success = true });
            }
            catch (Exception exc)
            {
                return Ok(new { success = false, exc = exc.Message });
            }
        }

        [HttpPost]
        public IHttpActionResult ConsultarZonaXRegionales (ParametrosDTO oParametros)
        {
            try
            {
                CentroBl oCentro = new CentroBl();

                var Datos = oCentro.consultarZonaXReg(int.Parse(oParametros.Parametro1));

                return Ok(new { datos = Datos, success = true });
            }
            catch (Exception exc)
            {

                return Ok(new { success = false, exc = exc.Message });
            }
        }

    }
}