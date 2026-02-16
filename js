// ===== 旅行管理 =====
const prefectures = [
"北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県",
"茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県",
"新潟県","富山県","石川県","福井県","山梨県","長野県",
"岐阜県","静岡県","愛知県","三重県",
"滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県",
"鳥取県","島根県","岡山県","広島県","山口県",
"徳島県","香川県","愛媛県","高知県",
"福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"
];

let visited = JSON.parse(localStorage.getItem("visited")) || [];
let remaining = JSON.parse(localStorage.getItem("remaining")) || [...prefectures];
let current = null;

// ===== ホーム画面ボタン制御 =====
let mode = "home";

function renderButtons() {
  const area = document.getElementById("buttons");
  if (!area) return;
  area.innerHTML = "";
  if (mode === "home") {
    area.innerHTML = `<button onclick="startRandom()">旅行する</button>
                      <button onclick="openMenu()">メニュー</button>`;
  }
  if (mode === "traveling") {
    area.innerHTML = `<button onclick="goVisit()">ここに行く</button>
                      <button onclick="skip()">一旦飛ばす</button>`;
  }
  if (mode === "menu") {
    area.innerHTML = `<button onclick="goRecord()">旅行記録</button>
                      <button onclick="resetTravel()">リセット</button>
                      <button onclick="closeMenu()">戻る</button>`;
  }
}

function startRandom() {
  if (remaining.length === 0) {
    document.getElementById("result").textContent = "🎉 全県制覇 🎉";
    return;
  }
  const idx = Math.floor(Math.random() * remaining.length);
  current = remaining[idx];
  document.getElementById("result").textContent = current;
  mode = "traveling";
  renderButtons();
}

function goVisit() {
  if (!current) return;
  visited.push(current);
  remaining = remaining.filter(p => p !== current);
  updateVisitedList();
  localStorage.setItem("visited", JSON.stringify(visited));
  localStorage.setItem("remaining", JSON.stringify(remaining));
  current = null;
  mode = "home";
  renderButtons();
}

function skip() {
  current = null;
  document.getElementById("result").textContent = "次の行き先はココ‼";
  mode = "home";
  renderButtons();
}

function updateVisitedList() {
  const el = document.getElementById("visited");
  if (el) el.textContent = "旅行済み: " + visited.join("、");
}

function openMenu() { mode="menu"; renderButtons(); }
function closeMenu() { mode="home"; renderButtons(); }
function goRecord() { window.location.href="kiroku.html"; }

function resetTravel() {
  if (!confirm("本当にリセットしますか？")) return;
  visited=[]; remaining=[...prefectures]; current=null;
  localStorage.removeItem("visited"); localStorage.removeItem("remaining");
  document.getElementById("result").textContent="次の行き先はココ‼";
  updateVisitedList();
}

// ===== SVG 日本地図操作 =====
function renderMap() {
  const mapDiv = document.getElementById("map");
  if (!mapDiv) return;

  // SVG をここに埋め込むか、imgタグで外部SVGを読み込む
  // ここでは例として赤くした県名をリスト表示
  mapDiv.innerHTML = "訪問済み: " + visited.join("、");
}

// ===== 県ページ pref.html 操作 =====
function loadPrefData() {
  const pref = document.getElementById("prefName").textContent;
  const data = JSON.parse(localStorage.getItem(pref) || "{}");
  if (data.photos && data.photos.length>0) {
    document.getElementById("headerPhoto").src = data.photos[0];
  }
  if (data.note) document.getElementById("noteArea").value = data.note;
}

function addPhoto() {
  const input = document.getElementById("photoInput");
  const pref = document.getElementById("prefName").textContent;
  const file = input.files[0];
  if (!file) return alert("写真を選んでね");
  const reader = new FileReader();
  reader.onload = function(e) {
    const data = JSON.parse(localStorage.getItem(pref) || "{}");
    if (!data.photos) data.photos=[];
    data.photos.push(e.target.result);
    localStorage.setItem(pref, JSON.stringify(data));
    document.getElementById("headerPhoto").src = e.target.result;
  }
  reader.readAsDataURL(file);
}

function saveNote() {
  const pref = document.getElementById("prefName").textContent;
  const note = document.getElementById("noteArea").value;
  const data = JSON.parse(localStorage.getItem(pref) || "{}");
  data.note = note;
  localStorage.setItem(pref, JSON.stringify(data));
}

function goBack() { window.history.back(); }
