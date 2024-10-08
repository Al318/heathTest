// ==UserScript==
// @name         ReadableCode
// @namespace    noreehn.
// @version      [privateversion]
// @description  Скрипт для удобной и быстрой работы в электронном журнале.
// @author       https://t.me/noreehn
// @match        https://school.bilimal.kz/*
// @icon         https://raw.githubusercontent.com/nxreehn/bilimalX/main/bilimalXIcon.png
// @homepageURL  https://t.me/noreehn
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// ==/UserScript==

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Возвращает плюсики к ФО, СОР и СОЧ
const addMarkPlus = (selector) => {
  document.querySelectorAll(selector).forEach((e) => {
    const t = e.querySelector("#tasks");
    if (!e.querySelector(".tooltipster.mark_symbol.is-update") && t) {
      t.innerHTML = '<div class="mark-plus">+</div>';
    } else if (!e.querySelector(".tooltipster.mark_symbol.is-update")) {
      e.insertAdjacentHTML(
        "beforeend",
        '<div id="tasks" style="display: flex; align-items: center; justify-content: flex-end; padding: 5px;" data-bg="none"><div class="mark-plus">+</div></div>'
      );
    }
  });
};

addMarkPlus("td.mark.current.sor");
addMarkPlus("td.mark.current.soch");
addMarkPlus("td.mark.current");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Активировать кнопки Сохранить и Удалить при клике на + если они не активны
function enableButtons() {
  var okButton = $("#modal_ok_button");
  var deleteButton = $("#modal_delete_button");
  if (okButton.length > 0 && okButton.prop("disabled")) {
    okButton.prop("disabled", false);
  }
  if (deleteButton.length > 0 && deleteButton.prop("disabled")) {
    deleteButton.prop("disabled", false);
  }
}

