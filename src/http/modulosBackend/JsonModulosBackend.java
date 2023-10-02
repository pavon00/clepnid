package http.modulosBackend;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Map;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import http.HttpBackend;
import http.HttpBackendUsuarios;
import spark.Request;
import spark.Response;
import spark.Spark;
import ventanaGestionarModulo.SistemaModulos;

//lee el fichero clepnid.json de los modulos y los añade en el arraylist config.
public class JsonModulosBackend {
	ArrayList<EjecutarComando> listaEjecuciones;
	private String titulo;

	public JsonModulosBackend() {
		listaEjecuciones = new ArrayList<EjecutarComando>();
	}

	public void cerrar() {
		for (EjecutarComando ejecutarComando : listaEjecuciones) {
			ejecutarComando.start();
		}
	}

	@SuppressWarnings("unchecked")
	public void InstanciarWeb(String ruta) {

		String rutaJson = ruta.replace("\\", "/");
		JSONParser jsonParser = new JSONParser();

		try (FileReader reader = new FileReader(rutaJson)) {
			// Read JSON file
			Object obj = jsonParser.parse(reader);

			JSONArray webList = (JSONArray) obj;
			System.out.println(webList);

			webList.forEach(web -> parseControlWebObject((JSONObject) web));

		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (ParseException e) {
			e.printStackTrace();
		}
	}

	private void parseControlWebObject(JSONObject employee) {
		// Obtener web de la lista de webs
		JSONObject webObject = (JSONObject) employee.get("Web");
		// introducir titulo
		@SuppressWarnings("unused")
		String titulo = (String) webObject.get("Title");		
		System.out.println("TITULO: " + titulo);
		this.titulo = titulo;

        //InicializarEnOpcionesVentana
        SistemaModulos.getInstance().inicializarModulo(titulo);

		String comando = (String) webObject.get("ComandOpen");
		String comandoCerrar = (String) webObject.get("ComandClose");
		if (comando != null) {
			new EjecutarComando(comando).start();
		}
		if (comandoCerrar != null) {
			listaEjecuciones.add(new EjecutarComando(comandoCerrar));
		}

		JSONArray listaRutas = (JSONArray) webObject.get("ListaRutas");
		if (listaRutas != null) {
			for (int i = 0; i < listaRutas.size(); i++) {
				JSONObject obj = (JSONObject) listaRutas.get(i);
				String rutaEjecutable = (String) obj.get("RutaEjecutable");
				String rutaClepnid = (String) obj.get("RutaClepnid");
				String tipo = (String) obj.get("Tipo");
				redireccionarRutaBackend(rutaEjecutable, rutaClepnid, tipo);
			}
		}
	}

	private void redireccionarRutaBackend(String rutaEjecutable, String rutaClepnid, String tipo) {
		if (tipo.equals("get")) {
			getRuta(rutaEjecutable, rutaClepnid);
		}else {
			postRuta(rutaEjecutable, rutaClepnid);
		}
	}

	private void getRuta(String rutaEjecutable, String rutaClepnid) {
		Spark.get(rutaClepnid, (request, response) -> {
			int n = HttpBackendUsuarios.tienePermiso(request, response, rutaClepnid);
			if (n == 0 && SistemaModulos.getInstance().isValido(this.titulo)) {
				return JsonModulosBackend.getDataFromUrl(request, response, "http://" + rutaEjecutable);
			} else {
				if (n == 1) {
					return HttpBackend.renderIndex(request, response, "./src/html/403/index.html",
							"/403/index.html");
				} else {
					try {
						response.raw().sendRedirect("/login-layout");
					} catch (IOException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					return null;
				}
			}
		});
	}
	private static void postRuta(String rutaEjecutable, String rutaClepnid) {
		Spark.post(rutaClepnid, (request, response) -> {
			int n = HttpBackendUsuarios.tienePermiso(request, response, rutaClepnid);
			if (n == 0) {
				return JsonModulosBackend.postDataFromUrl(request, response, "http://" + rutaEjecutable);
			} else {
				if (n == 1) {
					return HttpBackend.renderIndex(request, response, "./src/html/403/index.html",
							"/403/index.html");
				} else {
					try {
						response.raw().sendRedirect("/login-layout");
					} catch (IOException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					return null;
				}
			}
		});
	}

	private static Object postDataFromUrl(Request request, Response response, String ruta) throws IOException {

		URL obj = new URL(ruta);
		HttpURLConnection con = (HttpURLConnection) obj.openConnection();
		con.setRequestMethod("POST");

		Map<String, String> paramsMap = request.params();
		String params = "";
		int n = 0;
		for (String key : paramsMap.keySet()) {
			if (n==0) {
				params+=key+"="+paramsMap.get(key);
				n=1;
			}else {
				params+="&"+key+"="+paramsMap.get(key);
			}
			
		}
		if (params.equals("")) {
			con.setDoOutput(true);
			OutputStream os = con.getOutputStream();
			os.write(params.getBytes());
			os.flush();
			os.close();
		}
		
		return getDataFromUrl(request, response, ruta);
	}

	public static boolean getDataFromUrl(Request request, Response response, String ruta) {
		InputStream is = null;
		try {
			URL url = new URL(ruta);
			is = url.openStream();
			int read = 0;
			byte[] bytes = new byte[1024];
			OutputStream os = response.raw().getOutputStream();
			while ((read = is.read(bytes)) != -1) {
				os.write(bytes, 0, read);
			}
			os.flush();
			os.close();
		} catch (Exception e) {
			return false;
		}
		if (is != null) {
			try {
				is.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return true;
	}

	public String getTitulo() {
		return titulo;
	}

	public void setTitulo(String titulo) {
		this.titulo = titulo;
	}

}
