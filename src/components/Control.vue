// Lógica para enviar dirección por Bluetooth BLE
const enviarComandoBT = async (letra) => {
  if (caracteristicaBT) {
    const encoder = new TextEncoder();
    await caracteristicaBT.writeValue(encoder.encode(letra));
    console.log("Enviado al ESP32: " + letra);
  }
};

// Ejemplo: Flecha Arriba -> enviarComandoBT('F');
// Ejemplo: Flecha Abajo -> enviarComandoBT('B');