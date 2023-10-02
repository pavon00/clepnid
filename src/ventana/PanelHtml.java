package ventana;

import org.eclipse.swt.SWT;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.layout.GridLayout;
import org.eclipse.swt.widgets.Button;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.Event;
import org.eclipse.swt.widgets.Label;
import org.eclipse.swt.widgets.Listener;
import org.eclipse.swt.widgets.Shell;
import org.eclipse.wb.swt.SWTResourceManager;

/**
 * Clase que extiende de {@link Composite} para mostrar los datos de un texto
 * por {@link Ventana}.
 * 
 * @author: Pavon
 * @version: 10/04/2020
 * @since 1.0
 */

public class PanelHtml extends PanelContenido {

	private Composite panImagen;
	private Composite panBoton;
	private Button btnCopiar, btnQR;
	private Composite panAtributos;
	private Label lblImagen;
	private Label lblNombre;
	public Display display;
	public Shell shell;

	/**
	 * Constructor que define el panel referente a un texto a mostrar por
	 * {@link Ventana}
	 * 
	 * @param parent  {@link Composite} panel padre para {@link PanelContenido}.
	 * @param ventana {@link Ventana} para mostrar por pantalla el componente.
	 * @param style   numero de referencia de la apariencia que va a tener el
	 *                componente.
	 * @param texto   {@link String} con el texto a mostrar por pantalla.
	 */

	public PanelHtml(Composite parent, int style) {
		super(parent, style);
		setBackground(SWTResourceManager.getColor(SWT.COLOR_WHITE));
		setLayout(new GridLayout(3, false));
		gd_panObjeto = new GridData(SWT.FILL, SWT.CENTER, true, false, 1, 1);
		gd_panObjeto.heightHint = 146;
		setLayoutData(gd_panObjeto);

		panImagen = new Composite(this, SWT.NONE);
		panImagen.setBackground(SWTResourceManager.getColor(SWT.COLOR_WHITE));
		panImagen.setLayout(new GridLayout(1, false));
		GridData gd_panImagen = new GridData(SWT.LEFT, SWT.FILL, false, true, 1, 1);
		gd_panImagen.heightHint = 182;
		gd_panImagen.widthHint = 133;
		panImagen.setLayoutData(gd_panImagen);

		lblImagen = new Label(panImagen, SWT.NONE);
		lblImagen.setBackground(SWTResourceManager.getColor(SWT.COLOR_WHITE));
		lblImagen.setLayoutData(new GridData(SWT.CENTER, SWT.CENTER, true, false, 1, 1));
		lblImagen.setImage(getCheckedImage(display, "./src/imagenes/html.gif"));

		panAtributos = new Composite(this, SWT.NONE);
		panAtributos.setBackground(SWTResourceManager.getColor(SWT.COLOR_WHITE));
		panAtributos.setLayout(new GridLayout(1, false));
		panAtributos.setLayoutData(new GridData(SWT.FILL, SWT.FILL, true, true, 1, 1));

		lblNombre = new Label(panAtributos, SWT.NONE);
		lblNombre.setBackground(SWTResourceManager.getColor(SWT.COLOR_WHITE));
		lblNombre.setLayoutData(new GridData(SWT.FILL, SWT.CENTER, true, true, 1, 1));
		lblNombre.setText(Ventana.idioma.getProperty("contiene_contenido_html"));

		panBoton = new Composite(this, SWT.NONE);
		panBoton.setBackground(SWTResourceManager.getColor(SWT.COLOR_WHITE));
		panBoton.setLayout(new GridLayout(1, false));
		panBoton.setLayoutData(new GridData(SWT.RIGHT, SWT.FILL, false, false, 1, 1));

		btnCopiar = new Button(panBoton, SWT.NONE);
		btnCopiar.setToolTipText(Ventana.idioma.getProperty("btnContextCopiar"));
		btnCopiar.setBackground(SWTResourceManager.getColor(SWT.COLOR_WHITE));
		btnCopiar.setLayoutData(new GridData(SWT.RIGHT, SWT.CENTER, false, true, 1, 1));
		btnCopiar.setText(Ventana.idioma.getProperty("copiar"));

		btnCopiar.addListener(SWT.Selection, new Listener() {
			public void handleEvent(Event e) {
				switch (e.type) {
				case SWT.Selection:
					Ventana.getInstance().teclas.eventos.copiarContenidoBtn();
					break;
				}
			}
		});

		btnQR = new Button(panBoton, SWT.NONE);
		btnQR.setToolTipText(Ventana.idioma.getProperty("btnContextMostrar_qr_html"));
		btnQR.setBackground(SWTResourceManager.getColor(SWT.COLOR_WHITE));
		btnQR.setLayoutData(new GridData(SWT.RIGHT, SWT.CENTER, false, true, 1, 1));
		btnQR.setText(Ventana.idioma.getProperty("mostrar_qr"));

		btnQR.addListener(SWT.Selection, new Listener() {
			public void handleEvent(Event e) {
				switch (e.type) {
				case SWT.Selection:
					Ventana ventana = Ventana.getInstance();
					ventana.crearVentanaQR(ventana.shlSwt, "HTML");
					break;
				}
			}
		});
	}

}