$(document).on("click", "a.tooltipster.mark_symbol.is-update, a.tooltipster.mark_symbol, .tasks, .mark-plus", function() {
  $("#modalmark").one("shown.bs.modal", function() {
    enableButtons();
  });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Логотип сайта с анимацией
const logoSrc = "https://raw.githubusercontent.com/nxreehn/bilimalX/main/logo.png";
const logoElement = document.querySelector(".main-header-logo");
const newImage = document.createElement("img");
const styleElement = document.createElement("style");

newImage.src = logoSrc;
newImage.alt = "Bilimal Logo";
logoElement.innerHTML = "";
logoElement.appendChild(newImage);

newImage.addEventListener("click", () => {
  window.location.href = "/cabinet_teacher/";
});

logoElement.style.cursor = "pointer"; // Добавление стиля cursor: pointer;

styleElement.textContent = `
@-webkit-keyframes slide-in-blurred-left {
  0% {
    -webkit-transform: translateX(-1000px) scaleX(2.5) scaleY(0.2);
            transform: translateX(-1000px) scaleX(2.5) scaleY(0.2);
    -webkit-transform-origin: 100% 50%;
            transform-origin: 100% 50%;
    -webkit-filter: blur(40px);
            filter: blur(40px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateX(0) scaleY(1) scaleX(1);
            transform: translateX(0) scaleY(1) scaleX(1);
    -webkit-transform-origin: 50% 50%;
            transform-origin: 50% 50%;
    -webkit-filter: blur(0);
            filter: blur(0);
    opacity: 1;
  }
}

@keyframes slide-in-blurred-left {
  0% {
    -webkit-transform: translateX(-1000px) scaleX(2.5) scaleY(0.2);
            transform: translateX(-1000px) scaleX(2.5) scaleY(0.2);
    -webkit-transform-origin: 100% 50%;
            transform-origin: 100% 50%;
    -webkit-filter: blur(40px);
            filter: blur(40px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateX(0) scaleY(1) scaleX(1);
            transform: translateX(0) scaleY(1) scaleX(1);
    -webkit-transform-origin: 50% 50%;
            transform-origin: 50% 50%;
    -webkit-filter: blur(0);
            filter: blur(0);
    opacity: 1;
  }
}

.main-header-logo img {
  animation: slide-in-blurred-left 0.6s cubic-bezier(0.230, 1.000, 0.320, 1.000) both;
  width: 160px;
  height: auto;
}
`;

document.head.appendChild(styleElement);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Добавить кнопку "Копировать темы в этой четверти" и вывести модально окно с уведомлением
const sweetalert2 = document.createElement("script");
sweetalert2.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
document.head.appendChild(sweetalert2);

sweetalert2.onload = function () {
  const addButton = () => {
    if (document.querySelector(".btn-copy-topics")) return;
    const button = document.createElement("button");
    button.innerText = "Копировать темы в этой четверти";
    button.classList.add("btn", "btn-green", "btn-mini", "btn-copy-topics");
    button.style.marginLeft = "4px";
    button.addEventListener("click", () => {
      const topicElements = document.querySelectorAll(".ctp-view-lplan span");
      const topics = Array.from(topicElements)
        .map(topicElement => topicElement.textContent.trim().replace(/^\d+\.\s/, ""));
      const textToCopy = topics.join("\n");

      const textarea = document.createElement("textarea");
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);

      Swal.fire({
        title: "Темы уроков были удачно скопированы!",
        icon: "success",
        showConfirmButton: true,
        timer: 1500
      });
    });

    const targetButton = document.querySelector(".ctp-lplans .btn.btn-green.btn-mini");
    if (targetButton) {
      targetButton.parentNode.insertBefore(button, targetButton.nextSibling);
    }
  };

  addButton();

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes) {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const addedNode = mutation.addedNodes[i];
          if (addedNode.classList && addedNode.classList.contains("ctp-view-lplan")) {
            addButton();
            break;
          }
        }
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Добавляет иконку плюса около логотипа при клике на который открывается выбор настроек
var biliPlusdropdown = document.createElement("div");
biliPlusdropdown.className = "biliPlusdropdown";
var aboutScriptImage = document.createElement("img");
aboutScriptImage.src = "https://raw.githubusercontent.com/nxreehn/bilimalX/main/bilimalXIcon.png", aboutScriptImage.style.width = "21px", aboutScriptImage.style
  .height = "21px", aboutScriptImage.style.position = "relative", aboutScriptImage.style.top = "0px", aboutScriptImage.style.left = "0px";
const rowElement = document.querySelector(".main-header-logo");
rowElement.appendChild(aboutScriptImage);
var biliPlusmenu = document.createElement("div");
biliPlusmenu.id = "biliPlusmenu", biliPlusmenu.className = "biliPlusmenu-content";
var menuItems = ["Размытие в шапке"];
menuItems.forEach((function(e, t) {
  var n = document.createElement("div");
  n.className = "biliPlusli";
  var i = document.createElement("label");
  i.className = "biliPlusswitch";
  var o = document.createElement("span");
  o.className = "biliPluscheck-text", o.textContent = e;
  var a = document.createElement("input");
  a.type = "checkbox", a.id = "biliPlusCheckbox" + t, "true" === localStorage.getItem(a.id) && (a.checked = !0, applyBlur(a.checked));
  var l = document.createElement("span");
  l.className = "slider round", i.appendChild(o), i.appendChild(a), i.appendChild(l), n.appendChild(i), biliPlusmenu.appendChild(n), a.addEventListener(
    "change", (function() {
      "Размытие в шапке" === e && (localStorage.setItem(a.id, a.checked), applyBlur(a.checked))
    }))
}));
var notificationCheckbox = document.createElement("input");
notificationCheckbox.type = "checkbox", notificationCheckbox.id = "notificationCheckbox", "true" === localStorage.getItem(notificationCheckbox.id) && (
  notificationCheckbox.checked = !0);
var listItemNotification = document.createElement("div");
listItemNotification.className = "biliPlusli";
var labelNotification = document.createElement("label");
labelNotification.className = "biliPlusswitch";
var checkTextNotification = document.createElement("span");
checkTextNotification.className = "biliPluscheck-text", checkTextNotification.textContent = "Уведомления скрипта";
var sliderSpanNotification = document.createElement("span");
sliderSpanNotification.className = "slider round", labelNotification.appendChild(checkTextNotification), labelNotification.appendChild(notificationCheckbox),
  labelNotification.appendChild(sliderSpanNotification), listItemNotification.appendChild(labelNotification), biliPlusmenu.appendChild(listItemNotification),
  notificationCheckbox.addEventListener("change", (function() {
    if(localStorage.setItem(notificationCheckbox.id, notificationCheckbox.checked), notificationCheckbox.checked) fetchNotificationContent();
    else {
      var e = document.querySelector("#notifcenter");
      e && (e.innerHTML = "")
    }
  })), biliPlusdropdown.appendChild(biliPlusmenu), document.body.appendChild(biliPlusdropdown), aboutScriptImage.addEventListener("click", (function(e) {
    e.stopPropagation();
    var t = aboutScriptImage.getBoundingClientRect();
    biliPlusmenu.style.position = "fixed", biliPlusmenu.style.top = t.bottom + "px", biliPlusmenu.style.left = t.left + "px", biliPlusmenu.style.display =
      "block" === biliPlusmenu.style.display ? "none" : "block"
  })), document.addEventListener("click", (function(e) {
    biliPlusdropdown.contains(e.target) || "block" !== biliPlusmenu.style.display || (biliPlusmenu.style.display = "none")
  }));
var style = document.createElement("style");

function applyBlur(e) {
  const t = document.querySelector(".main-header");
  e ? (t.style.background = "rgba( 144, 19, 254, 0.05 )", t.style.boxShadow = "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )", t.style.backdropFilter = "blur( 5px )",
    t.style.webkitBackdropFilter = "blur( 5px )") : (t.style.background = "", t.style.boxShadow = "", t.style.backdropFilter = "", t.style
    .webkitBackdropFilter = "")
}
async function fetchNotificationContent() {
  try {
    if(!notificationCheckbox.checked) return;
    const e = await fetch("https://raw.githubusercontent.com/nxreehn/bilimalX/main/notificationContent");
    if(!e.ok) throw new Error("Не удалось получить содержимое файла notificationContent");
    const t = await e.text();
    document.querySelector("#notifcenter").innerHTML = t
  } catch (e) {
    console.error("Произошла ошибка:", e)
  }
}
style.textContent =
  "\n    /* Ваши стили здесь */\n\n@import url('https://fonts.googleapis.com/css2?family=Wix+Madefor+Display:wght@600;800&display=swap');\n\n.biliPlusdropbtn {\n    background-color: #FFFFFF;\n    color: #342CFF;\n    padding: 10px 15px;\n    border: solid #342CFF;\n    border-radius: 10px;\n    cursor: pointer;\n    font-size: 18px;\n    font-family: 'Wix Madefor Display', sans-serif;\n    font-weight: 600;\n  }\n\n  .biliPlusdropbtn:hover {\n    background-color: #342CFF;\n    color: #FFFFFF;\n    box-shadow: 0px 0px 5px 0px#342CFF;\n  }\n\n  .biliPlusdropdown {\n    position: relative;\n    display: inline-block;\n  }\n\n  .biliPlusmenu-content {\n    display: none;\n    position: absolute;\n    background-color: #ffffff;\n    min-width: 300px;\n    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);\n    z-index: 500;\n    border-radius: 10px;\n    margin: 0px -38px;\n  }\n\n  .biliPlusmenu-content div {\n    color: black;\n    padding: 12px 20px;\n    text-decoration: none;\n    display: block;\n    font-family: 'Wix Madefor Display', sans-serif;\n  }\n\n  .biliPlusmenu-content a:hover {background-color: #ddd;}\n\n  .biliPluscheck-text {\n       line-height: 35px;\n       margin-left: -190px;\n       font-family: 'Wix Madefor Display', sans-serif;\n   }\n\n  .show {display:block;}\n\n  .biliPlusswitch {\n    position: relative;\n    display: inline-block;\n    width: 60px;\n    height: 34px;\n    left: 190px;\n  }\n\n  .biliPlusswitch input {\n    opacity: 0;\n    width: 0;\n    height: 0;\n  }\n\n  .slider {\n    position: absolute;\n    cursor: pointer;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    background-color: #ccc;\n    -webkit-transition: .4s;\n    transition: .4s;\n  }\n\n  .slider:before {\n    position: absolute;\n    content: \"\";\n    height: 26px;\n    width: 26px;\n    left: 4px;\n    bottom: 4px;\n    background-color: white;\n    -webkit-transition: .4s;\n    transition: .4s;\n  }\n\n  input:checked + .slider {\n    background-color: #342CFF;\n    box-shadow: 0px 0px 5px 0px#342CFF;\n  }\n  input:checked + .slider:before {\n    -webkit-transform: translateX(26px);\n    -ms-transform: translateX(26px);\n    transform: translateX(26px);\n  }\n  /* Rounded sliders */\n  .slider.round {\n    border-radius: 34px;\n  }\n  .slider.round:before {\n    border-radius: 50%;\n  }\n\n  /* Стили для уведомления */\n  #notifcenter .notification-content {\n    background-color: #FFF;\n    border: 1px solid #CCC;\n    border-radius: 8px;\n    padding: 10px;\n    margin-top: 10px;\n  }\n",
  document.head.appendChild(style), fetchNotificationContent();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Скопировать и импортировать домашнее задание при помощи Эксель
var script = document.createElement("script");
script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.2/xlsx.full.min.js";
script.onload = function() {
  var addButtonContainer = document.querySelector(".add_new_lplan#yw4");
  if (addButtonContainer) {
    var importButton = document.createElement("a");
    importButton.className = "import_homework btn btn-green";
    importButton.textContent = "Импортировать домашнее задание";
    importButton.id = "importButton";
    importButton.style.marginLeft = "10px";
    var copyButton = document.createElement("a");
    copyButton.className = "copy_homework btn btn-success";
    copyButton.textContent = "Скопировать домашнее задание";
    copyButton.id = "copyButton";
    copyButton.style.marginLeft = "10px";
    addButtonContainer.parentNode.insertBefore(importButton, addButtonContainer.nextSibling);
    addButtonContainer.parentNode.insertBefore(copyButton, importButton.nextSibling);
    importButton.addEventListener("click", function() {
      var input = document.createElement("input");
      input.type = "file";
      input.style.display = "none";
      document.body.appendChild(input);
      input.click();
      input.addEventListener("change", function() {
        var file = input.files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
          var data = new Uint8Array(e.target.result);
          var workbook = XLSX.read(data, { type: "array" });
          var sheetName = workbook.SheetNames[0];
          var sheet = workbook.Sheets[sheetName];
          var jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          var tableRows = document.querySelectorAll("#data_table tbody tr");

          function importData(index) {
            if (index >= jsonData.length) {
              Swal.fire("Домашнее задание было успешно импортировано!");
            } else {
              var row = jsonData[index];
              var tableRow = tableRows[index];
              if (!tableRow) {
                tableRow = document.createElement("tr");
                tableRow.id = "importedRow_" + index;
                document.querySelector("#data_table tbody").appendChild(tableRow);
              }
              var cell = tableRow.querySelector("td:nth-child(6)");
              if (!cell) {
                cell = document.createElement("td");
                tableRow.appendChild(cell);
              }
              var value = row[0] ? row[0] : "";
              cell.innerHTML = '<span class="tabledit-span">' + value + '</span><input class="tabledit-input form-control input-sm" type="text" name="hometask" value="' + value + '" style="display: none;" disabled="">';
              tableRow.querySelector(".tabledit-edit-button").click();
              tableRow.querySelector(".tabledit-save-button").click();
              setTimeout(function() {
                importData(index + 1);
              }, 1000);
            }
          }
          importData(0);
        };
        reader.readAsArrayBuffer(file);
        document.body.removeChild(input);
      });
    });
    copyButton.addEventListener("click", function() {
      var rows = document.querySelectorAll("#data_table tbody tr");
      var content = "";
      rows.forEach(function(row) {
        var cell = row.querySelector(".tabledit-view-mode:nth-child(6) .tabledit-span");
        if (cell) {
          content += cell.textContent + "\n";
        }
      });
      navigator.clipboard.writeText(content);
      Swal.fire("Домашнее задание было удачно скопировано!", "Откройте таблицу Excel и вставьте туда все темы нажатием Ctrl + V", "success");
    });
  }
};
document.body.appendChild(script);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Вернуть кнопки для добавления заданий,тестов и материалов (домашнее задание для ДО, полезно когда школа отключена от ДО а отсылать задания не очень хочется)
function addButtonToPage(containerSelector, buttonText, clickHandler) {
  var container = document.querySelector(containerSelector);
  if (container) {
    var button = document.createElement("button");
    button.innerHTML = buttonText;
    button.className = "btn btn-primary";
    button.addEventListener("click", clickHandler);
    if (!(container.nextSibling && container.nextSibling.classList && container.nextSibling.classList.contains("btn-primary"))) {
      container.parentNode.insertBefore(button, container.nextSibling);
    }
  }
}

