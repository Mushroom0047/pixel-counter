// Función para convertir un objeto de color a formato hexadecimal
function rgbToHex(color) {
    var hex = color.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }

  // Función para obtener los colores de los píxeles de una imagen y contar su cantidad
  function obtenerColores() {
      // Mostrar el loader
      document.getElementById('loader').style.display = 'block';
    var imagen = document.getElementById('imagenInput').files[0];
    var lector = new FileReader();

    lector.onload = function(e) {
      var img = document.getElementById('imagenPreview');
      img.src = e.target.result;
      img.onload = function() {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        var colores = {};

        for (var y = 0; y < img.height; y++) {
          for (var x = 0; x < img.width; x++) {
            var pixel = ctx.getImageData(x, y, 1, 1).data;

            // Omitir el color transparente (canal alfa = 0)
            if (pixel[3] === 0) {
              continue;
            }

            var colorHex = "#" + rgbToHex(pixel[0]) + rgbToHex(pixel[1]) + rgbToHex(pixel[2]);

            if (colores[colorHex]) {
              colores[colorHex]++;
            } else {
              colores[colorHex] = 1;
            }
          }
        }

        mostrarColores(colores);
        // Ocultar el loader una vez que la función haya terminado
          document.getElementById('loader').style.display = 'none';
      };
    };

    lector.readAsDataURL(imagen);
  }

  // Función para mostrar los colores en una tabla HTML
  function mostrarColores(colores) {
    var tabla = document.getElementById('tablaColores');
    tabla.innerHTML = "";

    let totalPiezas = 0;

    var headerRow = tabla.insertRow(0);
    var header1 = headerRow.insertCell(0);
    var header2 = headerRow.insertCell(1);
    var header3 = headerRow.insertCell(2);
    var header4 = headerRow.insertCell(3);
    var header5 = headerRow.insertCell(4);
    header1.innerHTML = "Color";
    header2.innerHTML = "Código Hex";
    header3.innerHTML = "Cantidad de Piezas";
    header4.innerHTML = "Número pieza";
    header5.innerHTML = "Color proveedor";

    var rowId = 1;

    for (var colorHex in colores) {
      var cantidad = colores[colorHex];
      var row = tabla.insertRow(rowId);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);
      var cell5 = row.insertCell(4);
      cell1.style.backgroundColor = colorHex;
      cell1.innerHTML = "";
      cell2.innerHTML = colorHex;
      cell3.innerHTML = cantidad;
      
      // Modificar el input del número de proveedor
   var inputProveedor = document.createElement("input");
inputProveedor.type = "number";
inputProveedor.id = "proveedorInput" + rowId;
inputProveedor.className = "input-proveedor"; // Agregar clase
inputProveedor.min = 1; // Establecer el valor mínimo
inputProveedor.max = 98; // Establecer el valor máximo

// Asignar evento onChange al input de proveedor
inputProveedor.addEventListener('blur', function(event) {
// Obtener el valor ingresado en el input
var valorIngresado = event.target.value;

// Obtener la fila actual del input
var row = event.target.parentNode.parentNode;

// Obtener el índice de la fila en la tabla
var rowIndex = row.rowIndex;

// Verificar si el índice de fila es válido para acceder al array arrColores
if (rowIndex >= 1 && rowIndex <= arrColores.length) {
  // Obtener el valor correspondiente del array arrColores
  var valorColor;
    if(valorIngresado > 0 && valorIngresado <= arrColores.length-1){
        valorColor = arrColores[valorIngresado];
    }else{
        valorColor = arrColores[0];
    }
  // Mostrar el valor en la columna cell5
  var cell5 = row.cells[4]; // La columna cell5 es la quinta (índice 4)
  cell5.textContent = valorColor;
}
});

cell4.appendChild(inputProveedor);

    totalPiezas += cantidad;
    rowId++;
    }

    const filaFooter = document.createElement("tr");
    const colColor = document.createElement("td");
    const colHex = document.createElement("td");
    const colPiezas = document.createElement("td");

    colColor.textContent = "";
    colHex.textContent = "Total Piezas"
    colPiezas.textContent = totalPiezas;

    filaFooter.appendChild(colColor);
    filaFooter.appendChild(colHex);
    filaFooter.appendChild(colPiezas);

    tabla.appendChild(filaFooter);
  }
  
  /*BOTON COPIAR*/
  document.getElementById("copiarBtn").addEventListener("click", ()=> {
    // Obtener todas las filas de la tabla
  var filas = document.querySelectorAll("#tablaColores tr");
  console.log("filas",filas)
  // Crear una cadena con los datos a copiar
  var datosCopiar = "";

  // Iterar a través de las filas (empezando desde la segunda fila para omitir el encabezado)
  for (var i = 1; i < filas.length; i++) {
      var celdaCantidad = filas[i].querySelector("td:nth-child(3)");
      var celdaNombreColor = filas[i].querySelector("td:nth-child(5)");

      // Verificar si las celdas tienen contenido antes de acceder a su textContent
      if (celdaCantidad && celdaNombreColor) {
          datosCopiar += celdaNombreColor.textContent + "\t" + " = " +  celdaCantidad.textContent+ "\n";
      }
  }

  // Crear un elemento de textarea oculto para copiar el texto al portapapeles
  var textarea = document.createElement("textarea");
  textarea.value = datosCopiar;
  document.body.appendChild(textarea);

  // Seleccionar y copiar el texto
  textarea.select();
  document.execCommand("copy");

  // Eliminar el elemento de textarea
  document.body.removeChild(textarea);

  // Mostrar un mensaje de éxito
   document.getElementById("copiarBtn").textContent = "Copiado!";

  });
  
          
      

