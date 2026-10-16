// Блок «Анализы» для карточек аппаратов (model.html, flow.html, pfd.html): какие пробы отбирают на этом аппарате,
// что определяют и с какой нормой. Данные: analyses-data.js (window.ANL). Полный список — на вкладке «Анализы».
(function(g){
  var T={ru:{title:'Анализы',hint:'Точки отбора проб на этом аппарате по технологическому регламенту (п. 9.3).',all:'Все анализы ▸',pos:'Позиция по регламенту',who:'Проверяет'},
         uz:{title:'Tahlillar',hint:'Bu apparatdagi namuna olish nuqtalari (reglamentning 9.3-bandi).',all:'Barcha tahlillar ▸',pos:'Reglament bo‘yicha pozitsiya',who:'Tekshiradi'}};
  var css=false;
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function style(){
    if(css)return;css=true;var s=document.createElement('style');
    s.textContent='.anlb{margin-top:14px}.anlb details{border:1px solid var(--line);border-left:4px solid #23873A;border-radius:8px;margin:6px 0;background:var(--panel2)}'
    +'.anlb summary{cursor:pointer;padding:7px 10px;font-size:13px;font-weight:600;list-style:none}.anlb summary::-webkit-details-marker{display:none}'
    +'.anlb summary:before{content:"▸ ";color:#23873A}.anlb details[open] summary:before{content:"▾ "}'
    +'.anlb .ib{padding:0 10px 9px;font-size:12.5px;color:var(--ink2)}.anlb .ib div{padding:2px 0;border-top:1px dashed var(--line)}.anlb .ib div:first-child{border-top:0}'
    +'.anlb .ib b{font:700 12px ui-monospace,Menlo,Consolas,monospace;color:var(--ink)}.anlb .ib small{display:block;color:var(--ink3);margin-top:4px}';
    document.head.appendChild(s);
  }
  g.anlBlock=function(tag,lang){
    var D=g.ANL;if(!D)return '';var a=D.byEq(tag);if(!a.length)return '';
    style();var t=T[lang==='uz'?'uz':'ru'];
    return '<div class="anlb"><div class="eyebrow">⚗ '+esc(t.title)+'</div><div style="font-size:12px;color:var(--ink3);margin:2px 0 4px">'+esc(t.hint)+'</div>'+
      a.map(function(x){return '<details><summary>'+esc(x.n)+'</summary><div class="ib">'+
        x.p.map(function(r){return '<div>'+esc(r[0])+': <b>'+esc(r[2])+'</b> · '+esc(r[1])+'</div>'}).join('')+
        '<small>'+esc(t.pos)+': '+esc(x.pos)+' · '+esc(t.who)+': '+esc(x.who)+'</small></div></details>'}).join('')+
      '<button class="btn" type="button" id="anlAll" style="margin-top:6px">'+esc(t.all)+'</button></div>';
  };
  g.anlBind=function(root,tag,from){
    var b=root.querySelector('#anlAll');if(!b)return;
    b.onclick=function(){try{g.parent.postMessage({__tmkGoto:{to:'analyses',tag:tag,from:from}},'*')}catch(e){}};
  };
})(window);
