---
layout: post
title: "Binärgewitter Westcoast #6: Kleinstkontrolleur"
date: 2020-10-29 18:00
comments: true
categories: westcoast
sharing: true
published: true
audioformats:
  mp3: http://download.binaergewitter.de/2020-10-29.Binaergewitter.Westcoast.6.mp3
  ogg: http://download.binaergewitter.de/2020-10-29.Binaergewitter.Westcoast.6.ogg
  m4a: http://download.binaergewitter.de/2020-10-29.Binaergewitter.Westcoast.6.m4a
  opus: http://download.binaergewitter.de/2020-10-29.Binaergewitter.Westcoast.6.opus
---

# Wer sind wir denn?

[@pfleidi](https://github.com/pfleidi/)

[@rb2k](https://twitter.com/rb2k/) (Marc)

# Wie haben wir angefangen?

**pfleidi:**

- [Hue Lampen](https://www.philips-hue.com/en-us)
- TP-Link Steckdose
- [iOS Shortcuts](https://support.apple.com/guide/shortcuts/welcome/ios)
- Versuche mit Apple HomeKit (“Das Wohnzimmer Shutdown Problem”)
- Home Assistant
    - Heute: Sehr viel mehr Hardware, ESP32 mit Sensoren …
- [Awair](https://www.getawair.com/)
    - “Schicke Hardware und schreckliche Software”

**Marc:**

- Hue Lampen
- Smartthings
- [Tuya Convert](https://github.com/ct-Open-Source/tuya-convert)

# Was automatisieren wir?
## Protokolle
- Wifi
    - [Tuya-Convert](https://github.com/ct-Open-Source/tuya-convert)
    - [ESPHome device templates](https://esphome-configs.io/devices/)
    - [Tasmota Device Templates](https://templates.blakadder.com/)
    - [Sonoff Geräte](https://www.itead.cc/smart-home.html)
    - [Shelly Hardware](https://shelly.cloud/)
    - [TP-Link Kasa Smart Plugs](https://www.kasasmart.com/us/products/smart-plugs)
- Z-Wave
    - [Z-Wave auf Wikipedia](https://en.wikipedia.org/wiki/Z-Wave)
    - [HUSBZB-1 Combo USB stick](https://www.amazon.com/GoControl-CECOMINOD016164-HUSBZB-1-USB-Hub/dp/B01GJ826F8)
- ZigBee
    - Controller vs. Router vs. Leaf Node
    - [ZigBee vs. Wifi Overlap](https://support.metageek.com/hc/en-us/articles/203845040-ZigBee-and-WiFi-Coexistence)
    - [Zigbee2MQTT](https://www.zigbee2mqtt.io/)
    - [Conbee 2](https://phoscon.de/en/conbee2)
    - [HUSBZB-1 Combo USB stick](https://www.amazon.com/GoControl-CECOMINOD016164-HUSBZB-1-USB-Hub/dp/B01GJ826F8)
    - [Sonoff Zigbee Bridge](https://www.itead.cc/sonoff-zbbridge.html)
    - [ZHA Integration](https://www.home-assistant.io/integrations/zha/)
- BLE
    - [Xiaomi BLE Sensoren für $4/Stück](https://www.aliexpress.com/item/4001230582090.html)
    - [Website flashed sensor via BLE](https://github.com/atc1441/ATC_MiThermometer)
    - [Youtube Video](https://youtu.be/K-HG7qs9hK0)
- MQTT
    - [MQTT auf Wikipedia](https://en.wikipedia.org/wiki/MQTT?wprov=sfti1)
    - [Mosquitto MQTT broker](https://mosquitto.org/)
    - [Mosquitto hassio addon](https://github.com/home-assistant/hassio-addons/tree/master/mosquitto)
    - [433 mhz nach MQTT](https://github.com/mverleun/RTL433-to-mqtt)
- LoRa?
    - [LoRa auf Wikipedia](https://en.wikipedia.org/wiki/LoRa#LoRaWAN)
    - [LoRa/LoraWAN Video](https://youtu.be/hMOwbNUpDQA)
## Luftqualität

pfleidi

- Awair
- [CO2 Sensor](https://esphome.io/components/sensor/mhz19.html)
- [Temperatursensor](https://esphome.io/components/sensor/hdc1080.html)
- [VOC Sensor](https://esphome.io/components/sensor/sgp30.html)
- [Feinstaub Sensor](https://esphome.io/components/sensor/pmsx003.html)
- [IQAir integration](https://www.home-assistant.io/integrations/airvisual/)
- [World Air Quality Index Integration](https://www.home-assistant.io/integrations/waqi/)

Marc:

- [SDS011](https://esphome.io/components/sensor/sds011.html)
- CO2 ist kaputt weil Marc nicht löten kann (glaub ich)
- [PurpleAir](https://www2.purpleair.com/collections/air-quality-sensors)
- Temperatur/Luftfeuchtigkeit
    - Xioami BLE (Esphome, ESP32)
    - Xioami Zigbee
- Miflora

## Outputs


- Licht
- Heizung
    - [Amerikanische Heizungen](https://www.youtube.com/watch?v=lBVvnDfW2Xo)
    - [Wie funktionieren Klimaanlagen?](https://www.youtube.com/watch?v=2horH-IeurA)
- Steckdosen
    - Lüfter/Luftreiniger
    - Fernseher
    - Heizlüfter
    - “Alles was man direkt an und aus machen kann”
- Türschloss
    - Wyze Lock via ZHA
- Staubsauger

# Kamera Zeug


- YIHome Indoor / Outdoor + hack
  - Hacker werden hacken:
	  - [yi-hack-allwinner](https://github.com/roleoroleo/yi-hack-Allwinner)
		- [yi-hack-mstar](https://github.com/roleoroleo/yi-hack-MStar)
		- [yi-hack-v4](https://github.com/TheCrypt0/yi-hack-v4)
- [eufy Security 2K Indoor Cam](https://www.amazon.de/eufy-%C3%9Cberwachungskamera-Personenerkennung-Sprachassistent-Bewegungssensor/dp/B086LBWH4M/) (rtsp)
- [Reolink RLC-511W](https://reolink.com/us/product/rlc-511w/)
- [WyzeCams](https://wyze.com/wyze-cam.html)
- [HKCam](https://hochgatterer.me/hkcam/)
    
- Object Detection:
    - [MotionEye](https://github.com/ccrisan/motioneye) + [Doods](https://github.com/snowzach/doods/)
    - [Frigate](https://github.com/blakeblackshear/frigate)
    - [Marc's Modell](https://github.com/rb2k/sqwrlmodel)
    - [Coral Stick](https://coral.ai/products/accelerator/)
- Solargebimmel:
    - Zuerst: USB zeug + battery pack
    - Nun: Panel + Batterie + Controller