const arrColores = [
'No existe',      'Red ',               'Jujube Red ',
'Rose Red ',         'Dark Pink ',         'Pink ',
'Blue ',             'Sky Blue ',          'Light Blue ',
'Royal Blue ',       'Flesh ',             'Earthy Yellow ',
'Beige ',            'Khakis ',            'Apple Green ',
'Yellow ',           'Sand Yellow ',       'Saffron Yellow ',
'Orange ',           'Brown ',             'Dark Grey ',
'Light Grey ',       'Black Grey ',        'Brownish Red ',
'Purple ',           'Light Purple ',      'Mauve ',
'White ',            'Dark Brown ',        'Army Green ',
'Dark Skin ',        'Black ',             'Green ',
'Pale Green ',       'Peppermint Green ',  'Water Blue ',
'Light Green ',      'Orange Yellow ',     'Bean Paste Red ',
'Tomato Red ',       'Powder Blue ',       'Pink Purple ',
'Skin White ',       'Skin Red ',          'Light Skin ',
'Eggplant ',         'Dark Orange ',       'Peach Pink ',
'Apricot ',          'Dusky Pink ',        'Dusky Purple ',
'Grass Green ',      'Egg Yellow ',        'Grey Blue ',
'Plum Red ',         'Light Grass Green ', 'Light Rose Red ',
'Dark Powder Blue ', 'Shrimp Flesh ',      'Silvery ',
'Pale Brown ',       'Lake Blue ',         'Greyish White ',
'Light Brown ',      'Azure ',             'Pink Green ',
'Light Lake Blue ',  'Sea Blue ',          'Purplish Red ',
'Golden ',           'Emerald Green ',     'Coffee ',
'Greyish Purple ',   'Light Yellow ',      'Cyan ',
'Dark Grey Blue ',   'Dark Green ',        'Medium Grey ',
'Medium Purple ',    'Purple Blue ',       'Bean Green ',
'Blue Green ',       'Bright Blue ',       'Bright White ',
'Cool Grey ',        'Dark Coffee ',       'Desert Yellow ',
'Ice Blue ',         'Ink Blue ',          'Light Army Green ',
'Light Fresh ',      'Olive Green ',       'Pale Red ',
'Pearl Red ',        'Stone Green ',       'Vermilion ',
'Medium Orange ',    'Watermelon Red ',    'Dark Blue '
]


  // Asociar el evento de cambio del input de imagen a la función obtenerColores
  document.getElementById('imagenInput').addEventListener('change', obtenerColores);