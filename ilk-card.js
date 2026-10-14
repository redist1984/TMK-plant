// Блок «Блокировки» для карточек аппаратов (model.html, flow.html): простыми словами, что и при каком условии
// сработает на этом аппарате. Данные: interlocks-data.js (window.ILK). Подробности — на вкладке «Блокировки».
(function(g){
  var T={
    ru:{title:'Блокировки',cause:'Если',effect:'То',by:'Обход (байпас)',rs:'Сброс',all:'Все блокировки аппарата ▸',verify:'Логику уточнить по чертежу.',sheet:'Лист',
        hint:'Автоматическая защита этого аппарата: при каком условии он остановится, включится или повлияет на другое оборудование.',ea:'Этот аппарат БЛОКИРУЕТСЯ: автоматика остановит, пустит или закроет его при условии ниже.',ec:'На этом аппарате стоит датчик или условие блокировки. Сам аппарат не блокируется, блокируется другое оборудование.'},
    uz:{title:'Blokirovkalar',cause:'Agar',effect:'Unda',by:'Aylanib o‘tish (baypas)',rs:'Tiklash',all:'Apparatning barcha blokirovkalari ▸',verify:'Mantiq chizma bo‘yicha aniqlanadi.',sheet:'Varaq',
        hint:'Bu apparatni avtomatik himoya qilish: qanday shartda to‘xtaydi, yoqiladi yoki boshqa jihozga ta’sir qiladi.',ea:'Bu apparat BLOKLANADI: quyidagi shartda avtomatika uni to‘xtatadi, ishga tushiradi yoki yopadi.',ec:'Bu apparatda blokirovka datchigi yoki sharti turibdi. Apparatning o‘zi bloklanmaydi, boshqa jihoz bloklanadi.'}
  };
  var COL={stop:'#C9302A',trip:'#A3191B',valve:'#2362C0',start:'#23873A',alarm:'#C79A00',info:'#72827D'};
  var css=false;
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function items(tag){var D=g.ILK;return D?D.items.filter(function(it){return (it.eq||[]).indexOf(tag)>=0}):[]}
  function style(){
    if(css)return;css=true;var s=document.createElement('style');
    s.textContent='.ilkb{margin-top:14px}.ilkb details{border:1px solid var(--line);border-left:4px solid var(--kc);border-radius:8px;margin:6px 0;background:var(--panel2)}'
    +'.ilkb summary{cursor:pointer;padding:7px 10px;font-size:13px;font-weight:600;list-style:none}.ilkb summary::-webkit-details-marker{display:none}'
    +'.ilkb summary:before{content:"▸ ";color:var(--kc)}.ilkb details[open] summary:before{content:"▾ "}'
    +'.ilkb .ib{padding:0 10px 9px;font-size:12.5px;color:var(--ink2)}.ilkb .ib p{margin:0 0 6px;color:var(--ink)}'
    +'.ilkb .ib dl{margin:4px 0;display:grid;grid-template-columns:max-content 1fr;gap:2px 8px}.ilkb .ib dt{font-weight:700;color:var(--kc)}.ilkb .ib dd{margin:0}'
    +'.ilkb .ib code{font:700 11.5px ui-monospace,Menlo,Consolas,monospace;color:var(--ink)}.ilkb .ib small{display:block;color:var(--ink3);margin-top:4px}'
    +'.ilkb .ia{margin-top:6px}';
    document.head.appendChild(s);
  }
  function lst(a,k){return a.slice(0,k).map(function(x){return '<code>'+esc(x[0])+'</code> '+esc(x[2]&&x[2].length<40&&k===99?x[2]:'')}).join('; ')}
  // HTML-блок для карточки аппарата tag
  g.ilkBlock=function(tag,lang){
    var a=items(tag);if(!a.length)return '';
    style();var t=T[lang==='uz'?'uz':'ru'],role=g.ILK.role(tag);
    return '<div class="ilkb"><div class="eyebrow">'+esc(t.title)+'</div><div style="font-size:12px;color:var(--ink3);margin:2px 0 4px">'+esc(t.hint)+'</div>'+
      a.map(function(it){
        var causes=it.c.slice(0,4).map(function(x){return '<code>'+esc(x[0])+'</code> '+esc(x[1])+(x[2]?' ('+esc(x[2])+')':'')}).join('<br>')+(it.c.length>4?'<br>…':'');
        var effects=it.e.slice(0,4).map(function(x){return '<code>'+esc(x[0])+'</code> '+esc(x[1])}).join('<br>');
        var mod=[];if(it.by)mod.push(esc(t.by)+': <code>'+esc(it.by)+'</code>');if(it.rs)mod.push(esc(t.rs)+': <code>'+esc(it.rst||'PB-REST')+'</code>');
        return '<details style="--kc:'+COL[it.k]+'"><summary>'+esc(it.t)+'</summary><div class="ib"><p>'+esc(it.p)+'</p>'+
          '<dl><dt>'+esc(t.cause)+'</dt><dd>'+causes+'</dd><dt>'+esc(t.effect)+'</dt><dd>'+effects+'</dd></dl>'+
          '<small>'+(mod.length?mod.join(' · ')+' · ':'')+esc(t.sheet)+' '+esc(g.ILK.sheets[it.sh].dwg)+(it.v?' · '+esc(t.verify):'')+'</small></div></details>';
      }).join('')+
      '<button class="btn" type="button" id="ilkAll" style="margin-top:6px">'+esc(t.all)+'</button></div>';
  };
  g.ilkBind=function(root,tag,from){
    var b=root.querySelector('#ilkAll');if(!b)return;
    b.onclick=function(){try{g.parent.postMessage({__tmkGoto:{to:'interlocks',tag:tag,from:from}},'*')}catch(e){}};
  };
  g.ilkCount=function(tag){return items(tag).length};
})(window);