function handleButtonClick(urlSuffix) {
  var newUrl = window.location.href.replace("#vlplan", urlSuffix);
  window.location.href = newUrl;
}

function handleDOMChanges(mutations, addButtonFunction) {
  for (var mutation of mutations) {
    if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
      addButtonFunction();
    }
  }
}

var observerConfig = { childList: true, subtree: true };

var tasksButtonContainer = ".tasks-container.mt-3";
var testsButtonContainer = ".tests-container.mt-3";
var materialsButtonContainer = ".materials-container.mt-3";

function initializeTaskButton() {
  addButtonToPage(tasksButtonContainer, "Добавить задание", function() {
    handleButtonClick("#ntask");
  });
}

function initializeTestButton() {
  addButtonToPage(testsButtonContainer, "Добавить тест", function() {
    handleButtonClick("#ntest");
  });
}

function initializeMaterialsButton() {
  addButtonToPage(materialsButtonContainer, "Добавить материалы", function() {
    handleButtonClick("#nmaterial");
  });
}

var taskObserver = new MutationObserver(function(mutations) {
  handleDOMChanges(mutations, initializeTaskButton);
});
taskObserver.observe(document.body, observerConfig);
initializeTaskButton();

var testObserver = new MutationObserver(function(mutations) {
  handleDOMChanges(mutations, initializeTestButton);
});
testObserver.observe(document.body, observerConfig);
initializeTestButton();

