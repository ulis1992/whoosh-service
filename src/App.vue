<template>

<div class="container">

<h1>Осмотр самоката</h1>

<div id="reader"></div>

<input
v-model="qr"
type="text"
placeholder="Ожидание QR..."

/>

<div class="group">

<h3>Рама</h3>

<div class="buttons">

<button
:class="{active:frame==='Целая'}"
@click="frame='Целая'"
>
🟢 Целая
</button>

<button
:class="{active:frame==='Сломана'}"
@click="frame='Сломана'"
>
🔴 Сломана
</button>

</div>

</div>

<div class="group">

<h3>Стойка</h3>

<div class="buttons">

<button
:class="{active:stem==='Целая'}"
@click="stem='Целая'"
>
🟢 Целая
</button>

<button
:class="{active:stem==='Сломана'}"
@click="stem='Сломана'"
>
🔴 Сломана
</button>

</div>

</div>

<div class="group">

<h3>IOT</h3>

<div class="buttons">

<button
:class="{active:iot==='Есть'}"
@click="iot='Есть'"
>
🟢 Есть
</button>

<button
:class="{active:iot==='Нет'}"
@click="iot='Нет'"
>
🔴 Нет
</button>

</div>

</div>
<div class="group">

<h3>Крыло</h3>

<div class="buttons">

<button
:class="{active:fender==='Старое'}"
@click="fender='Старое'"
>
🟡 Старое
</button>

<button
:class="{active:fender==='Новое'}"
@click="fender='Новое'"
>
🟢 Новое
</button>

</div>

</div>

<div class="group">

<h3>Статус</h3>

<div class="buttons">

<button
:class="{active:status==='No Parts'}"
@click="status='No Parts'"
>
No Parts
</button>

<button
:class="{active:status==='Diagnostic'}"
@click="status='Diagnostic'"
>
Diagnostic
</button>

</div>

</div>

<textarea
v-model="comment"
placeholder="Комментарий"
></textarea>

<button
class="save"
@click="saveInspection"
:disabled="!qr"
>
💾 Сохранить
</button>

</div>

</template>
<script setup>

import { ref, onMounted } from "vue";
import { BrowserMultiFormatReader } from "@zxing/browser";

const qr = ref("");

const frame = ref("");
const stem = ref("");
const iot = ref("");
const fender = ref("");
const status = ref("");
const comment = ref("");

let codeReader = null;
let locked = false;

// Сюда позже вставим URL Google Apps Script
const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxUVrozKIIvDSoyBNnfrVLYDQPmtcuNdC-ToHVWjO37emSF8RIQY7QveJpKG_DBnsBh/exec";
onMounted(async () => {

  codeReader = new BrowserMultiFormatReader();

  try {

    const devices =
      await BrowserMultiFormatReader.listVideoInputDevices();

    const camera =
      devices.find(d =>
        d.label.toLowerCase().includes("back") ||
        d.label.toLowerCase().includes("rear")
      ) || devices[0];

    codeReader.decodeFromVideoDevice(

      camera.deviceId,

      "reader",

      (result) => {

        if (!result) return;

        if (locked) return;

        locked = true;

        let text = result.getText();

        try {

          const url = new URL(text);

          const s = url.searchParams.get("s");

          if (s) {
            text = s;
          }

        } catch (e) {}

        qr.value = text;

        if (navigator.vibrate) {
          navigator.vibrate(100);
        }

      }

    );

  } catch (err) {

    console.error(err);

    alert("Не удалось открыть камеру");

  }

});
async function saveInspection() {

  if (!qr.value) {

    alert("Сначала отсканируйте QR");

    return;

  }

  const data = {

    qr: qr.value,
    frame: frame.value,
    stem: stem.value,
    iot: iot.value,
    fender: fender.value,
    status: status.value,
    comment: comment.value

  };

  try {

    if (WEBAPP_URL !== "") {

   await fetch(WEBAPP_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(data)
});

    }

    if (navigator.vibrate) {

      navigator.vibrate([100,50,100]);

    }

    qr.value = "";

    frame.value = "";
    stem.value = "";
    iot.value = "";
    fender.value = "";
    status.value = "";
    comment.value = "";

    locked = false;

  } catch (e) {

    console.error(e);

    alert("Ошибка сохранения");

    locked = false;

  }

}
</script>

<style scoped>

.container{

    max-width:520px;
    margin:auto;
    padding:20px;

}

h1{

    text-align:center;
    margin-bottom:20px;

}

#reader{

    width:100%;
    min-height:260px;
    background:#000;
    border-radius:12px;
    overflow:hidden;
    margin-bottom:20px;

}

input,
textarea{

    width:100%;
    padding:15px;
    font-size:18px;
    border:none;
    border-radius:10px;
    margin-bottom:20px;

}

textarea{

    resize:none;
    height:90px;

}

.group{

    margin-bottom:20px;

}

.group h3{

    margin-bottom:8px;

}

.buttons{

    display:flex;
    gap:10px;

}

.buttons button{

    flex:1;
    padding:14px;
    border:none;
    border-radius:10px;
    font-size:17px;
    cursor:pointer;
    background:#555;
    color:white;
    transition:.2s;

}

.buttons button.active{

    background:#00C853;

}

.save{

    width:100%;
    padding:18px;
    font-size:22px;
    border:none;
    border-radius:10px;
    background:#00C853;
    color:white;
    cursor:pointer;

}
.save:hover{

    opacity:.95;

}

.save:active{

    transform:scale(.98);

}

@media (max-width:600px){

    .container{

        padding:12px;

    }

    h1{

        font-size:28px;

    }

    input,
    textarea{

        font-size:16px;

    }

    .buttons{

        flex-direction:column;

    }

    .buttons button{

        width:100%;

    }

}

html{

    background:#1f1f1f;

}

body{

    background:#1f1f1f;

}

</style>