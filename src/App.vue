<template>

<div class="container">

<h1>Осмотр самоката</h1>

<p class="counter">
Сегодня осмотрено:
<b>{{ inspectionsCount }}</b>
</p>

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

<button
class="save export"
@click="downloadCSV"
>
📄 Скачать CSV
</button>

<button
class="save clear"
@click="clearData"
>
🗑 Очистить список
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

const inspectionsCount = ref(0);

let codeReader = null;
let locked = false;

function updateCounter() {

  const inspections = JSON.parse(
    localStorage.getItem("inspections") || "[]"
  );

  inspectionsCount.value = inspections.length;

}

function saveLocal(data) {

  const inspections = JSON.parse(
    localStorage.getItem("inspections") || "[]"
  );

  inspections.push({
    time: new Date().toLocaleString(),
    ...data
  });

  localStorage.setItem(
    "inspections",
    JSON.stringify(inspections)
  );

  updateCounter();

}

function clearData() {

  if (!confirm("Удалить все записи?")) return;

  localStorage.removeItem("inspections");

  updateCounter();

  alert("Список очищен");

}
function downloadCSV() {

  const inspections = JSON.parse(
    localStorage.getItem("inspections") || "[]"
  );

  if (inspections.length === 0) {

    alert("Нет сохранённых данных");

    return;

  }

  let csv =
"Дата;QR;Рама;Стойка;IOT;Крыло;Статус;Комментарий\n";

  inspections.forEach(i => {

    csv +=
`${i.time};${i.qr};${i.frame};${i.stem};${i.iot};${i.fender};${i.status};${i.comment}\n`;

  });

  const blob = new Blob(
    ["\ufeff" + csv],
    {
      type: "text/csv;charset=utf-8;"
    }
  );

  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);

  link.download =
    "inspection_" +
    new Date().toISOString().slice(0, 10) +
    ".csv";

  link.click();

}
onMounted(async () => {

  updateCounter();

  codeReader = new BrowserMultiFormatReader();

  try {

    await codeReader.decodeFromConstraints(
      {
        video: {
          facingMode: {
            ideal: "environment"
          }
        }
      },
      "reader",
      (result) => {

        if (!result) return;
        if (locked) return;

        locked = true;

        let text = result.getText();

        try {

          const url = new URL(text);

          text = url.searchParams.get("s") || text;

        } catch (e) {}

        qr.value = text;

        if (navigator.vibrate) {
          navigator.vibrate(100);
        }

      }
    );

  } catch (err) {

    console.error(err);

    alert("Не удалось открыть камеру: " + err.message);

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

  saveLocal(data);

  if (navigator.vibrate) {
    navigator.vibrate([100, 50, 100]);
  }

  alert("✅ Самокат сохранён");

  qr.value = "";
  frame.value = "";
  stem.value = "";
  iot.value = "";
  fender.value = "";
  status.value = "";
  comment.value = "";

  setTimeout(() => {
    locked = false;
  }, 1000);

}

</script>
<style scoped>

html,
body{

    margin:0;
    padding:0;
    background:#1f1f1f;
    font-family:Arial,Helvetica,sans-serif;

}

.container{

    max-width:520px;
    margin:auto;
    padding:20px;

}

h1{

    color:white;
    text-align:center;
    margin-bottom:10px;

}

.counter{

    color:white;
    text-align:center;
    font-size:20px;
    margin-bottom:20px;

}

#reader{

    width:100%;
    min-height:300px;
    background:#000;
    border-radius:12px;
    overflow:hidden;
    margin-bottom:20px;

}

#reader video{

    width:100%;
    height:100%;
    object-fit:cover;

}

input,
textarea{

    width:100%;
    box-sizing:border-box;
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

    color:white;
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
    background:#555;
    color:white;
    font-size:17px;
    cursor:pointer;
    transition:.2s;

}

.buttons button.active{

    background:#00C853;

}

.save{

    width:100%;
    padding:16px;
    margin-top:10px;
    border:none;
    border-radius:10px;
    font-size:20px;
    cursor:pointer;
    color:white;
    background:#00C853;

}

.export{

    background:#1976D2;

}

.clear{

    background:#D32F2F;

}

.save:disabled{

    opacity:.5;
    cursor:not-allowed;

}

.save:hover{

    opacity:.9;

}

.save:active{

    transform:scale(.98);

}

@media(max-width:600px){

.container{

padding:12px;

}

.buttons{

flex-direction:column;

}

.buttons button{

width:100%;

}

}

</style>