var materialsObserver = new MutationObserver(function(mutations) {
  handleDOMChanges(mutations, initializeMaterialsButton);
});
materialsObserver.observe(document.body, observerConfig);
initializeMaterialsButton();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Добавить Н при клике на дату урока

function addElementBefore(targetElement, newElement) {
  targetElement.parentNode.insertBefore(newElement, targetElement);
}

function observeSecondElement() {
  var targetElement = document.getElementById("39");
  if (targetElement) {
    addElementBefore(targetElement, document.getElementById("7"));
  } else {
    var secondElementObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length > 0 && mutation.addedNodes[0].id === "39") {
          addElementBefore(mutation.addedNodes[0], document.getElementById("7"));
          secondElementObserver.disconnect();
        }
      });
    });
    secondElementObserver.observe(document.body, { childList: true, subtree: true });
  }
}
observeSecondElement();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//добавить кнопку "изменить вид урока на стандартынй" при клике на нее все уроки в плане будут меняться на стандартный кроме тех где уже есть вид урока
function buttonClickHandler() {
  var e, t;

  function n() {
    if(!document.querySelector(".type-title")) {
      var e = document.getElementById("lesson_view");
      if(e && "14" !== e.value) {
        e.value = "14";
        var t = document.getElementById("submitLplanSave");
        t && t.click()
      }
    }
  }
  e = document.querySelectorAll(".ctp-view-lplan a.gray-color"), t = 0, ! function l() {
    var i = e[t];
    i ? (i.click(), setTimeout(function() {
      if(document.querySelector(".type-title")) l();
      else {
        var e = document.querySelector(".page-header-btn .btn.update");
        e && e.click(), setTimeout(n, 2e3), setTimeout(l, 4e3)
      }
    }, 1e3), t++) : Swal.fire("Успешно!", "Стандартный вид урока был выставлен для всех планов в этой четверти!", "success");
  }()
}

function addButton() {
  var e = document.querySelector(".btn.btn-filter-unfilled.btn-pink.btn-mini.btn-border");
  if(e && !document.getElementById("standardLessonButton")) {
    var t = document.createElement("button");
    t.id = "standardLessonButton", t.innerHTML = "Стандартный вид урока", t.classList.add("btn", "btn-blue", "btn-mini"), t.style.marginLeft =
      "5px", t.addEventListener("click", buttonClickHandler), e.parentNode.insertBefore(t, e.nextSibling)
  }
}

function checkButton() {
  addButton(), setTimeout(checkButton, 1e3)
}
checkButton();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

