import { ref } from 'vue'

export const btConnected = ref(false)

export const characteristic = ref(null)

export const deviceConnected = ref(null)

export const telemetry = ref({
  Dist: 0,
  Stop: 0,
  Vel: 0,
  Ping: 0
})

const SERVICE_UUID =
'12345678-1234-1234-1234-123456789abc'

const CHARACTERISTIC_UUID =
'abcd1234-5678-1234-5678-123456789abc'

// ======================================================
// CONECTAR BLE
// ======================================================

export const connectBluetooth = async () => {

  try {

    if (
      deviceConnected.value &&
      deviceConnected.value.gatt.connected
    ) {

      btConnected.value = true

      return true
    }

    const device =
      await navigator.bluetooth.requestDevice({

        filters: [
          { namePrefix: 'CARRO_' }
        ],

        optionalServices: [
          SERVICE_UUID
        ]
      })

    deviceConnected.value = device

    device.addEventListener(
      'gattserverdisconnected',
      () => {

        btConnected.value = false

        console.log("BLE DESCONECTADO")
      }
    )

    const server =
      await device.gatt.connect()

    const service =
      await server.getPrimaryService(
        SERVICE_UUID
      )

    characteristic.value =
      await service.getCharacteristic(
        CHARACTERISTIC_UUID
      )

    await characteristic.value.startNotifications()

    characteristic.value.addEventListener(
      'characteristicvaluechanged',
      handleNotifications
    )

    btConnected.value = true

    console.log("BLE CONECTADO")

    return true

  } catch (error) {

    console.error(error)

    btConnected.value = false

    return false
  }
}

// ======================================================
// RECIBIR DATOS
// ======================================================

const handleNotifications = (event) => {

  const raw =
    new TextDecoder()
      .decode(event.target.value)

  console.log("RX:", raw)

  if (raw.startsWith("DATA:")) {

    const p =
      raw.replace("DATA:", "").split(",")

    telemetry.value = {

      Dist: parseInt(p[0]) || 0,

      Stop: parseInt(p[1]) || 0,

      Vel: parseInt(p[2]) || 0,

      Ping: parseInt(p[3]) || 0
    }
  }
}

// ======================================================
// ENVIAR
// ======================================================

export const sendBLE = async (msg) => {

  try {

    if (
      !btConnected.value ||
      !characteristic.value
    ) {

      return
    }

    const encoder = new TextEncoder()

    await characteristic.value.writeValue(
      encoder.encode(msg + "\n")
    )

    console.log("TX:", msg)

  } catch (error) {

    console.error("ERROR TX:", error)

    btConnected.value = false
  }
}