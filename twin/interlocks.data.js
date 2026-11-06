/* Сгенерировано node twin/gen-interlocks.js — не править вручную. */
(function (root) {
  var D = {
 "source": "interlocks-data.js",
 "count": 42,
 "items": [
  {
   "id": "I-101",
   "sheet": "111",
   "title": "Сухой ход насосов фильтрации 1-й ступени",
   "kind": "stop",
   "join": "or",
   "causes": [
    {
     "tag": "LIAS-11101",
     "text": "Уровень в баке фильтра 1-й ступени",
     "cond": {
      "type": "analog",
      "op": "<",
      "value": 500,
      "unit": "мм",
      "setpointUnknown": false,
      "voting": null,
      "text": "< 500 мм"
     }
    }
   ],
   "effects": [
    {
     "tag": "PP-11101A",
     "text": "Останов насоса фильтрации 1-й ступени A",
     "action": "stop"
    },
    {
     "tag": "PP-11101B",
     "text": "Останов насоса фильтрации 1-й ступени B",
     "action": "stop"
    }
   ],
   "bypass": "SS-PASS",
   "reset": "PB-REST",
   "manual": "PB-MAN",
   "applied": [
    "PP-11101A/B"
   ],
   "equip": [
    "TK-11102",
    "PP-11101A/B"
   ],
   "plain": "Если жидкой серы в баке фильтра 1-й ступени осталось меньше 500 мм, оба насоса останавливаются, чтобы не работать «всухую». Оператору приходит тревога.",
   "note": "",
   "verify": false
  },
  {
   "id": "I-111",
   "sheet": "111",
   "title": "Сухой ход вспомогательных насосов фильтрации",
   "kind": "stop",
   "join": "or",
   "causes": [
    {
     "tag": "LIAS-11102",
     "text": "Уровень во вспомогательном баке (подготовка добавки)",
     "cond": {
      "type": "analog",
      "op": "<",
      "value": 500,
      "unit": "мм",
      "setpointUnknown": false,
      "voting": null,
      "text": "< 500 мм"
     }
    }
   ],
   "effects": [
    {
     "tag": "PP-11103A",
     "text": "Останов вспомогательного насоса A",
     "action": "stop"
    },
    {
     "tag": "PP-11103B",
     "text": "Останов вспомогательного насоса B",
     "action": "stop"
    }
   ],
   "bypass": "SS-PASS",
   "reset": "PB-REST",
   "manual": "PB-MAN",
   "applied": [
    "PP-11103A/B"
   ],
   "equip": [
    "TK-11104",
    "PP-11103A/B"
   ],
   "plain": "Если во вспомогательном баке фильтровальной добавки меньше 500 мм, оба вспомогательных насоса останавливаются.",
   "note": "",
   "verify": false
  },
  {
   "id": "I-103",
   "sheet": "111",
   "title": "Сухой ход насосов фильтрации 2-й ступени",
   "kind": "stop",
   "join": "or",
   "causes": [
    {
     "tag": "LIAS-11103",
     "text": "Уровень в баке фильтра 2-й ступени",
     "cond": {
      "type": "analog",
      "op": "<",
      "value": 500,
      "unit": "мм",
      "setpointUnknown": false,
      "voting": null,
      "text": "< 500 мм"
     }
    }
   ],
   "effects": [
    {
     "tag": "PP-11102A",
     "text": "Останов насоса фильтрации 2-й ступени A",
     "action": "stop"
    },
    {
     "tag": "PP-11102B",
     "text": "Останов насоса фильтрации 2-й ступени B",
     "action": "stop"
    }
   ],
   "bypass": "SS-PASS",
   "reset": "PB-REST",
   "manual": "PB-MAN",
   "applied": [
    "PP-11102A/B"
   ],
   "equip": [
    "TK-11103",
    "PP-11102A/B"
   ],
   "plain": "Если в баке фильтра 2-й ступени меньше 500 мм, оба насоса 2-й ступени останавливаются.",
   "note": "",
   "verify": false
  },
  {
   "id": "I-104",
   "sheet": "111",
   "title": "Защита насосов промежуточного бака чистой серы",
   "kind": "stop",
   "join": "or",
   "causes": [
    {
     "tag": "LIAS-12201A",
     "text": "Уровень в резервуаре жидкой серы 1",
     "cond": {
      "type": "analog",
      "op": ">",
      "value": 11160,
      "unit": "мм",
      "setpointUnknown": false,
      "voting": null,
      "text": "> 11160 мм"
     }
    },
    {
     "tag": "LIAS-12201B",
     "text": "Уровень в резервуаре жидкой серы 2",
     "cond": {
      "type": "analog",
      "op": ">",
      "value": 11160,
      "unit": "мм",
      "setpointUnknown": false,
      "voting": null,
      "text": "> 11160 мм"
     }
    },
    {
     "tag": "LIAS-11104",
     "text": "Уровень в промежуточном баке",
     "cond": {
      "type": "analog",
      "op": "<",
      "value": 500,
      "unit": "мм",
      "setpointUnknown": false,
      "voting": null,
      "text": "< 500 мм"
     }
    }
   ],
   "effects": [
    {
     "tag": "PP-11104A",
     "text": "Останов насоса промежуточного бака A",
     "action": "stop"
    },
    {
     "tag": "PP-11104B",
     "text": "Останов насоса промежуточного бака B",
     "action": "stop"
    }
   ],
   "bypass": "SS-PASS",
   "reset": "PB-REST",
   "manual": "PB-MAN",
   "applied": [
    "PP-11104A/B"
   ],
   "equip": [
    "TK-11105",
    "VE-12201",
    "PP-11104A/B"
   ],
   "plain": "Насосы промежуточного бака останавливаются в двух случаях: в баке мало серы (меньше 500 мм) или любой из двух резервуаров жидкой серы переполняется (больше 11160 мм), то есть подавать в него больше нельзя.",
   "note": "",
   "verify": false
  },
  {
   "id": "I-105",
   "sheet": "111",
   "title": "Сухой ход конденсатных насосов",
   "kind": "stop",
   "join": "or",
   "causes": [
    {
     "tag": "LIAS-11105",
     "text": "Уровень в конденсатном баке",
     "cond": {
      "type": "analog",
      "op": "<",
      "value": 400,
      "unit": "мм",
      "setpointUnknown": false,
      "voting": null,
      "text": "< 400 мм"
     }
    }
   ],
   "effects": [
    {
     "tag": "PP-11105A",
     "text": "Останов конденсатного насоса A",
     "action": "stop"
    },
    {
     "tag": "PP-11105B",
     "text": "Останов конденсатного насоса B",
     "action": "stop"
    }
   ],
   "bypass": "SS-PASS",
   "reset": "PB-REST",
   "manual": "PB-MAN",
   "applied": [
    "PP-11105A/B"
   ],
   "equip": [
    "VE-11101",
    "PP-11105A/B"
   ],
   "plain": "Если в конденсатном баке меньше 400 мм, конденсатные насосы останавливаются.",
   "note": "",
   "verify": false
  },
  {
   "id": "CSV-11101",
   "sheet": "111",
   "title": "Качество конденсата: куда направить поток",
   "kind": "valve",
   "join": "or",
   "causes": [
    {
     "tag": "CISA-11101",
     "text": "Электропроводность конденсата в выходном трубопроводе",
     "cond": {
      "type": "analog",
      "op": "<=",
      "value": 0.3,
      "unit": "мкСм/см",
      "setpointUnknown": false,
      "voting": null,
      "text": "≤ 0,3 мкСм/см"
     }
    }
   ],
   "effects": [
    {
     "tag": "CSV-11101A",
     "text": "Отсечной клапан конденсата в установку обессоленной воды (открыть / закрыть)",
     "action": "switch"
    },
    {
     "tag": "CSV-11101B",
     "text": "Отсечной клапан конденсата в оборотную воду (открыть / закрыть)",
     "action": "switch"
    }
   ],
   "bypass": "SS-PASS",
   "reset": "RESET",
   "manual": null,
   "applied": [],
   "equip": [
    "VE-11101",
    "PP-11105A/B"
   ],
   "plain": "Чистый конденсат (электропроводность не выше 0,3 мкСм/см) направляется на обессоливание, при выходе показателя из нормы клапаны переключаются на другой маршрут. Клапаны управляются на месте. Точное направление каждого клапана нужно сверить по листу.",
   "note": "",
   "verify": true
  },
  {
   "id": "F-1",
   "sheet": "112",
   "title": "Аварийный останов подачи серы и воздуха в печь",
   "kind": "trip",
   "join": "or",
   "causes": [
    {
     "tag": "YL-BO-11301",
     "text": "Работа главной воздуходувки",
     "cond": {
      "type": "discrete",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": false,
      "voting": null,
      "text": "остановлена"
     }
    },
    {
     "tag": "FT-11302",
     "text": "Расход кислоты на сушильную башню",
     "cond": {
      "type": "analog",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": true,
      "voting": null,
      "text": "ниже ** м³/ч"
     }
    },
    {
     "tag": "FT-11303",
     "text": "Расход кислоты на башню 2-й абсорбции",
     "cond": {
      "type": "analog",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": true,
      "voting": null,
      "text": "ниже ** м³/ч"
     }
    },
    {
     "tag": "YL-PP-11301",
     "text": "Работа циркуляционного насоса сушильной башни",
     "cond": {
      "type": "discrete",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": false,
      "voting": null,
      "text": "остановлен"
     }
    },
    {
     "tag": "YL-PP-11303",
     "text": "Работа циркуляционного насоса 2-й абсорбции",
     "cond": {
      "type": "discrete",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": false,
      "voting": null,
      "text": "остановлен"
     }
    },
    {
     "tag": "LT-11401A/B/C",
     "text": "Уровень в барабане котла-утилизатора",
     "cond": {
      "type": "analog",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": true,
      "voting": {
       "k": 2,
       "n": 3
      },
      "text": "2 из 3 ≥ ** мм (после аварийного слива HV-11401 и выдержки)"
     }
    },
    {
     "tag": "LT-11401A/B/C",
     "text": "Уровень в барабане котла-утилизатора",
     "cond": {
      "type": "analog",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": true,
      "voting": {
       "k": 2,
       "n": 3
      },
      "text": "2 из 3 ≤ ** мм"
     }
    },
    {
     "tag": "TE-11205A/B",
     "text": "Температура на выходе печи сжигания серы",
     "cond": {
      "type": "analog",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": true,
      "voting": null,
      "text": "≥ ** °C (любой из двух)"
     }
    },
    {
     "tag": "YL-PP-114.101A и B",
     "text": "Питательные насосы котла-утилизатора",
     "cond": {
      "type": "discrete",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": false,
      "voting": null,
      "text": "оба остановлены"
     }
    }
   ],
   "effects": [
    {
     "tag": "AV-11301",
     "text": "Принудительно закрыть клапан до 0 %: прекратить подачу разбавляющей воды",
     "action": "close"
    },
    {
     "tag": "AV-11302",
     "text": "Принудительно закрыть клапан до 0 %: прекратить подачу разбавляющей воды",
     "action": "close"
    },
    {
     "tag": "HV-11201",
     "text": "Принудительно закрыть клапан до 0 %: прекратить подачу воздуха в печь сжигания серы",
     "action": "close"
    },
    {
     "tag": "PP-11201A",
     "text": "Останов насоса очищенной серы A",
     "action": "stop"
    },
    {
     "tag": "PP-11201B",
     "text": "Останов насоса очищенной серы B",
     "action": "stop"
    }
   ],
   "bypass": "SS-PASS",
   "reset": "PB-REST",
   "manual": "PB-MAN",
   "applied": [
    "FU-11201",
    "PP-12201AB"
   ],
   "equip": [
    "FU-11201",
    "PP-12201AB",
    "EX-11201",
    "BO-11301"
   ],
   "plain": "Печь нельзя держать в работе, если пропало охлаждение, воздух или вода в котле. Любая из девяти причин (воздуходувка встала, мало кислоты на башни, остановились циркуляционные насосы, критичный уровень в барабане котла, перегрев на выходе печи, оба питательных насоса остановились) прекращает подачу серы и воздуха в печь и закрывает воду на разбавление. Блокировка запоминается до сброса.",
   "note": "При высоком уровне в барабане сначала открывается аварийный слив HV-11401 (лист 114), и только если уровень не упал за заданное время, срабатывает останов.",
   "verify": false
  },
  {
   "id": "B-START",
   "sheet": "113",
   "title": "Условия пуска воздуходувки",
   "kind": "start",
   "join": "and",
   "causes": [
    {
     "tag": "PIAS-11367",
     "text": "Давление в коллекторе смазочного масла",
     "cond": {
      "type": "analog",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": true,
      "voting": null,
      "text": "> ** МПа"
     }
    },
    {
     "tag": "TIAS-11365",
     "text": "Температура смазочного масла",
     "cond": {
      "type": "discrete",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": false,
      "voting": null,
      "text": "в норме (* °C)"
     }
    },
    {
     "tag": "LS-11361",
     "text": "Уровень в масляном баке",
     "cond": {
      "type": "discrete",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": false,
      "voting": null,
      "text": "в норме"
     }
    },
    {
     "tag": "FMV-11341",
     "text": "Противопомпажный клапан",
     "cond": {
      "type": "discrete",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": false,
      "voting": null,
      "text": "в положении для пуска"
     }
    },
    {
     "tag": "HV-11302",
     "text": "Клапан воздуха на входе",
     "cond": {
      "type": "discrete",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": false,
      "voting": null,
      "text": "полностью закрыт"
     }
    },
    {
     "tag": "HV-11303",
     "text": "Клапан воздуха на выходе",
     "cond": {
      "type": "discrete",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": false,
      "voting": null,
      "text": "в положении для пуска"
     }
    },
    {
     "tag": "Электросистема",
     "text": "Электросистема, включая преобразователь частоты",
     "cond": {
      "type": "discrete",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": false,
      "voting": null,
      "text": "готова к пуску"
     }
    },
    {
     "tag": "Нагреватель",
     "text": "Стояночный нагреватель двигателя",
     "cond": {
      "type": "discrete",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": false,
      "voting": null,
      "text": "отключён"
     }
    },
    {
     "tag": "Прочее",
     "text": "Охлаждающая вода в норме, проворот завершён и т. п.",
     "cond": {
      "type": "discrete",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": false,
      "voting": null,
      "text": "выполнено"
     }
    }
   ],
   "effects": [
    {
     "tag": "BO-11301",
     "text": "Разрешение на пуск воздуходувки",
     "action": "start"
    }
   ],
   "bypass": null,
   "reset": null,
   "manual": null,
   "applied": [
    "BO-11301"
   ],
   "equip": [
    "BO-11301"
   ],
   "plain": "Воздуходувку нельзя запустить, пока не выполнены все условия: есть давление и нормальная температура масла, в баке достаточно масла, клапаны стоят в пусковом положении, электрическая часть готова. Лист продолжается на следующем листе.",
   "note": "",
   "verify": true
  },
  {
   "id": "B-TRIP",
   "sheet": "113",
   "title": "Аварийный останов воздуходувки по защитам агрегата",
   "kind": "trip",
   "join": "or",
   "causes": [
    {
     "tag": "TIAS-11350~51",
     "text": "Температура подшипников воздуходувки",
     "cond": {
      "type": "analog",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": true,
      "voting": null,
      "text": "≥ * °C"
     }
    },
    {
     "tag": "TIAS-11352~55",
     "text": "Температура подшипников редуктора",
     "cond": {
      "type": "analog",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": true,
      "voting": null,
      "text": "≥ * °C"
     }
    },
    {
     "tag": "VISA-11350~53",
     "text": "Вибрация вала воздуходувки",
     "cond": {
      "type": "analog",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": true,
      "voting": null,
      "text": "≥ * мкм"
     }
    },
    {
     "tag": "TIAS-11356~57",
     "text": "Температура подшипников главного двигателя",
     "cond": {
      "type": "analog",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": true,
      "voting": null,
      "text": "≥ * °C"
     }
    },
    {
     "tag": "TIAS-11358~60",
     "text": "Температура статора главного двигателя",
     "cond": {
      "type": "analog",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": true,
      "voting": null,
      "text": "≥ * °C"
     }
    },
    {
     "tag": "PIAS-11367",
     "text": "Давление в коллекторе смазочного масла",
     "cond": {
      "type": "analog",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": true,
      "voting": null,
      "text": "< * МПа"
     }
    },
    {
     "tag": "PIS-11368",
     "text": "Давление смазочного масла (реле)",
     "cond": {
      "type": "analog",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": true,
      "voting": null,
      "text": "< * МПа"
     }
    }
   ],
   "effects": [
    {
     "tag": "BO-11301",
     "text": "Аварийный останов воздуходувки (trip)",
     "action": "stop"
    },
    {
     "tag": "Противопомпажный клапан",
     "text": "Полностью открывается",
     "action": "open"
    },
    {
     "tag": "Частота",
     "text": "Снижение частоты и останов",
     "action": "info"
    }
   ],
   "bypass": null,
   "reset": "RESET",
   "manual": null,
   "applied": [
    "BO-11301"
   ],
   "equip": [
    "BO-11301"
   ],
   "plain": "Агрегат останавливается сам, если перегреваются подшипники, двигатель или статор, растёт вибрация вала, или падает давление масла. Каждый из этих сигналов выводится оператору тревогой.",
   "note": "После останова масляный насос работает до полного охлаждения подшипников, затем его останавливают вручную.",
   "verify": true
  },
  {
   "id": "B-OIL",
   "sheet": "113",
   "title": "Падение давления масла: пуск резервного масляного насоса",
   "kind": "start",
   "join": "or",
   "causes": [
    {
     "tag": "PIAS-11367",
     "text": "Давление в коллекторе смазочного масла",
     "cond": {
      "type": "analog",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": true,
      "voting": null,
      "text": "< * МПа"
     }
    }
   ],
   "effects": [
    {
     "tag": "Резервный масляный насос",
     "text": "Пуск резервного масляного насоса",
     "action": "start"
    }
   ],
   "bypass": "SS-PASS",
   "reset": "PB-REST",
   "manual": "PB-MAN",
   "applied": [
    "BO-11301"
   ],
   "equip": [
    "BO-11301"
   ],
   "plain": "Если давление масла в воздуходувке падает ниже уставки, сам включается резервный масляный насос.",
   "note": "",
   "verify": false
  },
  {
   "id": "B-HEAT",
   "sheet": "113",
   "title": "Низкий уровень в масляном баке: запрет маслоподогревателя",
   "kind": "stop",
   "join": "or",
   "causes": [
    {
     "tag": "LS-11361",
     "text": "Реле уровня в масляном баке",
     "cond": {
      "type": "discrete",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": false,
      "voting": null,
      "text": "уровень ниже нормы"
     }
    }
   ],
   "effects": [
    {
     "tag": "Маслоподогреватель",
     "text": "Запрет пуска маслоподогревателя",
     "action": "forbid"
    }
   ],
   "bypass": "SS-PASS",
   "reset": "PB-REST",
   "manual": "PB-MAN",
   "applied": [
    "BO-11301"
   ],
   "equip": [
    "BO-11301"
   ],
   "plain": "Если масла в баке мало, электроподогреватель масла включить нельзя: он перегреется без жидкости.",
   "note": "",
   "verify": true
  },
  {
   "id": "B-P301",
   "sheet": "113",
   "title": "Защита насоса сушильной башни",
   "kind": "stop",
   "join": "or",
   "causes": [
    {
     "tag": "TE-PP11301",
     "text": "Температура насоса сушильной башни",
     "cond": {
      "type": "analog",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": true,
      "voting": null,
      "text": "> ** °C"
     }
    },
    {
     "tag": "VT-PP-11301",
     "text": "Вибрация насоса сушильной башни",
     "cond": {
      "type": "analog",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": true,
      "voting": null,
      "text": "> ** мм/с"
     }
    }
   ],
   "effects": [
    {
     "tag": "PP-11301",
     "text": "Циркуляционный кислотный насос сушильной башни",
     "action": "stop"
    }
   ],
   "bypass": "SS-PASS",
   "reset": "HS-RESET",
   "manual": "HS-SET",
   "applied": [
    "PP-11301"
   ],
   "equip": [
    "PP-11301"
   ],
   "plain": "Насос останавливается, если он перегрелся или сильно вибрирует.",
   "note": "",
   "verify": false
  },
  {
   "id": "B-P302",
   "sheet": "113",
   "title": "Защита насоса 1-й абсорбции",
   "kind": "stop",
   "join": "or",
   "causes": [
    {
     "tag": "TE-PP11302",
     "text": "Температура насоса 1-й абсорбции",
     "cond": {
      "type": "analog",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": true,
      "voting": null,
      "text": "> ** °C"
     }
    },
    {
     "tag": "VT-PP-11302",
     "text": "Вибрация насоса 1-й абсорбции",
     "cond": {
      "type": "analog",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": true,
      "voting": null,
      "text": "> ** мм/с"
     }
    }
   ],
   "effects": [
    {
     "tag": "PP-11302",
     "text": "Циркуляционный кислотный насос башни 1-й абсорбции",
     "action": "stop"
    }
   ],
   "bypass": "SS-PASS",
   "reset": "HS-RESET",
   "manual": "HS-SET",
   "applied": [
    "PP-11302"
   ],
   "equip": [
    "PP-11302"
   ],
   "plain": "Насос останавливается, если он перегрелся или сильно вибрирует.",
   "note": "",
   "verify": false
  },
  {
   "id": "B-P303",
   "sheet": "113",
   "title": "Защита насоса 2-й абсорбции",
   "kind": "stop",
   "join": "or",
   "causes": [
    {
     "tag": "TE-PP11303",
     "text": "Температура насоса 2-й абсорбции",
     "cond": {
      "type": "analog",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": true,
      "voting": null,
      "text": "> ** °C"
     }
    },
    {
     "tag": "VT-PP-11303",
     "text": "Вибрация насоса 2-й абсорбции",
     "cond": {
      "type": "analog",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": true,
      "voting": null,
      "text": "> ** мм/с"
     }
    }
   ],
   "effects": [
    {
     "tag": "PP-11303",
     "text": "Циркуляционный кислотный насос башни 2-й абсорбции",
     "action": "stop"
    }
   ],
   "bypass": "SS-PASS",
   "reset": "HS-RESET",
   "manual": "HS-SET",
   "applied": [
    "PP-11303"
   ],
   "equip": [
    "PP-11303"
   ],
   "plain": "Насос останавливается, если он перегрелся или сильно вибрирует.",
   "note": "",
   "verify": false
  },
  {
   "id": "B-PROC",
   "sheet": "113",
   "title": "Аварийный останов воздуходувки по технологическим причинам",
   "kind": "trip",
   "join": "or",
   "causes": [
    {
     "tag": "FT-11302",
     "text": "Расход кислоты на сушильную башню",
     "cond": {
      "type": "analog",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": true,
      "voting": null,
      "text": "ниже ** м³/ч"
     }
    },
    {
     "tag": "FT-11303",
     "text": "Расход кислоты на башню 2-й абсорбции",
     "cond": {
      "type": "analog",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": true,
      "voting": null,
      "text": "ниже ** м³/ч"
     }
    },
    {
     "tag": "YL-PP-11301",
     "text": "Работа насоса сушильной башни",
     "cond": {
      "type": "discrete",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": false,
      "voting": null,
      "text": "остановлен"
     }
    },
    {
     "tag": "YL-PP-11303",
     "text": "Работа насоса 2-й абсорбции",
     "cond": {
      "type": "discrete",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": false,
      "voting": null,
      "text": "остановлен"
     }
    },
    {
     "tag": "LT-11401A/B/C",
     "text": "Уровень в барабане котла-утилизатора",
     "cond": {
      "type": "analog",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": true,
      "voting": {
       "k": 2,
       "n": 3
      },
      "text": "2 из 3 ≥ ** мм (после аварийного слива) или ≤ ** мм"
     }
    },
    {
     "tag": "YL-PP-114.101A и B",
     "text": "Питательные насосы котла-утилизатора",
     "cond": {
      "type": "discrete",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": false,
      "voting": null,
      "text": "оба остановлены"
     }
    },
    {
     "tag": "VT-BO-11301 / TE-BO-11301",
     "text": "Вибрация и температура воздуходувки",
     "cond": {
      "type": "analog",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": true,
      "voting": null,
      "text": "≥ ※ или < ※"
     }
    }
   ],
   "effects": [
    {
     "tag": "YSS-BO-11301",
     "text": "Аварийный останов главного воздушного вентилятора",
     "action": "stop"
    }
   ],
   "bypass": "SS-PASS",
   "reset": "PB-REST",
   "manual": "PB-MAN",
   "applied": [
    "BO-11301"
   ],
   "equip": [
    "BO-11301",
    "PP-11301",
    "PP-11303",
    "EX-11201"
   ],
   "plain": "Воздуходувка (BO-11301) останавливается, если нет охлаждения кислотой (мало расхода или встали насосы), опасный уровень в барабане котла, остановились оба питательных насоса или опасно выросла вибрация и температура самой воздуходувки.",
   "note": "",
   "verify": false
  },
  {
   "id": "H-LEVEL",
   "sheet": "114",
   "title": "Высокий уровень в барабане котла: аварийный слив",
   "kind": "valve",
   "join": "2oo3",
   "causes": [
    {
     "tag": "LIAS-11401A/B/C",
     "text": "Уровень в барабане котла-утилизатора",
     "cond": {
      "type": "analog",
      "op": ">",
      "value": 150,
      "unit": "мм",
      "setpointUnknown": false,
      "voting": {
       "k": 2,
       "n": 3
      },
      "text": "2 из 3 выше 150 мм"
     }
    }
   ],
   "effects": [
    {
     "tag": "HV-11401",
     "text": "Принудительно открыть клапан до 100 %: аварийный слив воды из котла",
     "action": "open"
    }
   ],
   "bypass": "SS-PASS",
   "reset": "PB-REST",
   "manual": "PB-MAN",
   "applied": [],
   "equip": [
    "EX-11201"
   ],
   "plain": "Когда два из трёх датчиков показывают уровень в барабане котла выше 150 мм, клапан HV-11401 открывается на 100 % и вода аварийно сливается. Когда уровень вернулся к 0 мм (2 из 3), клапан принудительно закрывается. Оператор может открыть слив вручную кнопкой.",
   "note": "Слив закрывается автоматически, когда уровень вернулся (0 мм по 2 из 3 датчиков). Клапан находится на месте.",
   "verify": false
  },
  {
   "id": "H-P1405",
   "sheet": "114",
   "title": "Давление пара в барабане: продувка",
   "kind": "valve",
   "join": "or",
   "causes": [
    {
     "tag": "PT-11405",
     "text": "Давление в паровом барабане котла-утилизатора",
     "cond": {
      "type": "analog",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": true,
      "voting": null,
      "text": "выше или ниже уставки *"
     }
    }
   ],
   "effects": [
    {
     "tag": "HV-11402",
     "text": "Регулирующий клапан продувки парового барабана (сигнал 4…20 мА: 20 мА открыть, 4 мА закрыть)",
     "action": "switch"
    }
   ],
   "bypass": "SS-PASS",
   "reset": "PB-REST",
   "manual": null,
   "applied": [],
   "equip": [
    "EX-11201",
    "VE-11401"
   ],
   "plain": "Автоматика держит клапан продувки парового барабана в нужном положении по давлению в барабане: открывает при превышении уставки и закрывает при её снижении.",
   "note": "",
   "verify": true
  },
  {
   "id": "H-P1407",
   "sheet": "114",
   "title": "Давление в паросборном коллекторе: сброс",
   "kind": "valve",
   "join": "or",
   "causes": [
    {
     "tag": "PT-11407",
     "text": "Давление в газосборном (паросборном) коллекторе",
     "cond": {
      "type": "analog",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": true,
      "voting": null,
      "text": "выше или ниже уставки *"
     }
    }
   ],
   "effects": [
    {
     "tag": "HV-11103",
     "text": "Регулирующий клапан сброса паросборного коллектора (4…20 мА)",
     "action": "switch"
    }
   ],
   "bypass": "SS-PASS",
   "reset": "PB-REST",
   "manual": null,
   "applied": [],
   "equip": [
    "XX-11403"
   ],
   "plain": "Клапан сброса коллектора открывается при превышении давления и закрывается при его снижении.",
   "note": "",
   "verify": true
  },
  {
   "id": "I-108A",
   "sheet": "114.1",
   "title": "Защита питательного насоса A по температуре",
   "kind": "stop",
   "join": "or",
   "causes": [
    {
     "tag": "PP-114.101A-TE-07",
     "text": "Подшипник радиальный, вход насоса",
     "cond": {
      "type": "analog",
      "op": ">",
      "value": 100,
      "unit": "°C",
      "setpointUnknown": false,
      "voting": null,
      "text": "> 100 °C"
     }
    },
    {
     "tag": "PP-114.101A-TE-08",
     "text": "Подшипник радиальный, выход насоса",
     "cond": {
      "type": "analog",
      "op": ">",
      "value": 100,
      "unit": "°C",
      "setpointUnknown": false,
      "voting": null,
      "text": "> 100 °C"
     }
    },
    {
     "tag": "PP-114.101A-TE-09",
     "text": "Подшипник электродвигателя, приводной конец",
     "cond": {
      "type": "analog",
      "op": ">",
      "value": 95,
      "unit": "°C",
      "setpointUnknown": false,
      "voting": null,
      "text": "> 95 °C"
     }
    },
    {
     "tag": "PP-114.101A-TE-10",
     "text": "Подшипник электродвигателя, неприводной конец",
     "cond": {
      "type": "analog",
      "op": ">",
      "value": 95,
      "unit": "°C",
      "setpointUnknown": false,
      "voting": null,
      "text": "> 95 °C"
     }
    },
    {
     "tag": "PP-114.101A-TE-01…06",
     "text": "Обмотка статора электродвигателя (6 точек)",
     "cond": {
      "type": "analog",
      "op": ">",
      "value": 130,
      "unit": "°C",
      "setpointUnknown": false,
      "voting": null,
      "text": "> 130 °C"
     }
    }
   ],
   "effects": [
    {
     "tag": "PP-114.101A",
     "text": "Останов насоса питательной воды A",
     "action": "stop"
    }
   ],
   "bypass": "SS-PASS",
   "reset": "PB-REST",
   "manual": "PB-MAN",
   "applied": [
    "PP-114.101AB"
   ],
   "equip": [
    "PP-114.101AB"
   ],
   "plain": "Если любой подшипник насоса или двигателя нагрелся выше нормы (95 или 100 °C) или обмотка статора выше 130 °C, питательный насос A останавливается.",
   "note": "",
   "verify": false
  },
  {
   "id": "I-108B",
   "sheet": "114.1",
   "title": "Защита питательного насоса B по температуре",
   "kind": "stop",
   "join": "or",
   "causes": [
    {
     "tag": "PP-114.101B-TE-07",
     "text": "Подшипник радиальный, вход насоса",
     "cond": {
      "type": "analog",
      "op": ">",
      "value": 100,
      "unit": "°C",
      "setpointUnknown": false,
      "voting": null,
      "text": "> 100 °C"
     }
    },
    {
     "tag": "PP-114.101B-TE-08",
     "text": "Подшипник радиальный, выход насоса",
     "cond": {
      "type": "analog",
      "op": ">",
      "value": 100,
      "unit": "°C",
      "setpointUnknown": false,
      "voting": null,
      "text": "> 100 °C"
     }
    },
    {
     "tag": "PP-114.101B-TE-09",
     "text": "Подшипник электродвигателя, приводной конец",
     "cond": {
      "type": "analog",
      "op": ">",
      "value": 95,
      "unit": "°C",
      "setpointUnknown": false,
      "voting": null,
      "text": "> 95 °C"
     }
    },
    {
     "tag": "PP-114.101B-TE-10",
     "text": "Подшипник электродвигателя, неприводной конец",
     "cond": {
      "type": "analog",
      "op": ">",
      "value": 95,
      "unit": "°C",
      "setpointUnknown": false,
      "voting": null,
      "text": "> 95 °C"
     }
    },
    {
     "tag": "PP-114.101B-TE-01…06",
     "text": "Обмотка статора электродвигателя (6 точек)",
     "cond": {
      "type": "analog",
      "op": ">",
      "value": 130,
      "unit": "°C",
      "setpointUnknown": false,
      "voting": null,
      "text": "> 130 °C"
     }
    }
   ],
   "effects": [
    {
     "tag": "PP-114.101B",
     "text": "Останов насоса питательной воды B",
     "action": "stop"
    }
   ],
   "bypass": "SS-PASS",
   "reset": "PB-REST",
   "manual": "PB-MAN",
   "applied": [
    "PP-114.101AB"
   ],
   "equip": [
    "PP-114.101AB"
   ],
   "plain": "То же для питательного насоса B: перегрев подшипника или обмотки останавливает насос.",
   "note": "",
   "verify": false
  },
  {
   "id": "D-LEVEL",
   "sheet": "114.1",
   "title": "Высокий уровень в деаэраторе: слив",
   "kind": "valve",
   "join": "or",
   "causes": [
    {
     "tag": "LIAS-114.151B",
     "text": "Уровень в деаэраторной ёмкости",
     "cond": {
      "type": "analog",
      "op": ">",
      "value": 950,
      "unit": "мм",
      "setpointUnknown": false,
      "voting": null,
      "text": "> 950 мм"
     }
    }
   ],
   "effects": [
    {
     "tag": "LSV-114.151B",
     "text": "Дренажный клапан деаэратора (подача питания: открыть, отключение: закрыть)",
     "action": "open"
    }
   ],
   "bypass": "SS-PASS",
   "reset": "PB-REST",
   "manual": "PB-MAN",
   "applied": [],
   "equip": [
    "DA-114.101"
   ],
   "plain": "Если уровень воды в деаэраторе поднялся выше 950 мм, открывается дренажный клапан и лишняя вода сливается.",
   "note": "",
   "verify": true
  },
  {
   "id": "I-12203",
   "sheet": "122",
   "title": "Загрязнён конденсат: переключение клапана",
   "kind": "valve",
   "join": "or",
   "causes": [
    {
     "tag": "CIAS-12203A",
     "text": "Электропроводность конденсата в коллекторе на участок плавления серы",
     "cond": {
      "type": "analog",
      "op": ">=",
      "value": 0.3,
      "unit": "мкСм/см",
      "setpointUnknown": false,
      "voting": null,
      "text": "≥ 0,3 мкСм/см"
     }
    },
    {
     "tag": "CIAS-12203B",
     "text": "То же (второй датчик)",
     "cond": {
      "type": "analog",
      "op": ">=",
      "value": 0.3,
      "unit": "мкСм/см",
      "setpointUnknown": false,
      "voting": null,
      "text": "≥ 0,3 мкСм/см"
     }
    }
   ],
   "effects": [
    {
     "tag": "CSV-12203",
     "text": "Подача конденсата в подземный резервуар фильтрации участка плавления серы: клапан переключает направление",
     "action": "switch"
    }
   ],
   "bypass": "SS-PASS",
   "reset": "PB-REST",
   "manual": "PB-MAN",
   "applied": [],
   "equip": [
    "VE-12203",
    "PP-12202AB",
    "VE-11102"
   ],
   "plain": "Если любой из двух датчиков показывает, что конденсат загрязнился (электропроводность 0,3 мкСм/см и выше), клапан CSV-12203 переключает направление, и такой конденсат не идёт на плавление серы.",
   "note": "",
   "verify": true
  },
  {
   "id": "I-13101",
   "sheet": "131",
   "title": "Уровень в резервуаре исходной воды",
   "kind": "valve",
   "join": "or",
   "causes": [
    {
     "tag": "LIAS-13101",
     "text": "Уровень в резервуаре исходной воды",
     "cond": {
      "type": "analog",
      "op": "<=",
      "value": 500,
      "unit": "мм",
      "setpointUnknown": false,
      "voting": null,
      "text": "≤ 500 мм: открыть клапан"
     }
    },
    {
     "tag": "LIAS-13101",
     "text": "Уровень в резервуаре исходной воды",
     "cond": {
      "type": "analog",
      "op": ">=",
      "value": 3900,
      "unit": "мм",
      "setpointUnknown": false,
      "voting": null,
      "text": "≥ 3900 мм: закрыть клапан"
     }
    }
   ],
   "effects": [
    {
     "tag": "LSV-13101",
     "text": "Электроприводной клапан трубопровода исходной воды (местное управление)",
     "action": "switch"
    }
   ],
   "bypass": "SS-PASS",
   "reset": "PB-REST",
   "manual": null,
   "applied": [],
   "equip": [
    "WT-RW"
   ],
   "plain": "Резервуар сам себя пополняет: при низком уровне (не выше 500 мм) клапан на трубе исходной воды открывается, при высоком (не ниже 3900 мм) закрывается.",
   "note": "",
   "verify": false
  },
  {
   "id": "I-13301",
   "sheet": "133",
   "title": "Уровень в бассейне оборотной воды (сернокислотное производство)",
   "kind": "valve",
   "join": "or",
   "causes": [
    {
     "tag": "LIAS-13301",
     "text": "Уровень в бассейне циркуляционной воды",
     "cond": {
      "type": "analog",
      "op": "<=",
      "value": 500,
      "unit": "мм",
      "setpointUnknown": false,
      "voting": null,
      "text": "≤ 500 мм: открыть клапан"
     }
    },
    {
     "tag": "LIAS-13301",
     "text": "Уровень в бассейне циркуляционной воды",
     "cond": {
      "type": "analog",
      "op": ">=",
      "value": 2900,
      "unit": "мм",
      "setpointUnknown": false,
      "voting": null,
      "text": "≥ 2900 мм: закрыть клапан"
     }
    }
   ],
   "effects": [
    {
     "tag": "LSV-13301",
     "text": "Электроприводной клапан подпиточного трубопровода (местное управление)",
     "action": "switch"
    }
   ],
   "bypass": "SS-PASS",
   "reset": "PB-REST",
   "manual": null,
   "applied": [],
   "equip": [
    "CT-13301A/B"
   ],
   "plain": "Бассейн градирни подпитывается автоматически: при низком уровне (не выше 500 мм) подпиточный клапан открывается, при высоком (не ниже 2900 мм) закрывается.",
   "note": "",
   "verify": false
  },
  {
   "id": "I-13401",
   "sheet": "134",
   "title": "Уровень в бассейне оборотной воды (электростанция)",
   "kind": "valve",
   "join": "or",
   "causes": [
    {
     "tag": "LIAS-13401",
     "text": "Уровень в бассейне циркуляционной воды",
     "cond": {
      "type": "analog",
      "op": "<=",
      "value": 500,
      "unit": "мм",
      "setpointUnknown": false,
      "voting": null,
      "text": "≤ 500 мм: открыть клапан"
     }
    },
    {
     "tag": "LIAS-13401",
     "text": "Уровень в бассейне циркуляционной воды",
     "cond": {
      "type": "analog",
      "op": ">=",
      "value": 2900,
      "unit": "мм",
      "setpointUnknown": false,
      "voting": null,
      "text": "≥ 2900 мм: закрыть клапан"
     }
    }
   ],
   "effects": [
    {
     "tag": "LSV-13401",
     "text": "Электроприводной клапан подпиточного трубопровода (местное управление)",
     "action": "switch"
    }
   ],
   "bypass": "SS-PASS",
   "reset": "PB-REST",
   "manual": null,
   "applied": [],
   "equip": [
    "CT-13401A/B"
   ],
   "plain": "Бассейн градирни электростанции подпитывается так же: открывается при 500 мм и ниже, закрывается при 2900 мм и выше.",
   "note": "",
   "verify": false
  },
  {
   "id": "T-01",
   "sheet": "115",
   "title": "Низкое давление масла: пуск насосов смазки",
   "kind": "start",
   "join": "or",
   "causes": [
    {
     "tag": "PS3211",
     "text": "Давление масла на выходе главного масляного насоса",
     "cond": {
      "type": "analog",
      "op": "<=",
      "value": 850,
      "unit": "кПа",
      "setpointUnknown": false,
      "voting": null,
      "text": "упало до 850 кПа"
     }
    },
    {
     "tag": "PS3200A/B",
     "text": "Давление смазочного масла",
     "cond": {
      "type": "analog",
      "op": "<=",
      "value": 40,
      "unit": "кПа",
      "setpointUnknown": false,
      "voting": null,
      "text": "упало до 40 кПа"
     }
    },
    {
     "tag": "PS3200C",
     "text": "Давление смазочного масла",
     "cond": {
      "type": "analog",
      "op": "<=",
      "value": 30,
      "unit": "кПа",
      "setpointUnknown": false,
      "voting": null,
      "text": "упало до 30 кПа"
     }
    }
   ],
   "effects": [
    {
     "tag": "PP-11504",
     "text": "Пуск масляного насоса высокого давления (850 кПа)",
     "action": "start"
    },
    {
     "tag": "PP-11505",
     "text": "Пуск насоса смазочного масла переменного тока (40 кПа)",
     "action": "start"
    },
    {
     "tag": "PP-11506",
     "text": "Пуск аварийного насоса смазки постоянного тока (30 кПа)",
     "action": "start"
    }
   ],
   "bypass": null,
   "reset": null,
   "manual": null,
   "applied": [
    "PP-11504",
    "PP-11505",
    "PP-11506"
   ],
   "equip": [
    "ST-11501",
    "PP-11504",
    "PP-11505",
    "PP-11506",
    "TK-11504"
   ],
   "plain": "Чем ниже падает давление масла, тем больше резервных насосов включается: при 850 кПа на выходе главного насоса включается насос высокого давления, при 40 кПа смазки насос переменного тока, при 30 кПа аварийный насос постоянного тока. Одновременно сигнализация низкого давления. Режим: автоматический или ручной.",
   "note": "",
   "verify": true
  },
  {
   "id": "T-02",
   "sheet": "115",
   "title": "Критически низкое давление смазки: останов турбины",
   "kind": "trip",
   "join": "2oo3",
   "causes": [
    {
     "tag": "PS3200D~F",
     "text": "Давление смазочного масла (3 датчика)",
     "cond": {
      "type": "discrete",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": false,
      "voting": null,
      "text": "низкое, 2 из 3"
     }
    }
   ],
   "effects": [
    {
     "tag": "ST-11501",
     "text": "Останов турбины, срабатывает электромагнитный клапан останова",
     "action": "stop"
    }
   ],
   "bypass": null,
   "reset": "RESET",
   "manual": null,
   "applied": [
    "ST-11501"
   ],
   "equip": [
    "ST-11501"
   ],
   "plain": "Если масла для смазки подшипников не хватает (два датчика из трёх), турбина аварийно останавливается.",
   "note": "",
   "verify": false
  },
  {
   "id": "T-03",
   "sheet": "115",
   "title": "Валоповорот: запрет при низком давлении масла",
   "kind": "stop",
   "join": "or",
   "causes": [
    {
     "tag": "PS3200G",
     "text": "Давление смазочного масла",
     "cond": {
      "type": "discrete",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": false,
      "voting": null,
      "text": "ниже допустимого (включение при выше 0,015 МПа)"
     }
    }
   ],
   "effects": [
    {
     "tag": "Поворотное устройство",
     "text": "Запрет включения поворотного устройства; остановка при падении давления",
     "action": "forbid"
    }
   ],
   "bypass": null,
   "reset": null,
   "manual": null,
   "applied": [
    "ST-11501"
   ],
   "equip": [
    "ST-11501"
   ],
   "plain": "Валоповоротное устройство нельзя включить, пока давление смазки не поднялось выше 0,015 МПа, и оно отключается, если давление падает.",
   "note": "",
   "verify": true
  },
  {
   "id": "T-04",
   "sheet": "115",
   "title": "Перегрев подшипников турбины и генератора",
   "kind": "trip",
   "join": "or",
   "causes": [
    {
     "tag": "TE4200 A~H",
     "text": "Температура колодок упорного подшипника (8 датчиков)",
     "cond": {
      "type": "discrete",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": false,
      "voting": null,
      "text": "высокая"
     }
    },
    {
     "tag": "TE4201 A~B",
     "text": "Вкладыш переднего подшипника турбины",
     "cond": {
      "type": "discrete",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": false,
      "voting": null,
      "text": "высокая"
     }
    },
    {
     "tag": "TE4203 A~B",
     "text": "Вкладыш заднего подшипника турбины",
     "cond": {
      "type": "discrete",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": false,
      "voting": null,
      "text": "высокая"
     }
    },
    {
     "tag": "TE4204 A~B",
     "text": "Вкладыши подшипников генератора",
     "cond": {
      "type": "discrete",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": false,
      "voting": null,
      "text": "высокая"
     }
    }
   ],
   "effects": [
    {
     "tag": "Сигнал",
     "text": "Сигнализация высокой температуры",
     "action": "info"
    },
    {
     "tag": "ST-11501",
     "text": "Останов турбины при дальнейшем росте температуры",
     "action": "stop"
    }
   ],
   "bypass": null,
   "reset": "RESET",
   "manual": null,
   "applied": [
    "ST-11501"
   ],
   "equip": [
    "ST-11501",
    "HG-11501"
   ],
   "plain": "Датчики температуры стоят на подшипниках турбины и генератора. Сначала оператору приходит тревога, при превышении второй уставки турбина останавливается. Числа уставок в руководстве производителя.",
   "note": "",
   "verify": false
  },
  {
   "id": "T-05",
   "sheet": "115",
   "title": "Перегрев сливного масла подшипников",
   "kind": "trip",
   "join": "or",
   "causes": [
    {
     "tag": "TIE4100~4103",
     "text": "Температура масла на сливе подшипников турбины и генератора",
     "cond": {
      "type": "discrete",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": false,
      "voting": null,
      "text": "высокая"
     }
    }
   ],
   "effects": [
    {
     "tag": "Сигнал",
     "text": "Сигнализация высокой температуры сливного масла",
     "action": "info"
    },
    {
     "tag": "ST-11501",
     "text": "Останов при дальнейшем росте температуры",
     "action": "stop"
    }
   ],
   "bypass": null,
   "reset": "RESET",
   "manual": null,
   "applied": [
    "ST-11501"
   ],
   "equip": [
    "ST-11501",
    "EX-11504AB"
   ],
   "plain": "Слишком горячее масло на сливе из подшипников сначала подаёт тревогу, потом останавливает турбину.",
   "note": "",
   "verify": false
  },
  {
   "id": "T-06",
   "sheet": "115",
   "title": "Уровень масла в баке",
   "kind": "trip",
   "join": "2oo3",
   "causes": [
    {
     "tag": "LI6105",
     "text": "Уровень масла в масляном баке (3 датчика)",
     "cond": {
      "type": "discrete",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": false,
      "voting": null,
      "text": "высокий / низкий / очень низкий"
     }
    }
   ],
   "effects": [
    {
     "tag": "Сигнал",
     "text": "Сигнализация высокого и низкого уровня",
     "action": "info"
    },
    {
     "tag": "ST-11501",
     "text": "Останов при очень низком уровне",
     "action": "stop"
    }
   ],
   "bypass": null,
   "reset": null,
   "manual": null,
   "applied": [
    "ST-11501"
   ],
   "equip": [
    "ST-11501",
    "TK-11504"
   ],
   "plain": "За уровнем масла в баке следят три датчика. Высокий и низкий уровень дают тревогу, очень низкий (по 2 из 3) останавливает турбину.",
   "note": "",
   "verify": false
  },
  {
   "id": "T-07",
   "sheet": "115",
   "title": "Превышение частоты вращения",
   "kind": "trip",
   "join": "2oo3",
   "causes": [
    {
     "tag": "SE5102",
     "text": "Частота вращения турбины",
     "cond": {
      "type": "discrete",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": false,
      "voting": null,
      "text": "высокая, 2 из 3"
     }
    }
   ],
   "effects": [
    {
     "tag": "Сигнал",
     "text": "Сигнализация высокой частоты вращения",
     "action": "info"
    },
    {
     "tag": "ST-11501",
     "text": "Останов по высокой частоте вращения",
     "action": "stop"
    }
   ],
   "bypass": null,
   "reset": "RESET",
   "manual": null,
   "applied": [
    "ST-11501"
   ],
   "equip": [
    "ST-11501"
   ],
   "plain": "Если турбина «разгоняется» выше допустимого (подтверждают два датчика из трёх), она аварийно останавливается.",
   "note": "",
   "verify": false
  },
  {
   "id": "T-08",
   "sheet": "115",
   "title": "Осевой сдвиг ротора",
   "kind": "trip",
   "join": "2oo3",
   "causes": [
    {
     "tag": "ZE5140",
     "text": "Осевое смещение ротора турбины",
     "cond": {
      "type": "discrete",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": false,
      "voting": null,
      "text": "большое"
     }
    }
   ],
   "effects": [
    {
     "tag": "Сигнал",
     "text": "Сигнализация большого осевого смещения",
     "action": "info"
    },
    {
     "tag": "ST-11501",
     "text": "Останов по большому осевому смещению",
     "action": "stop"
    }
   ],
   "bypass": null,
   "reset": "RESET",
   "manual": null,
   "applied": [
    "ST-11501"
   ],
   "equip": [
    "ST-11501"
   ],
   "plain": "Если ротор сдвинулся вдоль оси больше допустимого, сначала тревога, потом остановка, чтобы не задеть лопатки.",
   "note": "",
   "verify": false
  },
  {
   "id": "T-09",
   "sheet": "115",
   "title": "Вибрация валов турбины и генератора",
   "kind": "trip",
   "join": "2oo3",
   "causes": [
    {
     "tag": "VE5190~5193-XY",
     "text": "Вибрация переднего и заднего подшипников турбины и генератора",
     "cond": {
      "type": "discrete",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": false,
      "voting": null,
      "text": "высокая"
     }
    }
   ],
   "effects": [
    {
     "tag": "Сигнал",
     "text": "Сигнализация высокой вибрации подшипника",
     "action": "info"
    },
    {
     "tag": "ST-11501",
     "text": "Останов по высокой вибрации подшипника",
     "action": "stop"
    }
   ],
   "bypass": null,
   "reset": "RESET",
   "manual": null,
   "applied": [
    "ST-11501"
   ],
   "equip": [
    "ST-11501",
    "HG-11501"
   ],
   "plain": "Датчики вибрации стоят на четырёх подшипниках. Высокая вибрация даёт тревогу, а опасная останавливает турбину.",
   "note": "",
   "verify": false
  },
  {
   "id": "T-10",
   "sheet": "115",
   "title": "Давление производственного отбора пара",
   "kind": "trip",
   "join": "2oo3",
   "causes": [
    {
     "tag": "PS1201A/B/C~E",
     "text": "Давление пара производственного отбора",
     "cond": {
      "type": "discrete",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": false,
      "voting": null,
      "text": "низкое / высокое"
     }
    }
   ],
   "effects": [
    {
     "tag": "Сигнал",
     "text": "Сигнализация низкого и высокого давления",
     "action": "info"
    },
    {
     "tag": "ST-11501",
     "text": "Останов по высокому давлению отбора",
     "action": "stop"
    },
    {
     "tag": "ZS6304",
     "text": "Клапан отбора пара: положение (закрыт)",
     "action": "info"
    }
   ],
   "bypass": null,
   "reset": null,
   "manual": null,
   "applied": [
    "ST-11501"
   ],
   "equip": [
    "ST-11501"
   ],
   "plain": "Давление в отборе пара для производства контролируется: слишком высокое останавливает турбину, низкое и высокое дают тревогу.",
   "note": "",
   "verify": false
  },
  {
   "id": "T-11",
   "sheet": "115",
   "title": "Вакуум в конденсаторе",
   "kind": "trip",
   "join": "or",
   "causes": [
    {
     "tag": "PS1200A",
     "text": "Вакуум в конденсаторе",
     "cond": {
      "type": "discrete",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": false,
      "voting": null,
      "text": "низкий"
     }
    },
    {
     "tag": "PS1200B~D",
     "text": "Вакуум в конденсаторе",
     "cond": {
      "type": "discrete",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": false,
      "voting": null,
      "text": "низкий, 2 из 3"
     }
    }
   ],
   "effects": [
    {
     "tag": "Сигнал",
     "text": "Сигнализация низкого вакуума",
     "action": "info"
    },
    {
     "tag": "ST-11501",
     "text": "Останов по низкому вакууму",
     "action": "stop"
    }
   ],
   "bypass": null,
   "reset": null,
   "manual": null,
   "applied": [
    "ST-11501"
   ],
   "equip": [
    "ST-11501",
    "EX-11501"
   ],
   "plain": "Если вакуум в конденсаторе пропал, турбине некуда сбрасывать пар. Сначала тревога, затем останов.",
   "note": "",
   "verify": false
  },
  {
   "id": "T-12",
   "sheet": "115",
   "title": "Уровни воды: охладитель уплотнений и конденсатосборник",
   "kind": "alarm",
   "join": "or",
   "causes": [
    {
     "tag": "LS6103",
     "text": "Уровень воды в охладителе уплотнений",
     "cond": {
      "type": "discrete",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": false,
      "voting": null,
      "text": "высокий"
     }
    },
    {
     "tag": "LI6104",
     "text": "Уровень в конденсатосборнике",
     "cond": {
      "type": "discrete",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": false,
      "voting": null,
      "text": "высокий / низкий"
     }
    }
   ],
   "effects": [
    {
     "tag": "Сигнал",
     "text": "Сигнализация высокого или низкого уровня",
     "action": "info"
    }
   ],
   "bypass": null,
   "reset": null,
   "manual": null,
   "applied": [],
   "equip": [
    "EX-11501",
    "EX-11503"
   ],
   "plain": "Только тревога оператору: уровни воды в охладителе уплотнений и в конденсатосборнике вышли за норму.",
   "note": "",
   "verify": false
  },
  {
   "id": "T-13",
   "sheet": "115",
   "title": "Температура выхлопной камеры и разность температур корпуса",
   "kind": "alarm",
   "join": "or",
   "causes": [
    {
     "tag": "TE2140",
     "text": "Температура выхлопной камеры",
     "cond": {
      "type": "discrete",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": false,
      "voting": null,
      "text": "высокая"
     }
    },
    {
     "tag": "TE2110/2111/2120/2121",
     "text": "Разность температур верха и низа корпуса, внутренней и наружной стенок фланца",
     "cond": {
      "type": "discrete",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": false,
      "voting": null,
      "text": "большая"
     }
    }
   ],
   "effects": [
    {
     "tag": "Сигнал",
     "text": "Сигнализация",
     "action": "info"
    }
   ],
   "bypass": null,
   "reset": null,
   "manual": null,
   "applied": [],
   "equip": [
    "ST-11501"
   ],
   "plain": "Датчики температуры выхлопа и разности температур корпуса (перекос при прогреве) дают только тревогу.",
   "note": "",
   "verify": false
  },
  {
   "id": "T-14",
   "sheet": "115",
   "title": "Засорение масляных фильтров",
   "kind": "alarm",
   "join": "or",
   "causes": [
    {
     "tag": "PD6500~6504",
     "text": "Перепад давления на масляных фильтрах",
     "cond": {
      "type": "discrete",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": false,
      "voting": null,
      "text": "высокий"
     }
    }
   ],
   "effects": [
    {
     "tag": "Сигнал",
     "text": "Сигнализация высокого перепада давления на фильтре",
     "action": "info"
    }
   ],
   "bypass": null,
   "reset": null,
   "manual": null,
   "applied": [],
   "equip": [
    "FR-11503",
    "TK-11504"
   ],
   "plain": "Когда фильтр масла забивается, перепад давления на нём растёт и оператору приходит тревога: пора переключить или промыть фильтр.",
   "note": "",
   "verify": false
  },
  {
   "id": "T-15",
   "sheet": "115",
   "title": "Низкое давление масла системы защиты",
   "kind": "trip",
   "join": "or",
   "causes": [
    {
     "tag": "PS3221",
     "text": "Давление масла системы защиты",
     "cond": {
      "type": "discrete",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": false,
      "voting": null,
      "text": "ниже допустимого"
     }
    }
   ],
   "effects": [
    {
     "tag": "ST-11501",
     "text": "Останов турбины, главный паровой клапан закрывается",
     "action": "stop"
    }
   ],
   "bypass": null,
   "reset": "RESET",
   "manual": null,
   "applied": [
    "ST-11501"
   ],
   "equip": [
    "ST-11501"
   ],
   "plain": "Если упало давление масла, удерживающего главный паровой клапан открытым, клапан закрывается и турбина останавливается.",
   "note": "",
   "verify": false
  },
  {
   "id": "T-16",
   "sheet": "115",
   "title": "Защита генератора и электромагнитный клапан останова",
   "kind": "trip",
   "join": "or",
   "causes": [
    {
     "tag": "Электрический сигнал",
     "text": "Срабатывание основной защиты генератора",
     "cond": {
      "type": "discrete",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": false,
      "voting": null,
      "text": "сработала"
     }
    }
   ],
   "effects": [
    {
     "tag": "ST-11501",
     "text": "Останов турбины: электромагнитный клапан останова (в норме обесточен)",
     "action": "stop"
    }
   ],
   "bypass": null,
   "reset": "RESET",
   "manual": null,
   "applied": [
    "ST-11501"
   ],
   "equip": [
    "ST-11501",
    "HG-11501"
   ],
   "plain": "Если сработала основная электрическая защита генератора, турбина также останавливается. Клапан останова в нормальном режиме обесточен.",
   "note": "",
   "verify": false
  },
  {
   "id": "T-17",
   "sheet": "115",
   "title": "Валоповорот и насос подъёма ротора",
   "kind": "info",
   "join": "and",
   "causes": [
    {
     "tag": "SE5102",
     "text": "Частота вращения турбины",
     "cond": {
      "type": "discrete",
      "op": null,
      "value": null,
      "unit": null,
      "setpointUnknown": false,
      "voting": null,
      "text": "снизилась до 200 об/мин: включить насос подъёма; до 1 об/мин: включить валоповорот"
     }
    },
    {
     "tag": "PS3200G",
     "text": "Давление смазки",
     "cond": {
      "type": "analog",
      "op": ">",
      "value": 0.015,
      "unit": "МПа",
      "setpointUnknown": false,
      "voting": null,
      "text": "выше 0,015 МПа: разрешение на валоповорот"
     }
    }
   ],
   "effects": [
    {
     "tag": "PP-11507A/B",
     "text": "Пуск электродвигателя насоса подъёма ротора (масляного)",
     "action": "start"
    },
    {
     "tag": "Валоповорот",
     "text": "Пуск и останов электродвигателя поворотного устройства; индикация включения (ZS6401)",
     "action": "start"
    }
   ],
   "bypass": null,
   "reset": null,
   "manual": null,
   "applied": [
    "PP-11507AB"
   ],
   "equip": [
    "ST-11501",
    "PP-11507AB"
   ],
   "plain": "При остановке турбины ротор нужно поддерживать и медленно проворачивать, чтобы он не прогнулся. Когда обороты снизились до 200 об/мин, включается насос подъёма ротора, при 1 об/мин и давлении масла выше 0,015 МПа включается валоповорот. Режимы ручной или автоматический.",
   "note": "Условия сброса защиты турбины и «условия пуска турбины» показаны на листе отдельными блоками.",
   "verify": true
  }
 ]
};
  if (typeof module !== 'undefined' && module.exports) module.exports = D;
  else root.TWIN_ILK = D;
})(typeof self !== 'undefined' ? self : this);
