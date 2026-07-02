const data = {
    frame: "",
    stem: "",
    iot: "",
    fender: "",
    status: ""
};

let qrLocked = false;
let scanner;

// ----------------------
// Выбор кнопок
// ----------------------

document.querySelectorAll(".buttons button").forEach(button=>{

    button.addEventListener("click",()=>{

        const group=button.dataset.group;
        const value=button.dataset.value;

        data[group]=value;

        button.parentElement
            .querySelectorAll("button")
            .forEach(btn=>btn.classList.remove("active"));

        button.classList.add("active");

    });

});

// ----------------------
// Запуск камеры
// ----------------------

window.onload=()=>{

    scanner=new Html5Qrcode("reader");

    scanner.start(

        {
            facingMode:"environment"
        },

        {
            fps:10,
            qrbox:{
                width:250,
                height:250
            }
        },

        onScanSuccess,

        ()=>{}

    );

};

// ----------------------
// Сканирование
// ----------------------

function onScanSuccess(text){

    if(qrLocked) return;

    qrLocked=true;

    let code=text;

    try{

        const url=new URL(text);

        const s=url.searchParams.get("s");

        if(s){

            code=s;

        }

    }catch(e){

    }

    document.getElementById("qr").value=code;

    if(navigator.vibrate){

        navigator.vibrate(120);

    }

}

// ----------------------
// Сохранение
// ----------------------

document.getElementById("save").onclick=function(){

    const qr=document.getElementById("qr").value;

    if(qr==""){

        alert("Отсканируйте QR");

        return;

    }

    const result={

        qr:qr,
        frame:data.frame,
        stem:data.stem,
        iot:data.iot,
        fender:data.fender,
        status:data.status,
        comment:document.getElementById("comment").value

    };

    console.log(result);

    clearForm();

};

// ----------------------
// Очистка
// ----------------------

function clearForm(){

    document.getElementById("qr").value="";
    document.getElementById("comment").value="";

    qrLocked=false;

    data.frame="";
    data.stem="";
    data.iot="";
    data.fender="";
    data.status="";

    document
        .querySelectorAll(".buttons button")
        .forEach(btn=>btn.classList.remove("active"));

}
