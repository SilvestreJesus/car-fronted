import { ref } from 'vue';

const btConnected = ref(false);
const characteristic = ref(null);
const telemetria = ref({ Dist: 0, Stop: 0, Vel: 0, Ping: 0 });

export function useBluetooth() {
  const conectarBT = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: 'CARRO_XOLO_BT' }],
        optionalServices: ['12345678-1234-1234-1234-123456789abc']
      });

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('12345678-1234-1234-1234-123456789abc');
      characteristic.value = await service.getCharacteristic('abcd1234-5678-1234-5678-123456789abc');

      await characteristic.value.startNotifications();
      characteristic.value.addEventListener('characteristicvaluechanged', (event) => {
        const decoded = new TextDecoder().decode(event.target.value);
        if (decoded.startsWith("PARAMS:")) {
          const p = decoded.replace("PARAMS:", "").split(",");
          telemetria.value = { Dist: p[0], Stop: p[1], Vel: p[2], Ping: p[3] };
        }
      });

      btConnected.value = true;
    } catch (error) {
      console.error("Error BT:", error);
      btConnected.value = false;
    }
  };

  const enviarComando = async (msg) => {
    if (characteristic.value) {
      const encoder = new TextEncoder();
      await characteristic.value.writeValue(encoder.encode(msg + "\n"));
    }
  };

  return { btConnected, conectarBT, enviarComando, telemetria, characteristic };
}