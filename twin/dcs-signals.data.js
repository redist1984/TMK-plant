/* Сгенерировано tools/gen-dcs-signals.py — не править вручную.
   Источник: 3147-5N100-03-Таблица мониторинга данных DCS DCS监控数据表 Rev.A 2026.04.25.xlsx */
(function (root) {
  var D = {
 "source": "3147-5N100-03-Таблица мониторинга данных DCS DCS监控数据表 Rev.A 2026.04.25.xlsx",
 "count": 442,
 "by_dept": {
  "111": 39,
  "112": 65,
  "113": 110,
  "114": 49,
  "115": 78,
  "114.1": 15,
  "121": 1,
  "122": 17,
  "123": 4,
  "131": 8,
  "133": 9,
  "134": 9,
  "136": 2,
  "MCC Электрика 电气": 36
 },
 "signals": {
  "AIA-11304-F": {
   "dept": "113",
   "desc": "排气筒检测出口气体流量在线监测指示、报警\nИндикация и сигнализация: Непрерывный контроль расхода отходящего газа на выходе дымовой трубы",
   "range": [
    0.0,
    320000.0
   ],
   "unit": "Nm3/h",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Внутр. DCS"
  },
  "AIA-11304-O2": {
   "dept": "113",
   "desc": "排气筒检测出口气体O2在线监测指示、报警\nИндикация и сигнализация: Непрерывный контроль O₂ в отходящем газе на выходе дымовой трубы",
   "range": [
    0.0,
    20.0
   ],
   "unit": "Vol%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Внутр. DCS"
  },
  "AIA-11304-P": {
   "dept": "113",
   "desc": "排气筒检测出口气体压力在线监测指示、报警\nИндикация и сигнализация: Непрерывный контроль давления отходящего газа на выходе дымовой трубы",
   "range": [
    0.0,
    10.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Внутр. DCS"
  },
  "AIA-11304-SO2": {
   "dept": "113",
   "desc": "排气筒检测出口气体SO2在线监测指示、报警\nИндикация и сигнализация: Непрерывный контроль SO₂ в отходящем газе на выходе дымовой трубы",
   "range": [
    0.0,
    1000.0
   ],
   "unit": "mg/Nm3",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Внутр. DCS"
  },
  "AIA-11304-T": {
   "dept": "113",
   "desc": "排气筒检测出口气体温度在线监测指示、报警\nИндикация и сигнализация: Непрерывный контроль температуры отходящего газа на выходе дымовой трубы",
   "range": [
    0.0,
    100.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Внутр. DCS"
  },
  "AT-11301": {
   "dept": "113",
   "desc": "干燥酸冷却器出口取样酸浓度\nКонцентрация кислоты в пробе на выходе охладителя сушильной кислоты",
   "range": [
    93.0,
    99.5
   ],
   "unit": "Vol%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "AT-11302": {
   "dept": "113",
   "desc": "二吸酸冷却器出口取样酸浓度\nКонцентрация кислоты в пробе на выходе охладителя второй абсорбционной колонны",
   "range": [
    93.0,
    99.5
   ],
   "unit": "Vol%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "AT-11303": {
   "dept": "113",
   "desc": "成品酸冷却器出口酸浓度\nКонцентрация кислоты на выходе охладителя товарной кислоты",
   "range": [
    93.0,
    99.5
   ],
   "unit": "Vol%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "AT-13101": {
   "dept": "131",
   "desc": "原水给水管pH计\npH-метр на трубопроводе подачи сырой воды",
   "range": [
    0.0,
    14.0
   ],
   "unit": "PH",
   "sp": null,
   "HH": null,
   "H": null,
   "L": 6.0,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "AT-13102": {
   "dept": "131",
   "desc": "原水给水管浊度仪\nТурбидиметр на трубопроводе подачи сырой воды",
   "range": [
    0.0,
    100.0
   ],
   "unit": "NTU",
   "sp": null,
   "HH": null,
   "H": 5.5,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "AT-13301": {
   "dept": "133",
   "desc": "硫酸循环水回水总管电导率测量仪\nИзмеритель электропроводности в магистральном трубопроводе обратной сернокислой циркуляционной воды",
   "range": [
    0.0,
    2500.0
   ],
   "unit": "μs/cm",
   "sp": null,
   "HH": null,
   "H": 2000.0,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "AT-13401": {
   "dept": "134",
   "desc": "发电循环水回水总管电导率测量仪\nИзмеритель электропроводности в магистральном трубопроводе обратной циркуляционной воды для электрогенерации",
   "range": [
    0.0,
    2500.0
   ],
   "unit": "μs/cm",
   "sp": null,
   "HH": null,
   "H": 2000.0,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "AV-11301": {
   "dept": "113",
   "desc": "工艺水进干燥循环酸侧量\nИзмерение расхода технологической воды, подаваемой в контур циркуляции осушенной кислоты",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "AV-11302": {
   "dept": "113",
   "desc": "工艺水进二吸循环酸侧量\nИзмерение расхода технологической воды, подаваемой в контур циркуляции кислоты второй абсорбционной колонны",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "AV-11303A": {
   "dept": "113",
   "desc": "成品酸地下槽返酸管\nТрубопровод возврата кислоты из подземного желоба товарной кислоты",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "AV-11303B": {
   "dept": "113",
   "desc": "工艺水进成品酸地下槽量\nРасход технологической воды в подземный желоб товарной кислоты",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "AYZI-11301": {
   "dept": "113",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "AYZI-11302": {
   "dept": "113",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "AYZI-11303A": {
   "dept": "113",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "AYZI-11303B": {
   "dept": "113",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "CT-11101": {
   "dept": "111",
   "desc": "冷凝水出口管电导率\nЭлектропроводность на выходном трубопроводе конденсатной воды",
   "range": [
    0.0,
    10.0
   ],
   "unit": "μs/cm",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "CT-12203A/B": {
   "dept": "122",
   "desc": "冷凝水去熔硫总管电导率测量仪\nАнализатор электропроводности конденсата в коллекторе на установку плавления серы",
   "range": [
    0.0,
    10.0
   ],
   "unit": "μs/cm",
   "sp": null,
   "HH": null,
   "H": 8.1,
   "L": 0.2,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "FT-11101": {
   "dept": "111",
   "desc": "0.8MPa(G)低压蒸汽进口管道流量\nРасход на входном трубопроводе пара низкого давления 0,8 МПа (G)",
   "range": [
    0.0,
    3500.0
   ],
   "unit": "m3/h",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "FT-11102": {
   "dept": "111",
   "desc": "冷凝水泵出口管流量\nРасход тубопровода на выходе конденсатного насоса",
   "range": [
    0.0,
    35.0
   ],
   "unit": "m3/h",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "FT-11103": {
   "dept": "111",
   "desc": "动力波泵至动力波塔管道流量\nРасход в трубопроводе от динамической волновой помпы к динамическому волновому скрубберу",
   "range": [
    0.0,
    200.0
   ],
   "unit": "m3/h",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "FT-11201": {
   "dept": "112",
   "desc": "外管来低压蒸汽\nПар низкого давления из наружной трубы",
   "range": [
    0.0,
    120.0
   ],
   "unit": "kg/h",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "FT-11202": {
   "dept": "112",
   "desc": "外管来液体硫磺\nЖидкая сера из наружной трубы",
   "range": [
    0.0,
    20.0
   ],
   "unit": "m 3/h",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "FT-11203": {
   "dept": "112",
   "desc": "外管来天然气\nПриродный газ из наружной трубы",
   "range": [
    0.0,
    2500.0
   ],
   "unit": "Nm3/h",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "FT-11301": {
   "dept": "113",
   "desc": "空气风机出口空气流量\nРасход воздуха на выходе воздушного вентилятора",
   "range": [
    0.0,
    1.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "FT-11302": {
   "dept": "113",
   "desc": "干燥塔上塔酸流量\nРасход кислоты в верхнюю часть сушильной колонны",
   "range": [
    0.0,
    1000.0
   ],
   "unit": "m3/h",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "FT-11303": {
   "dept": "113",
   "desc": "一吸塔上塔酸流量\nРасход кислоты в верхнюю часть первой абсорбционной колонны",
   "range": [
    0.0,
    1200.0
   ],
   "unit": "m3/h",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "FT-11304": {
   "dept": "113",
   "desc": "二吸塔上塔酸流量\nРасход кислоты в верхнюю часть второй абсорбционной колонны",
   "range": [
    0.0,
    1000.0
   ],
   "unit": "m3/h",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "FT-11305": {
   "dept": "113",
   "desc": "成品酸冷却器出口酸流量\nРасход кислоты на выходе охладителя товарной кислоты",
   "range": [
    0.0,
    60.0
   ],
   "unit": "m3/h",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "FT-11306": {
   "dept": "113",
   "desc": "循环冷却上水总管流量\nРасход в коллекторе оборотного охлаждающего водоснабжения",
   "range": [
    0.0,
    6000.0
   ],
   "unit": "m3/h",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "FT-11307": {
   "dept": "113",
   "desc": "脱盐水总管流量\nРасход в коллекторе обессоленной воды",
   "range": [
    0.0,
    130.0
   ],
   "unit": "m3/h",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "FT-11308": {
   "dept": "113",
   "desc": "工艺水总管流量\nРасход в коллекторе технологической воды",
   "range": [
    0.0,
    45.0
   ],
   "unit": "m3/h",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "FT-114.151": {
   "dept": "114.1",
   "desc": "除氧器进汽流量\nРасход пара на входе деаэратора",
   "range": [
    0.0,
    15.0
   ],
   "unit": "T/h",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "FT-114.152": {
   "dept": "114.1",
   "desc": "脱盐水去除氧器流量\nРасход обессоленной воды, подаваемой в деаэратор",
   "range": [
    0.0,
    150.0
   ],
   "unit": "T/h",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "FT-11401": {
   "dept": "114",
   "desc": "锅炉给水母管流量\nРасход в коллекторе питательной воды котла",
   "range": [
    0.0,
    60.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "FT-11402": {
   "dept": "114",
   "desc": "省煤器3A给水入口管流量\nРасход трубопровода на входе питательной воды в экономайзер 3A",
   "range": [
    0.0,
    60.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "FT-11403": {
   "dept": "114",
   "desc": "喷水减温器减温水流量\nРасход воды со снижением температуры устройства для впрыска воды и снижения температуры",
   "range": [
    0.0,
    60.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "FT-11404": {
   "dept": "114",
   "desc": "集汽集箱出口管流量\nРасход на выходном трубопроводе паросборного коллектора",
   "range": [
    0.0,
    60.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "FT-11501": {
   "dept": "115",
   "desc": "汽轮机进汽管流量\nРасход пара во входном трубопроводе турбины",
   "range": [
    0.0,
    60.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "FT-11502": {
   "dept": "115",
   "desc": "外供低压蒸汽管流量\nРасход в трубопроводе отпуска низконапорного пара",
   "range": [
    0.0,
    60.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "FT-11503": {
   "dept": "115",
   "desc": "减温水母管流量\nРасход в коллекторе охлаждающей воды",
   "range": [
    0.0,
    5000.0
   ],
   "unit": "kg/h",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "FT-11504": {
   "dept": "115",
   "desc": "汽封加热器出水管\nРасход воды в выходном трубопроводе нагревателя парового уплотнения",
   "range": [
    0.0,
    90.0
   ],
   "unit": "m3/h",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "FT-12201": {
   "dept": "122",
   "desc": "至液硫储罐界区蒸汽流量\nРасход пара на границе зоны резервуаров жидкой серы",
   "range": [
    0.0,
    6000.0
   ],
   "unit": "kg/h",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "FT-12301A/B/C/D": {
   "dept": "123",
   "desc": "至业主用酸装置硫酸流量\nРасход серной кислоты к установке потребителя",
   "range": [
    0.0,
    80.0
   ],
   "unit": "m3/h",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "FT-13101": {
   "dept": "131",
   "desc": "原水给水管流量\nРасход в трубопроводе подачи сырой воды",
   "range": [
    0.0,
    250.0
   ],
   "unit": "m3/h",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "FT-13102": {
   "dept": "131",
   "desc": "原水泵出水管流量\nРасход в выходном трубопроводе насоса сырой воды",
   "range": [
    0.0,
    250.0
   ],
   "unit": "m3/h",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "FT-13103": {
   "dept": "131",
   "desc": "生产水给水总管流量\nРасход в магистральном трубопроводе подачи производственной воды",
   "range": [
    0.0,
    200.0
   ],
   "unit": "m3/h",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "FT-13301": {
   "dept": "133",
   "desc": "硫酸循环水补水管流量\nРасход в трубопроводе подпитки сернокислой циркуляционной воды",
   "range": [
    0.0,
    100.0
   ],
   "unit": "m3/h",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "FT-13302": {
   "dept": "133",
   "desc": "硫酸循环水给水总管流量\nРасход в магистральном трубопроводе подачи сернокислой циркуляционной воды",
   "range": [
    0.0,
    4000.0
   ],
   "unit": "m3/h",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "FT-13303": {
   "dept": "133",
   "desc": "硫酸循环水无阀过滤器进口流量\nРасход на входе бесклапанного фильтра сернокислой циркуляционной воды",
   "range": [
    0.0,
    250.0
   ],
   "unit": "m3/h",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "FT-13401": {
   "dept": "134",
   "desc": "发电循环水补水管流量\nРасход в трубопроводе подпитки циркуляционной воды для электрогенерации",
   "range": [
    0.0,
    100.0
   ],
   "unit": "m3/h",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "FT-13402": {
   "dept": "134",
   "desc": "发电循环水给水总管流量\nРасход магистрального трубопровода подачи циркуляционной воды для электрогенерации",
   "range": [
    0.0,
    4000.0
   ],
   "unit": "m3/h",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "FT-13403": {
   "dept": "134",
   "desc": "发电循环水无阀过滤器进口流量\nРасход на входе бесклапанного фильтра циркуляционной воды для электрогенерации",
   "range": [
    0.0,
    300.0
   ],
   "unit": "m3/h",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "FV-11402A": {
   "dept": "114",
   "desc": "省煤器3A入口给水管调节阀\nРегулирующий клапан на трубопроводе питательной воды на входе в экономайзер 3A",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "FV-11402B": {
   "dept": "114",
   "desc": "省煤器4A入口给水管调节阀\nРегулирующий клапан на трубопроводе питательной воды на входе в экономайзер 4A",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "FYZI-11402A": {
   "dept": "114",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "FYZI-11402B": {
   "dept": "114",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "HV-11101": {
   "dept": "111",
   "desc": "洗涤水管道去动力波塔流量控制\nРегулирование расхода трубопровода промывной воды к динамическому волновому скрубберу",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "HV-11301": {
   "dept": "113",
   "desc": "空气风机出口放空阀\nКлапан опорожнения на выходе воздушного вентилятора",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "HV-11302": {
   "dept": "113",
   "desc": "空气风机进口风阀\nВходной воздушный клапан воздушного вентилятора",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "HV-11303": {
   "dept": "113",
   "desc": "干燥酸冷却器出口酸管\nКислотный трубопровод на выходе кислотного охладителя осушенной кислоты",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "HV-11304": {
   "dept": "113",
   "desc": "一吸酸冷却器出口酸管\nКислотный трубопровод на выходе кислотного охладителя первой абсорбционной колонны",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "HV-11305": {
   "dept": "113",
   "desc": "脱盐水预热器出口酸管\nКислотный трубопровод на выходе из подогревателя обессоленной воды",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "HV-11306": {
   "dept": "113",
   "desc": "二吸酸冷却器出口酸管\nКислотный трубопровод на выходе кислотного охладителя второй абсорбционной колонны",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "HV-11307": {
   "dept": "113",
   "desc": "干燥酸冷却器进水管\nТрубопровод подвода воды к охладителю осушенной кислоты",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "HV-11308": {
   "dept": "113",
   "desc": "一吸酸冷却器进水管\nТрубопровод подвода воды к кислотному охладителю первой абсорбционной колонны",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "HV-11309": {
   "dept": "113",
   "desc": "二吸酸冷却器进水管\nТрубопровод подвода воды к кислотному охладителю второй абсорбционной колонны",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "HV-11310": {
   "dept": "113",
   "desc": "成品酸冷却器进水管\nТрубопровод подвода воды к кислотному охладителю товарной кислоты",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "HV-11311": {
   "dept": "113",
   "desc": "脱盐水预热器进水管\nТрубопровод подвода обессоленной воды к подогревателю",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "HV-11312": {
   "dept": "113",
   "desc": "脱盐水预热器出水管\nТрубопровод отвода обессоленной воды от подогревателя",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "HV-11313": {
   "dept": "113",
   "desc": "脱盐水预热器水管旁路\nПобочный трубопровод подогревателя обессоленной воды",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "HV-114.151": {
   "dept": "114.1",
   "desc": "除氧器进汽调节阀\nРегулирующий клапан подачи пара в деаэратор",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "HV-11401": {
   "dept": "114",
   "desc": "废热锅炉汽包紧急放水\nАварийный сброс воды из барабана котла-утилизатора",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "HV-11402": {
   "dept": "114",
   "desc": "废热锅炉汽包放空调节阀\nРегулирующий клапан опорожения пара из барабана котла-утилизатора",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "HV-11403": {
   "dept": "114",
   "desc": "集汽集箱放空管调节阀\nРегулирующий клапан на линии сброса паросборного коллектора",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "HV-11404": {
   "dept": "114",
   "desc": "集汽集箱出口管调节阀\nРегулирующий клапан на выходном трубопроводе паросборного коллектора",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "HV-11501": {
   "dept": "115",
   "desc": "控制冷凝器热水井液位\nРегулирование уровня в горячем колодце конденсатора",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "HV-11502": {
   "dept": "115",
   "desc": "控制汽轮机排汽温度\nРегулирование температуры выхлопного пара турбины",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "HYZI-11101": {
   "dept": "111",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "HYZI-11301": {
   "dept": "113",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "HYZI-11302": {
   "dept": "113",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "HYZI-11303": {
   "dept": "113",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "HYZI-11304": {
   "dept": "113",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "HYZI-11305": {
   "dept": "113",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "HYZI-11306": {
   "dept": "113",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "HYZI-11307": {
   "dept": "113",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "HYZI-11308": {
   "dept": "113",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "HYZI-11309": {
   "dept": "113",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "HYZI-11310": {
   "dept": "113",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "HYZI-11311": {
   "dept": "113",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "HYZI-11312": {
   "dept": "113",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "HYZI-11313": {
   "dept": "113",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "HYZI-114.151": {
   "dept": "114.1",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "HYZI-11401": {
   "dept": "114",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "HYZI-11402": {
   "dept": "114",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "HYZI-11403": {
   "dept": "114",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "HYZI-11404": {
   "dept": "114",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "HYZI-11501": {
   "dept": "115",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "HYZI-11502": {
   "dept": "115",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "LGT-11301": {
   "dept": "113",
   "desc": "联合循环酸槽液位\nУровень в комбинированном кислотном желобе",
   "range": [
    0.0,
    3000.0
   ],
   "unit": "mm",
   "sp": null,
   "HH": null,
   "H": 2600.0,
   "L": 900.0,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "LI6104": {
   "dept": "115",
   "desc": "热井水位报警、远传\nСигнализация и дистанционная передача: Уровень в горячем колодце конденсатора",
   "range": null,
   "unit": "mm",
   "sp": null,
   "HH": null,
   "H": 900.0,
   "L": 300.0,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "LI6105": {
   "dept": "115",
   "desc": "油箱油位\nУровень масла в баке",
   "range": null,
   "unit": "mm",
   "sp": null,
   "HH": null,
   "H": 124.0,
   "L": 450.0,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "LS-11201": {
   "dept": "112",
   "desc": "测量管件G-11210酸液位\nИзмерение уровня кислоты в трубном узле G-11210",
   "range": [
    0.0,
    500.0
   ],
   "unit": "mm",
   "sp": null,
   "HH": null,
   "H": 500.0,
   "L": null,
   "LL": null,
   "signal": "SPDT/NO"
  },
  "LS6103": {
   "dept": "115",
   "desc": "轴封冷却器水位报警\nСигнализация: Уровень воды в охладителе уплотнений вала",
   "range": null,
   "unit": "mm",
   "sp": null,
   "HH": null,
   "H": 200.0,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "LT-11101": {
   "dept": "111",
   "desc": "一级过滤槽液位\nУровень в чане первичной фильтрации",
   "range": [
    0.0,
    2500.0
   ],
   "unit": "mm",
   "sp": null,
   "HH": null,
   "H": 2200.0,
   "L": null,
   "LL": 500.0,
   "signal": "4~20mA.DC+HART"
  },
  "LT-11102": {
   "dept": "111",
   "desc": "助滤槽液位\nУровень жидкости во вспомогательном фильтровальном желобе",
   "range": [
    0.0,
    2500.0
   ],
   "unit": "mm",
   "sp": null,
   "HH": null,
   "H": 2200.0,
   "L": null,
   "LL": 500.0,
   "signal": "4~20mA.DC+HART"
  },
  "LT-11103": {
   "dept": "111",
   "desc": "二级过滤槽液位\nУровень в чане вторичной фильтрации",
   "range": [
    0.0,
    2500.0
   ],
   "unit": "mm",
   "sp": null,
   "HH": null,
   "H": 2200.0,
   "L": null,
   "LL": 500.0,
   "signal": "4~20mA.DC+HART"
  },
  "LT-11104": {
   "dept": "111",
   "desc": "中间磺槽液位\nУровень жидкости в промежуточном серном желобе",
   "range": [
    0.0,
    2500.0
   ],
   "unit": "mm",
   "sp": null,
   "HH": null,
   "H": 2200.0,
   "L": null,
   "LL": 500.0,
   "signal": "4~20mA.DC+HART"
  },
  "LT-11105": {
   "dept": "111",
   "desc": "冷凝水箱液位\nУровень конденсатного бака",
   "range": [
    0.0,
    2200.0
   ],
   "unit": "mm",
   "sp": null,
   "HH": null,
   "H": 1900.0,
   "L": null,
   "LL": 400.0,
   "signal": "4~20mA.DC+HART"
  },
  "LT-11106": {
   "dept": "111",
   "desc": "动力波塔液位\nУровень в динамическом волновом скруббере",
   "range": [
    0.0,
    3200.0
   ],
   "unit": "mm",
   "sp": null,
   "HH": null,
   "H": 2800.0,
   "L": null,
   "LL": 900.0,
   "signal": "4~20mA.DC+HART"
  },
  "LT-11107": {
   "dept": "111",
   "desc": "地下槽液位\nУровень в подземном чане",
   "range": [
    0.0,
    2000.0
   ],
   "unit": null,
   "sp": null,
   "HH": null,
   "H": 1700.0,
   "L": 200.0,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "LT-11301": {
   "dept": "113",
   "desc": "联合循环酸槽液位\nУровень в комбинированном кислотном желобе",
   "range": [
    0.0,
    3000.0
   ],
   "unit": "mm",
   "sp": null,
   "HH": null,
   "H": 2600.0,
   "L": 900.0,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "LT-11302": {
   "dept": "113",
   "desc": "成品酸地下槽液位\nУровень в подземном желобе товарной кислоты",
   "range": [
    0.0,
    2500.0
   ],
   "unit": "mm",
   "sp": null,
   "HH": null,
   "H": 1700.0,
   "L": 500.0,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "LT-11303": {
   "dept": "113",
   "desc": "废酸地下槽液位\nУровень в подземном желобе отработанной кислоты",
   "range": [
    0.0,
    2000.0
   ],
   "unit": "mm",
   "sp": null,
   "HH": null,
   "H": 1800.0,
   "L": 500.0,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "LT-114.151A,B": {
   "dept": "114.1",
   "desc": "除氧器液位\nУровень деаэратора",
   "range": [
    0.0,
    1600.0
   ],
   "unit": "mm",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "LT-11401A~C": {
   "dept": "114",
   "desc": "废热锅炉汽包\nБарабан котла-утилизатора",
   "range": [
    0.0,
    4.6
   ],
   "unit": "KPa",
   "sp": null,
   "HH": 75.0,
   "H": 50.0,
   "L": -75.0,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "LT-11402": {
   "dept": "114",
   "desc": "连接排污膨胀器\nПодключение к расширителю продувки",
   "range": [
    0.0,
    600.0
   ],
   "unit": "mm",
   "sp": null,
   "HH": 250.0,
   "H": 200.0,
   "L": -250.0,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "LT-11403": {
   "dept": "114",
   "desc": "排污降温池\nБассейн охлаждения продувочных стоков",
   "range": [
    0.0,
    2400.0
   ],
   "unit": "mm",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "LT-11501": {
   "dept": "115",
   "desc": "射水箱液位\nУровень в баке водоструйной системы",
   "range": [
    0.0,
    450.0
   ],
   "unit": "mm",
   "sp": null,
   "HH": null,
   "H": 450.0,
   "L": 124.0,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "LT-11502": {
   "dept": "115",
   "desc": "润滑油箱液位\nУровень в баке смазочного масла",
   "range": [
    0.0,
    1000.0
   ],
   "unit": "mm",
   "sp": null,
   "HH": null,
   "H": 850.0,
   "L": 200.0,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "LT-12201A": {
   "dept": "122",
   "desc": "液硫储罐液位\nУровень в резервуаре жидкой серы",
   "range": [
    0.0,
    12000.0
   ],
   "unit": "mm",
   "sp": null,
   "HH": 11160.0,
   "H": 10800.0,
   "L": 1200.0,
   "LL": 720.0,
   "signal": "4~20mA.DC+HART"
  },
  "LT-12201B": {
   "dept": "122",
   "desc": "液硫储罐液位\nУровень в резервуаре жидкой серы",
   "range": [
    0.0,
    246.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": 11160.0,
   "H": 10800.0,
   "L": 1200.0,
   "LL": 720.0,
   "signal": "4~20mA.DC+HART"
  },
  "LT-12202": {
   "dept": "122",
   "desc": "精硫槽液位\nУровень в резервуаре очищенной серы",
   "range": [
    0.0,
    2000.0
   ],
   "unit": "mm",
   "sp": null,
   "HH": 1900.0,
   "H": 1700.0,
   "L": 750.0,
   "LL": 450.0,
   "signal": "4~20mA.DC+HART"
  },
  "LT-12203": {
   "dept": "122",
   "desc": "储罐冷凝水箱液位\nУровень в баке конденсата резервуара",
   "range": [
    0.0,
    2000.0
   ],
   "unit": "mm",
   "sp": null,
   "HH": 1900.0,
   "H": 1700.0,
   "L": 750.0,
   "LL": 450.0,
   "signal": "4~20mA.DC+HART"
  },
  "LT-12301A/B": {
   "dept": "123",
   "desc": "硫酸储罐液位\nУровень в резервуаре серной кислоты",
   "range": [
    0.0,
    14000.0
   ],
   "unit": "mm",
   "sp": null,
   "HH": 13300.0,
   "H": 12600.0,
   "L": 700.0,
   "LL": 500.0,
   "signal": "4~20mA.DC+HART"
  },
  "LT-12303": {
   "dept": "123",
   "desc": "硫酸地下槽液位\nУровень в подземном сборнике серной кислоты",
   "range": [
    0.0,
    2350.0
   ],
   "unit": "mm",
   "sp": null,
   "HH": 2115.0,
   "H": 1800.0,
   "L": 800.0,
   "LL": 500.0,
   "signal": "4~20mA.DC+HART"
  },
  "LT-12304": {
   "dept": "123",
   "desc": "污水收集池液位\nУровень в сборнике сточных вод",
   "range": [
    0.0,
    2200.0
   ],
   "unit": "mm",
   "sp": null,
   "HH": 2000.0,
   "H": 1850.0,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "LT-13101": {
   "dept": "131",
   "desc": "原水池液位\nУровень в резервуаре сырой воды",
   "range": [
    0.0,
    4000.0
   ],
   "unit": "mm",
   "sp": null,
   "HH": 3900.0,
   "H": 3800.0,
   "L": 600.0,
   "LL": 500.0,
   "signal": "4~20mA.DC+HART"
  },
  "LT-13102": {
   "dept": "131",
   "desc": "生产水池液位\nУровень в резервуаре производственной воды",
   "range": [
    0.0,
    4000.0
   ],
   "unit": "mm",
   "sp": null,
   "HH": 3900.0,
   "H": 3800.0,
   "L": 600.0,
   "LL": 500.0,
   "signal": "4~20mA.DC+HART"
  },
  "LT-13301": {
   "dept": "133",
   "desc": "硫酸循环水池液位\nУровень в бассейне сернокислой циркуляционной воды",
   "range": [
    0.0,
    3000.0
   ],
   "unit": "mm",
   "sp": null,
   "HH": 2900.0,
   "H": 2800.0,
   "L": 600.0,
   "LL": 500.0,
   "signal": "4~20mA.DC+HART"
  },
  "LT-13401": {
   "dept": "134",
   "desc": "发电循环水池液位\nУровень в бассейне циркуляционной воды для электрогенерации",
   "range": [
    0.0,
    3000.0
   ],
   "unit": "mm",
   "sp": null,
   "HH": 2900.0,
   "H": 2800.0,
   "L": 600.0,
   "LL": 500.0,
   "signal": "4~20mA.DC+HART"
  },
  "LV-11106": {
   "dept": "111",
   "desc": "工艺水管道去动力波塔流量控制\nРегулирование расхода трубопровода технологической воды к динамическому волновому скрубберу",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "LV-11301": {
   "dept": "113",
   "desc": "成品酸地下槽进酸管\nТрубопровод подачи товарной кислоты в подземный желоб",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "LV-11302": {
   "dept": "113",
   "desc": "成品酸冷却器出口成品酸\nТоварная кислота на выходе охладителя товарной кислоты",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "LV-114.151A": {
   "dept": "114.1",
   "desc": "脱盐水去除氧器调节阀\nРегулирующий клапан обессоленной воды, подаваемой в деаэратор",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "LV-11401": {
   "dept": "114",
   "desc": "锅炉给水母管调节阀\nРегулирующий клапан коллектора питательной воды котла",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "LV-11402": {
   "dept": "114",
   "desc": "连续排污膨胀器出口管\nТрубопровод на выходе из расширителя непрерывной продувки",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "LV-12202": {
   "dept": "122",
   "desc": "液硫进精硫槽液位控制阀\nКлапан регулирования уровня жидкой серы на входе в резервуар очищенной серы",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "LYZI-11106": {
   "dept": "111",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "LYZI-11301": {
   "dept": "113",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "LYZI-11302": {
   "dept": "113",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "LYZI-114.151A": {
   "dept": "114.1",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "LYZI-11401": {
   "dept": "114",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "LYZI-11402": {
   "dept": "114",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "LYZI-12202": {
   "dept": "122",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PDT-11101": {
   "dept": "111",
   "desc": "动力波塔压差\nПерепад давления в динамическом волновом скруббере",
   "range": [
    0.0,
    5.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PDT-11302": {
   "dept": "113",
   "desc": "干燥塔除雾器压差\nПерепад давления в туманоуловителе сушительной колонны",
   "range": [
    0.0,
    8.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": 2.0,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PDT-11305": {
   "dept": "113",
   "desc": "一吸塔除雾器压差\nПерепад давления в туманоуловителе первой абсорбционной колонны",
   "range": [
    0.0,
    12.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": 2.5,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PDT-11307": {
   "dept": "113",
   "desc": "二吸塔除雾器压差\nПерепад давления в туманоуловителе второй абсорбционной колонны",
   "range": [
    0.0,
    10.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": 2.5,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PHT-11101": {
   "dept": "111",
   "desc": "动力波泵管道PH值\nжидкости в трубопроводе динамической волновой помпы",
   "range": [
    0.0,
    14.0
   ],
   "unit": null,
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PHT-11301": {
   "dept": "113",
   "desc": "干燥酸冷却器出口水PH值\nЗначение pH воды на выходе из охладителя сухой кислоты",
   "range": [
    0.0,
    14.0
   ],
   "unit": "PH",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PHT-11302": {
   "dept": "113",
   "desc": "一吸酸冷却器出口水PH值\nЗначение PH воды на выходе кислотного охладителя первой абсорбционной колонны",
   "range": [
    0.0,
    14.0
   ],
   "unit": "PH",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PHT-11303": {
   "dept": "113",
   "desc": "二吸酸冷却器出口水PH值\nЗначение PH воды на выходе кислотного охладителя второй абсорбционной колонны",
   "range": [
    0.0,
    14.0
   ],
   "unit": "PH",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PHT-11304": {
   "dept": "113",
   "desc": "成品酸冷却器出口水PH值\nЗначение PH воды на выходе кислотного охладителя товарной кислоты",
   "range": [
    0.0,
    14.0
   ],
   "unit": "PH",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PHT-11305": {
   "dept": "113",
   "desc": "脱盐水预热器出口水PH值\nводы на выходе подогревателя обессоленной воды",
   "range": [
    0.0,
    14.0
   ],
   "unit": "PH",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PS1200-A": {
   "dept": "115",
   "desc": "冷凝器真空低报警\nСигнализация низкого вакуума в конденсаторе",
   "range": null,
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": -79.0,
   "L": null,
   "LL": null,
   "signal": "SPDT/NO"
  },
  "PS1200-B~D": {
   "dept": "115",
   "desc": "冷凝器真空低停机\nОстанов по низкому вакууму в конденсаторе",
   "range": null,
   "unit": "KPa",
   "sp": null,
   "HH": -55.0,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "SPDT/NO"
  },
  "PS1201-A": {
   "dept": "115",
   "desc": "抽汽压力低报警\nСигнализация низкого давления отбора пара",
   "range": [
    0.0,
    2.0
   ],
   "unit": "MPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": 0.58,
   "LL": null,
   "signal": "SPDT/NO"
  },
  "PS1201-B": {
   "dept": "115",
   "desc": "抽汽压力高报警\nСигнализация высокого давления отбора пара",
   "range": [
    0.0,
    2.0
   ],
   "unit": "MPa",
   "sp": null,
   "HH": null,
   "H": 1.23,
   "L": null,
   "LL": null,
   "signal": "SPDT/NO"
  },
  "PS3211": {
   "dept": "115",
   "desc": "主油泵出口压力低启泵\nПуск насоса при низком давлении на выходе главного масляного насоса",
   "range": [
    0.0,
    2.0
   ],
   "unit": "MPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": 0.85,
   "LL": null,
   "signal": "SPDT/NO"
  },
  "PT-11101": {
   "dept": "111",
   "desc": "中间磺泵去液硫罐区管道压力\nДавление в трубопроводе прокачки промежуточным серным насосом к зоне резервуара с жидкой серой",
   "range": [
    0.0,
    1.0
   ],
   "unit": "MPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11102A/B": {
   "dept": "111",
   "desc": "一级液硫过滤器进料口压力\nДавление отверстия подачи сырья фильтра жидкой серы первого класса",
   "range": [
    0.0,
    1.0
   ],
   "unit": "MPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11103": {
   "dept": "111",
   "desc": "二级液硫过滤器进料口压力\nДавление отверстия подачи сырья фильтра жидкой серы второго класса",
   "range": [
    0.0,
    1.0
   ],
   "unit": "MPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11104": {
   "dept": "111",
   "desc": "0.8MPa(G)低压蒸汽进口管道压力\nДавление на входном трубопроводе пара низкого давления 0,8 МПа (G)",
   "range": [
    0.0,
    1.0
   ],
   "unit": "MPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11105": {
   "dept": "111",
   "desc": "0.5MPa(G)低压蒸汽进口管道压力\nДавление во входном трубопроводе пара низкого давления 0,5 МПа (G)",
   "range": [
    0.0,
    1.0
   ],
   "unit": "MPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11107": {
   "dept": "111",
   "desc": "动力波泵（PP-11106AB）进口管洗涤水压力\nДавление промывной воды на входном трубопроводе динамической волновой помпы (PP-11106A/B)",
   "range": [
    0.0,
    0.5
   ],
   "unit": "MPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11201": {
   "dept": "112",
   "desc": "测量空气鼓风机来干燥空气压力\nИзмерение давления сухого воздуха от воздуходувки",
   "range": [
    0.0,
    60.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11202": {
   "dept": "112",
   "desc": "测量焚硫炉出口炉气压力\nИзмерение давления печного газа на выходе из серосжигательной печи",
   "range": [
    0.0,
    60.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11203": {
   "dept": "112",
   "desc": "测量废热锅炉出口炉气压力\nИзмерение давления печного газа на выходе из котла-утилизатора",
   "range": [
    0.0,
    60.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11204": {
   "dept": "112",
   "desc": "测量转化器一段进口炉气压力\nИзмерение давления печного газа на входе в 1-ой секции конвертора",
   "range": [
    0.0,
    60.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11205": {
   "dept": "112",
   "desc": "测量转化器一段触媒上部压力\nИзмерение давления в верхней части слоя катализатора в первой секции конвертера",
   "range": [
    0.0,
    60.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11206": {
   "dept": "112",
   "desc": "测量转化器一段触媒下部压力\nИзмерение давления в нижней части слоя катализатора в первой секции конвертера",
   "range": [
    0.0,
    50.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11207": {
   "dept": "112",
   "desc": "测量转化器一段出口炉气压力\nИзмерение давления печного газа на выходе из 1-ой секции конвертора",
   "range": [
    0.0,
    50.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11208": {
   "dept": "112",
   "desc": "测量转化器二段进口炉气压力\nИзмерение давления печного газа на входе во 2-ой секции конвертора",
   "range": [
    0.0,
    50.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11209": {
   "dept": "112",
   "desc": "测量转化器二段触媒上部压力\nИзмерение давления в верхней части слоя катализатора во 2-й секции конвертера",
   "range": [
    0.0,
    50.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11210": {
   "dept": "112",
   "desc": "测量转化器二段触媒下部压力\nИзмерение давления в нижней части слоя катализатора во 2-й секции конвертера",
   "range": [
    0.0,
    50.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11211": {
   "dept": "112",
   "desc": "测量转化器二段出口炉气压力\nИзмерение давления печного газа на выходе из 2-ой секции конвертора",
   "range": [
    0.0,
    50.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11212": {
   "dept": "112",
   "desc": "测量转化器三段进口炉气压力\nИзмерение давления печного газа на входе в 3-ей секции конвертора",
   "range": [
    0.0,
    50.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11213": {
   "dept": "112",
   "desc": "测量转化器三段触媒上部压力\nИзмерение давления в верхней части слоя катализатора в 3-ей секции конвертера",
   "range": [
    0.0,
    50.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11214": {
   "dept": "112",
   "desc": "测量转化器三段触媒下部压力\nИзмерение давления в нижней части слоя катализатора в 3-ей секции конвертера",
   "range": [
    0.0,
    50.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11215": {
   "dept": "112",
   "desc": "测量转化器三段出口炉气压力\nИзмерение давления печного газа на выходе из 3-ей секции конвертора",
   "range": [
    0.0,
    50.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11216": {
   "dept": "112",
   "desc": "测量省煤器3A进口炉气压力\nИзмерение давления печного газа во входе в экономайзер 3A",
   "range": [
    0.0,
    50.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11217": {
   "dept": "112",
   "desc": "测量省煤器3A出口炉气压力\nИзмерение давления печного газа на выходе из экономайзера 3A",
   "range": [
    0.0,
    40.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11218": {
   "dept": "112",
   "desc": "测量冷热换热器壳程SO2进口炉气压力\nИзмерение давления печного газа во входе SO₂ в межтрубное пространство теплообменника (холодная/горячая сторона)",
   "range": [
    0.0,
    30.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11219": {
   "dept": "112",
   "desc": "测量热热换热器壳程SO2进口炉气压力\nИзмерение давления печного газа во входе SO₂ в межтрубное пространство теплообменника (горячая/горячая сторона)",
   "range": [
    0.0,
    30.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11220": {
   "dept": "112",
   "desc": "测量转化器四段入口炉气压力\nИзмерение давления печного газа во входе в 4-ю секцию конвертора",
   "range": [
    0.0,
    30.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11221": {
   "dept": "112",
   "desc": "测量转化器四段触媒上部压力\nИзмерение давления в верхней части слоя катализатора в 4-й секции конвертера",
   "range": [
    0.0,
    30.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11222": {
   "dept": "112",
   "desc": "测量转化器四段触媒下部压力\nИзмерение давления в нижней части слоя катализатора в 4-й секции конвертера",
   "range": [
    0.0,
    30.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11223": {
   "dept": "112",
   "desc": "测量转化器四段出口炉气压力\nИзмерение давления печного газа в выходе из 4-й секции конвертора",
   "range": [
    0.0,
    30.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11224": {
   "dept": "112",
   "desc": "测量省煤器4A段出口炉气压力\nИзмерение давления печного газа на выходе из секции экономайзера 4A",
   "range": [
    0.0,
    15.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11225": {
   "dept": "112",
   "desc": "测量空气预热器干燥空气进口压力\nИзмерение давления сухого воздуха на входе в воздухоподогреватель",
   "range": [
    0.0,
    60.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11226": {
   "dept": "112",
   "desc": "测量空气预热器干燥空气出口压力\nИзмерение давления сухого воздуха на выходе из воздухоподогревателя",
   "range": [
    0.0,
    60.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11227": {
   "dept": "112",
   "desc": "测量蒸汽压力\nИзмерение давления пара",
   "range": [
    0.0,
    1.0
   ],
   "unit": "MPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11228": {
   "dept": "112",
   "desc": "测量液硫压力\nИзмерение давления жидкой серы",
   "range": [
    0.0,
    2.5
   ],
   "unit": "MPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11229": {
   "dept": "112",
   "desc": "测仪表空气压力\nИзмерение давления приборного воздуха",
   "range": [
    0.0,
    1.0
   ],
   "unit": "MPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11230": {
   "dept": "112",
   "desc": "测天然气压力\nИзмерение давления природного газа",
   "range": [
    0.0,
    60.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11304": {
   "dept": "113",
   "desc": "风机出口压力\nДавление на выходе вентилятора",
   "range": [
    0.0,
    80.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11306": {
   "dept": "113",
   "desc": "一吸塔烟气出口压力\nДавление дымовых газов на выходе первой абсорбционной колонны",
   "range": [
    0.0,
    30.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11308": {
   "dept": "113",
   "desc": "二吸塔烟气出口压力\nДавление дымовых газов на выходе второй абсорбционной колонны",
   "range": [
    0.0,
    10.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11309": {
   "dept": "113",
   "desc": "脱盐水加压泵进口总管压力\nДавление впускного коллектора нагнетательного насоса обессоленной воды",
   "range": [
    0.0,
    80.0
   ],
   "unit": "KPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11310": {
   "dept": "113",
   "desc": "脱盐水加压泵出口总管压力\nДавление выпускного коллектора нагнетательного насоса обессоленной воды",
   "range": [
    0.0,
    0.8
   ],
   "unit": "MPa(G)",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11311": {
   "dept": "113",
   "desc": "循环冷却上水总管压力\nДавление в коллекторе оборотного охлаждающего водоснабжения",
   "range": [
    0.0,
    0.6
   ],
   "unit": "MPa(G)",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-114.151": {
   "dept": "114.1",
   "desc": "除氧器进汽压力\nДавление пара на входе деаэратора",
   "range": [
    0.0,
    1.0
   ],
   "unit": "MPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-114.152": {
   "dept": "114.1",
   "desc": "除氧器（头部）压力\nДавление в верхней части деаэратора",
   "range": [
    0.0,
    0.6
   ],
   "unit": "MPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-114.153": {
   "dept": "114.1",
   "desc": "废热锅炉给水出口母管\nВыходной коллектор питательной воды котла-утилизатора",
   "range": [
    0.0,
    16.0
   ],
   "unit": "MPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11401": {
   "dept": "114",
   "desc": "省煤器入口母管锅炉给水压力（进水调节阀后）\nДавление питательной воды котла на входном коллекторе экономайзера (после регулирующего клапана подачи воды)",
   "range": [
    0.0,
    16.0
   ],
   "unit": "MPa",
   "sp": null,
   "HH": null,
   "H": 7.9,
   "L": 7.5,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11402": {
   "dept": "114",
   "desc": "省煤器3A出口管压力\nДавление на выходном трубопроводе экономайзера 3A",
   "range": [
    0.0,
    16.0
   ],
   "unit": "MPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11403": {
   "dept": "114",
   "desc": "省煤器4A出口管压力\nДавление на выходном трубопроводе экономайзера 4A",
   "range": [
    0.0,
    16.0
   ],
   "unit": "MPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11404": {
   "dept": "114",
   "desc": "废热锅炉入口管压力\nДавление на входной трубе котла-утилизатора",
   "range": [
    0.0,
    16.0
   ],
   "unit": "MPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11405": {
   "dept": "114",
   "desc": "废热锅炉汽包压力\nДавление в барабане котла-утилизатора",
   "range": [
    0.0,
    16.0
   ],
   "unit": "MPa",
   "sp": null,
   "HH": null,
   "H": 7.2,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11406": {
   "dept": "114",
   "desc": "过热器4A出口管压力\nДавление на выходном трубопроводе пароперегревателя 4A",
   "range": [
    0.0,
    16.0
   ],
   "unit": "MPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11407": {
   "dept": "114",
   "desc": "集汽集箱压力\nДавление в паросборном коллекторе",
   "range": [
    0.0,
    16.0
   ],
   "unit": "MPa",
   "sp": null,
   "HH": 6.7,
   "H": 6.6,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11408": {
   "dept": "114",
   "desc": "磷酸盐溶液进废热锅炉压力\nДавление подачи фосфатного раствора в котёл-утилизатор",
   "range": [
    0.0,
    16.0
   ],
   "unit": "MPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11501": {
   "dept": "115",
   "desc": "汽轮机进汽压力\nДавление пара на входе в турбину",
   "range": [
    0.0,
    10.0
   ],
   "unit": "MPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11502": {
   "dept": "115",
   "desc": "备用减温减压装置进汽压力\nДавление пара на входе резервной редукционно-охладительной установки",
   "range": [
    0.0,
    10.0
   ],
   "unit": "MPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11503": {
   "dept": "115",
   "desc": "汽轮机抽汽管压力\nДавление в трубопроводе отбора пара турбины",
   "range": [
    0.0,
    1.6
   ],
   "unit": "MPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11504": {
   "dept": "115",
   "desc": "备用减温减压装置出汽管压力\nДавление в пароотводящем трубопроводе резервной редукционно-охладительной установки",
   "range": [
    0.0,
    1.6
   ],
   "unit": "MPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11505": {
   "dept": "115",
   "desc": "减温减压装置出汽管压力（配套均压箱)\nДавление в пароотводящем трубопроводе редукционно-охладительной установки в комплекте с уравнительным коллектором",
   "range": [
    0.0,
    1.6
   ],
   "unit": "MPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11506": {
   "dept": "115",
   "desc": "凝结水泵出口母管压力\nДавление в выходном коллекторе конденсатных насосов",
   "range": [
    0.0,
    1.0
   ],
   "unit": "MPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": 0.4,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-11507": {
   "dept": "115",
   "desc": "循环水进水母管压力\nДавление во входном коллекторе оборотной воды",
   "range": [
    0.0,
    1.0
   ],
   "unit": "MPa",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-13103": {
   "dept": "131",
   "desc": "生产水给水总管压力\nДавление в магистральном трубопроводе подачи производственной воды",
   "range": [
    0.0,
    1.0
   ],
   "unit": "MPa(G)",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-13302": {
   "dept": "133",
   "desc": "硫酸循环水给水总管压力\nДавление магистрального трубопровода подачи сернокислой циркуляционной воды",
   "range": [
    0.0,
    1.0
   ],
   "unit": "MPa(G)",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-13303": {
   "dept": "133",
   "desc": "硫酸循环水回水总管压力\nДавление в магистральном трубопроводе обратной сернокислой циркуляционной воды",
   "range": [
    0.0,
    1.0
   ],
   "unit": "MPa(G)",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-13402": {
   "dept": "134",
   "desc": "发电循环水给水总管压力\nДавление магистрального трубопровода подачи циркуляционной воды для электрогенерации",
   "range": [
    0.0,
    1.0
   ],
   "unit": "MPa(G)",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-13403": {
   "dept": "134",
   "desc": "发电循环水回水总管压力\nДавление магистрального трубопровода обратной циркуляционной воды для электрогенерации",
   "range": [
    0.0,
    1.0
   ],
   "unit": "MPa(G)",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-13601": {
   "dept": "136",
   "desc": "压缩空气储气罐（VE-13601）出口压力\nДавление на выходе ресивера сжатого воздуха (VE-13601)",
   "range": [
    0.0,
    1.0
   ],
   "unit": "MPa(G)",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PT-13602": {
   "dept": "136",
   "desc": "压缩空气储气罐（VE-13602）出口压力\nДавление на выходе ресивера приборного воздуха (VE-13602)",
   "range": [
    0.0,
    1.0
   ],
   "unit": "MPa(G)",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PV-11105": {
   "dept": "111",
   "desc": "低压蒸汽管保温\nТеплоизоляция паровых труб низкого давления",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PV-114.152": {
   "dept": "114.1",
   "desc": "低压蒸汽自外管去除氧器调节阀\nРегулирующий клапан низконапорного пара от внешнего трубопровода к деаэратору",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PV-11504": {
   "dept": "115",
   "desc": "控制备用减温减压装置后蒸汽压力\nРегулирование давления пара после резервной редукционно-охладительной установки",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PV-11505": {
   "dept": "115",
   "desc": "控制均压箱配套减温减压装置后蒸汽压力\nРегулирование давления пара после редукционно-охладительной установки уравнительного коллектора",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "PYZI-11105": {
   "dept": "111",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "PYZI-114.152": {
   "dept": "114.1",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "PYZI-11504": {
   "dept": "115",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "PYZI-11505": {
   "dept": "115",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "SC-BO-11301": {
   "dept": "113",
   "desc": "空气风机DCS频率设定\nЗадание частоты от DCS: Воздушный вентилятор",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4～20mA"
  },
  "SC-CV-12101A": {
   "dept": "MCC Электрика 电气",
   "desc": "供料胶带输送机转速调节\nРегулирование частоты вращения: Ленточный конвейер подачи материала",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4～20mA"
  },
  "SC-CV-12101B": {
   "dept": "MCC Электрика 电气",
   "desc": "供料胶带输送机转速调节\nРегулирование частоты вращения: Ленточный конвейер подачи материала",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4～20mA"
  },
  "SC-LR-12102A": {
   "dept": "MCC Электрика 电气",
   "desc": "螺旋输送机转速调节\nРегулирование частоты вращения: Шнековый конвейер",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4～20mA"
  },
  "SC-LR-12102B": {
   "dept": "MCC Электрика 电气",
   "desc": "螺旋输送机转速调节\nРегулирование частоты вращения: Шнековый конвейер",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4～20mA"
  },
  "SC-P12302A/B": {
   "dept": "MCC Электрика 电气",
   "desc": "卸酸泵转速调节\nРегулирование частоты вращения: Насос разгрузки кислоты",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4～20mA"
  },
  "SC-PP-11101A/B": {
   "dept": "MCC Электрика 电气",
   "desc": "一级过滤泵转速调节\nРегулирование частоты вращения: Насос первичной фильтрации",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4～20mA"
  },
  "SC-PP-11102A/B": {
   "dept": "MCC Электрика 电气",
   "desc": "二级过滤泵转速调节\nРегулирование частоты вращения: Насос вторичной фильтрации",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4～20mA"
  },
  "SC-PP-11104A/B": {
   "dept": "MCC Электрика 电气",
   "desc": "中间磺泵转速调节\nРегулирование частоты вращения: Насос промежуточной серы",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4～20mA"
  },
  "SC-PP-11105A/B": {
   "dept": "MCC Электрика 电气",
   "desc": "冷凝水泵转速调节\nРегулирование частоты вращения: Насос конденсата",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4～20mA"
  },
  "SC-PP-11106A/B": {
   "dept": "MCC Электрика 电气",
   "desc": "动力波泵转速调节\nРегулирование частоты вращения: Насос динамического волнового скруббера",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4～20mA"
  },
  "SC-PP-11301": {
   "dept": "MCC Электрика 电气",
   "desc": "干燥塔循环酸泵转速调节\nРегулирование частоты вращения: Циркуляционный кислотный насос сушильной башни",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4～20mA"
  },
  "SC-PP-11302": {
   "dept": "MCC Электрика 电气",
   "desc": "一吸塔循环酸泵转速调节\nРегулирование частоты вращения: Циркуляционный кислотный насос первой абсорбционной башни",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4～20mA"
  },
  "SC-PP-11303": {
   "dept": "MCC Электрика 电气",
   "desc": "二吸塔循环酸泵转速调节\nРегулирование частоты вращения: Циркуляционный кислотный насос второй абсорбционной башни",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4～20mA"
  },
  "SC-PP-11304AB": {
   "dept": "MCC Электрика 电气",
   "desc": "成品酸泵转速调节\nРегулирование частоты вращения: Насос товарной кислоты",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4～20mA"
  },
  "SC-PP-12201A/B": {
   "dept": "MCC Электрика 电气",
   "desc": "精硫泵转速调节\nРегулирование частоты вращения: Насос очищенной серы",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4～20mA"
  },
  "SC-PP-12202A/B": {
   "dept": "MCC Электрика 电气",
   "desc": "冷凝水泵转速调节\nРегулирование частоты вращения: Насос конденсата",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4～20mA"
  },
  "SC-PP-12301A/B": {
   "dept": "MCC Электрика 电气",
   "desc": "硫酸输送转速调节\nРегулирование частоты вращения: Система подачи серной кислоты",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4～20mA"
  },
  "SC-SK-11101": {
   "dept": "MCC Электрика 电气",
   "desc": "引风机转速调节\nРегулирование частоты вращения: Дымосос",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4～20mA"
  },
  "SI-CV-12101A": {
   "dept": "MCC Электрика 电气",
   "desc": "供料胶带输送机转速反馈\nОбратная связь по частоте вращения: Ленточный конвейер подачи материала",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4～20mA"
  },
  "SI-CV-12101B": {
   "dept": "MCC Электрика 电气",
   "desc": "供料胶带输送机转速反馈\nОбратная связь по частоте вращения: Ленточный конвейер подачи материала",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4～20mA"
  },
  "SI-LR-12102A": {
   "dept": "MCC Электрика 电气",
   "desc": "螺旋输送机转速反馈\nОбратная связь по частоте вращения: Шнековый конвейер",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4～20mA"
  },
  "SI-LR-12102B": {
   "dept": "MCC Электрика 电气",
   "desc": "螺旋输送机转速反馈\nОбратная связь по частоте вращения: Шнековый конвейер",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4～20mA"
  },
  "SI-P12302A/B": {
   "dept": "MCC Электрика 电气",
   "desc": "卸酸泵转速反馈\nОбратная связь по частоте вращения: Насос разгрузки кислоты",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4～20mA"
  },
  "SI-PP-11101A/B": {
   "dept": "MCC Электрика 电气",
   "desc": "一级过滤泵转速反馈\nОбратная связь по частоте вращения: Насос первичной фильтрации",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4～20mA"
  },
  "SI-PP-11102A/B": {
   "dept": "MCC Электрика 电气",
   "desc": "二级过滤泵转速反馈\nОбратная связь по частоте вращения: Насос вторичной фильтрации",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4～20mA"
  },
  "SI-PP-11104A/B": {
   "dept": "MCC Электрика 电气",
   "desc": "中间磺泵转速反馈\nОбратная связь по частоте вращения: Насос промежуточной серы",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4～20mA"
  },
  "SI-PP-11105A/B": {
   "dept": "MCC Электрика 电气",
   "desc": "冷凝水泵转速反馈\nОбратная связь по частоте вращения: Насос конденсата",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4～20mA"
  },
  "SI-PP-11106A/B": {
   "dept": "MCC Электрика 电气",
   "desc": "动力波泵转速反馈\nОбратная связь по частоте вращения: Насос динамического волнового скруббера",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4～20mA"
  },
  "SI-PP-11301": {
   "dept": "MCC Электрика 电气",
   "desc": "干燥塔循环酸泵转速反馈\nОбратная связь по частоте вращения: Циркуляционный кислотный насос сушильной башни",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4～20mA"
  },
  "SI-PP-11302": {
   "dept": "MCC Электрика 电气",
   "desc": "一吸塔循环酸泵转速反馈\nОбратная связь по частоте вращения: Циркуляционный кислотный насос первой абсорбционной башни",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4～20mA"
  },
  "SI-PP-11303": {
   "dept": "MCC Электрика 电气",
   "desc": "二吸塔循环酸泵转速反馈\nОбратная связь по частоте вращения: Циркуляционный кислотный насос второй абсорбционной башни",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4～20mA"
  },
  "SI-PP-11304AB": {
   "dept": "MCC Электрика 电气",
   "desc": "成品酸泵转速反馈\nОбратная связь по частоте вращения: Насос товарной кислоты",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4～20mA"
  },
  "SI-PP-12201A/B": {
   "dept": "MCC Электрика 电气",
   "desc": "精硫泵转速反馈\nОбратная связь по частоте вращения: Насос очищенной серы",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4～20mA"
  },
  "SI-PP-12202A/B": {
   "dept": "MCC Электрика 电气",
   "desc": "冷凝水泵转速反馈\nОбратная связь по частоте вращения: Насос конденсата",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4～20mA"
  },
  "SI-PP-12301A/B": {
   "dept": "MCC Электрика 电气",
   "desc": "硫酸输送转速反馈\nОбратная связь по частоте вращения: Система подачи серной кислоты",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4～20mA"
  },
  "SI-SK-11101": {
   "dept": "MCC Электрика 电气",
   "desc": "引风机转速反馈\nОбратная связь по частоте вращения: Дымосос",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4～20mA"
  },
  "TE-11101A/B": {
   "dept": "111",
   "desc": "快速熔硫槽温度（液体）\nТемпература ванны быстрого плавления серы (жидкость)",
   "range": [
    0.0,
    200.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": 150.0,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11101C/D": {
   "dept": "111",
   "desc": "快速熔硫槽温度（气体）\nТемпература ванны быстрого плавления серы (газы)",
   "range": [
    0.0,
    200.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": 185.0,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11102A": {
   "dept": "111",
   "desc": "一级过滤槽温度（液体）\nТемпература в ванне первичной фильтрации (жидкость)",
   "range": [
    0.0,
    200.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": 150.0,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11102B": {
   "dept": "111",
   "desc": "一级过滤槽温度（气体）\nТемпература в ванне первичной фильтрации (газы)",
   "range": [
    0.0,
    200.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": 165.0,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11103A": {
   "dept": "111",
   "desc": "助滤槽温度（液体）\nТемпература ванны вспомогательной фильтрации (жидкость)",
   "range": [
    0.0,
    200.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": 150.0,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11103B": {
   "dept": "111",
   "desc": "助滤槽温度（气体）\nТемпература ванны вспомогательной фильтрации (газы)",
   "range": [
    0.0,
    200.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": 165.0,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11104A": {
   "dept": "111",
   "desc": "二级过滤槽温度（液体）\nТемпература в ванне вторичной фильтрации (жидкость)",
   "range": [
    0.0,
    200.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": 150.0,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11104B": {
   "dept": "111",
   "desc": "二级过滤槽温度（气体）\nТемпература в ванне вторичной фильтрации (газы)",
   "range": [
    0.0,
    200.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": 165.0,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11105A": {
   "dept": "111",
   "desc": "中间磺槽温度（液体）\nТемпература чана промежуточной серы (жидкость)",
   "range": [
    0.0,
    200.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": 150.0,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11105B": {
   "dept": "111",
   "desc": "中间磺槽温度（气体）\nТемпература чана промежуточной серы (газы)",
   "range": [
    0.0,
    200.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": 165.0,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11106": {
   "dept": "111",
   "desc": "0.8MPa(G)低压蒸汽进口管道温度\nТемпература входного трубопровода пара низкого давления 0,8 МПа (G)",
   "range": [
    0.0,
    200.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": 175.0,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11107": {
   "dept": "111",
   "desc": "0.5MPa(G)低压蒸汽进口管道温度\nТемпература входного трубопровода пара низкого давления 0,5 МПа (G)",
   "range": [
    0.0,
    200.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": 158.0,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11108": {
   "dept": "111",
   "desc": "冷凝水箱设备温度\nТемпература оборудования конденсатного бака",
   "range": [
    0.0,
    100.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": 100.0,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11109": {
   "dept": "111",
   "desc": "动力波塔（TW-11101）尾气出口温度\nТемпература отходящих газов на выходе динамической волновой скруббер (TW-11101)",
   "range": [
    0.0,
    100.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": 50.0,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11201": {
   "dept": "112",
   "desc": "测量焚硫炉内烟气温度(前)\nИзмерение температуры дымовых газов в серосжигательной печи (в передней части)",
   "range": [
    0.0,
    1200.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": 1100.0,
   "L": null,
   "LL": null,
   "signal": "TC"
  },
  "TE-11202": {
   "dept": "112",
   "desc": "测量焚硫炉炉衬层的温度(中靠后)\nИзмерение температуры футеровки серосжигательной печи (средняя задняя зона)",
   "range": [
    0.0,
    1200.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": 800.0,
   "L": null,
   "LL": null,
   "signal": "TC"
  },
  "TE-11203": {
   "dept": "112",
   "desc": "测量焚硫炉内烟气温度(中)\nИзмерение температуры дымовых газов в серосжигательной печи (в средней части)",
   "range": [
    0.0,
    1200.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": 1100.0,
   "L": null,
   "LL": null,
   "signal": "TC"
  },
  "TE-11204": {
   "dept": "112",
   "desc": "测量焚硫炉内烟气温度(后)\nИзмерение температуры дымовых газов в серосжигательной печи (в задней части)",
   "range": [
    0.0,
    1200.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": 1100.0,
   "L": null,
   "LL": null,
   "signal": "TC"
  },
  "TE-11205A/B": {
   "dept": "112",
   "desc": "测量焚硫炉出口温度\nИзмерение температуры на выходе из серосжигательной печи",
   "range": [
    0.0,
    1200.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "TC"
  },
  "TE-11206": {
   "dept": "112",
   "desc": "测量废热锅炉出口温度\nИзмерение температуры на выходе из котла-утилизатора",
   "range": [
    0.0,
    500.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "TC"
  },
  "TE-11207": {
   "dept": "112",
   "desc": "测量转化器一段进口炉气温度\nИзмерение температуры печного газа на входе в 1-ой секции конвертора",
   "range": [
    0.0,
    500.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "TC"
  },
  "TE-11208": {
   "dept": "112",
   "desc": "测量转化器一段出口炉气温度\nИзмерение температуры печного газа на выходе из 1-ой секции конвертора",
   "range": [
    0.0,
    700.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "TC"
  },
  "TE-11209": {
   "dept": "112",
   "desc": "测量转化器二段进口炉气温度\nИзмерение температуры печного газа на входе во 2-ой секции конвертора",
   "range": [
    0.0,
    500.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "TC"
  },
  "TE-11210": {
   "dept": "112",
   "desc": "测量转化器二段出口炉气温度\nИзмерение температуры печного газа на выходе из 2-ой секции конвертора",
   "range": [
    0.0,
    600.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "TC"
  },
  "TE-11211": {
   "dept": "112",
   "desc": "测量转化器三段进口炉气温度\nИзмерение температуры печного газа на входе в 3-ой секции конвертора",
   "range": [
    0.0,
    500.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "TC"
  },
  "TE-11212": {
   "dept": "112",
   "desc": "测量转化器三段出口炉气温度\nИзмерение температуры печного газа на выходе из 3-ей секции конвертора",
   "range": [
    0.0,
    600.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "TC"
  },
  "TE-11213": {
   "dept": "112",
   "desc": "测量省煤器3A入口炉气温度\nИзмерение температуры печного газа на входе в экономайзер 3A",
   "range": [
    0.0,
    500.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "TC"
  },
  "TE-11214": {
   "dept": "112",
   "desc": "测量省煤器3A出口炉气温度\nИзмерение температуры печного газа на выходе из экономайзера 4A",
   "range": [
    0.0,
    200.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": 170.0,
   "L": null,
   "LL": null,
   "signal": "RTD"
  },
  "TE-11215": {
   "dept": "112",
   "desc": "测量冷热换热器壳程SO2炉气进口温度\nИзмерение температуры во входе печного газа SO₂ в межтрубное пространство теплообменника (холодная/горячая сторона)",
   "range": [
    0.0,
    200.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "RTD"
  },
  "TE-11216": {
   "dept": "112",
   "desc": "测量冷热换热器壳程SO2炉气出口温度\nИзмерение температуры в выходе печного газа SO₂ в межтрубном пространстве теплообменника (холодная/горячая сторона)",
   "range": [
    0.0,
    500.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "TC"
  },
  "TE-11217": {
   "dept": "112",
   "desc": "测量热热换热器壳程SO2炉气出口温度\nИзмерение температуры на выходе печного газа SO₂ в межтрубном пространстве теплообменника (горячая/горячая сторона)",
   "range": [
    0.0,
    500.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "TC"
  },
  "TE-11218": {
   "dept": "112",
   "desc": "测量转化器四段入口炉气温度\nИзмерение температуры печного газа на входе в 4-ой секции конвертора",
   "range": [
    0.0,
    500.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "TC"
  },
  "TE-11219": {
   "dept": "112",
   "desc": "测量转化器四段出口炉气温度\nИзмерение температуры печного газа на выходе в четырехсекционный конвертор",
   "range": [
    0.0,
    500.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "TC"
  },
  "TE-11220": {
   "dept": "112",
   "desc": "测量省煤器4A出口炉气温度\nИзмерение температуры печного газа на выходе экономайзера 4A",
   "range": [
    0.0,
    200.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "RTD"
  },
  "TE-11221A/B": {
   "dept": "112",
   "desc": "测量空气预热器烟气进口温度\nИзмерение температуры дымового газа на входе в воздухоподогреватель",
   "range": [
    0.0,
    800.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "TC"
  },
  "TE-11223A/B-1,2": {
   "dept": "112",
   "desc": "测量转化器一段触媒层上部温度\nИзмерение температуры в верхней части слоя катализатора в первой секции конвертера",
   "range": [
    0.0,
    500.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "TC"
  },
  "TE-11224A/B-1,2": {
   "dept": "112",
   "desc": "测量转化器一段触媒层下部温度\nИзмерение температуры в нижней части слоя катализатора в первой секции конвертера",
   "range": [
    0.0,
    700.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "TC"
  },
  "TE-11225A/B-1,2": {
   "dept": "112",
   "desc": "测量转化器二段触媒层上部温度\nИзмерение температуры в верхней части слоя катализатора во второй секции конвертера",
   "range": [
    0.0,
    600.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "TC"
  },
  "TE-11226A/B-1,2": {
   "dept": "112",
   "desc": "测量转化器二段触媒层下部温度\nИзмерение температуры в нижней части слоя катализатора во второй секции конвертера",
   "range": [
    0.0,
    600.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "TC"
  },
  "TE-11227A/B-1,2": {
   "dept": "112",
   "desc": "测量转化器三段触媒层上部温度\nИзмерение температуры в верхней части слоя катализатора в третьей секции конвертера",
   "range": [
    0.0,
    500.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "TC"
  },
  "TE-11228A/B-1,2": {
   "dept": "112",
   "desc": "测量转化器三段触媒层下部温度\nИзмерение температуры в нижней части слоя катализатора в третьей секции конвертера",
   "range": [
    0.0,
    600.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "TC"
  },
  "TE-11229A/B-1,2": {
   "dept": "112",
   "desc": "测量转化器四段触媒层上部温度\nИзмерение температуры в верхней части слоя катализатора в четвертой секции конвертера",
   "range": [
    0.0,
    500.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "TC"
  },
  "TE-11230A/B-1,2": {
   "dept": "112",
   "desc": "测量转化器四段触媒层下部温度\nИзмерение температуры в нижней части слоя катализатора в четвертой секции конвертера",
   "range": [
    0.0,
    500.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "TC"
  },
  "TE-11231": {
   "dept": "112",
   "desc": "测量空气预热器管程出口空气温度\nИзмерение температуры воздуха на выходе из межтрубного пространства воздухоподогревателя",
   "range": [
    0.0,
    500.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "TC"
  },
  "TE-11232": {
   "dept": "112",
   "desc": "测量空气预热器壳程出口空气温度\nИзмерение температуры воздуха на выходе из межтрубного пространства воздухоподогревателя",
   "range": [
    0.0,
    600.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "TC"
  },
  "TE-11301": {
   "dept": "113",
   "desc": "干燥塔进口空气温度\nТемпература воздуха на входе в сушильную колонну",
   "range": [
    0.0,
    100.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11302": {
   "dept": "113",
   "desc": "干燥塔出口空气温度\nДавление воздуха на выходе из сушильной колонны",
   "range": [
    0.0,
    100.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11303": {
   "dept": "113",
   "desc": "风机出口温度\nТемпература на выходе вентилятора",
   "range": [
    0.0,
    200.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11304": {
   "dept": "113",
   "desc": "一吸塔烟气出口温度\nТемпература на выходе дымовых газов первой абсорбционной колонны",
   "range": [
    0.0,
    150.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11305": {
   "dept": "113",
   "desc": "二吸塔烟气出口温度\nТемпература на выходе дымовых газов второй абсорбционной колонны",
   "range": [
    0.0,
    150.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11306": {
   "dept": "113",
   "desc": "干燥塔上塔酸温度\nРасход кислоты в нижнюю часть сушильной колонны",
   "range": [
    0.0,
    150.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11307": {
   "dept": "113",
   "desc": "干燥塔下塔酸温度\nТемпература кислоты в нижней части сушильной колонны",
   "range": [
    0.0,
    150.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11308": {
   "dept": "113",
   "desc": "一吸塔上塔酸温度\nТемпература кислоты в верхнюю часть первой абсорбционной колонны",
   "range": [
    0.0,
    150.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11309": {
   "dept": "113",
   "desc": "一吸塔下塔酸温度\nТемпература кислоты в нижнюю часть первой абсорбционной колонны",
   "range": [
    0.0,
    150.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11310": {
   "dept": "113",
   "desc": "二吸塔上塔酸温度\nТемпература кислоты в верхнюю часть второй абсорбционной колонны",
   "range": [
    0.0,
    150.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11311": {
   "dept": "113",
   "desc": "二吸塔下塔酸温度\nТемпература кислоты в нижнюю часть второй абсорбционной колонны",
   "range": [
    0.0,
    150.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11312": {
   "dept": "113",
   "desc": "干燥酸冷却器进口酸温度\nТемпература кислоты на входе кислотного охладителя осушенной кислоты",
   "range": [
    0.0,
    150.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11313": {
   "dept": "113",
   "desc": "干燥酸冷却器出口酸温度\nТемпература кислоты на выходе кислотного охладителя осушенной кислоты",
   "range": [
    0.0,
    100.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11314": {
   "dept": "113",
   "desc": "一吸酸冷却器进口酸温度\nТемпература кислоты на входе кислотного охладителя кислоты первой абсорбционной колонны",
   "range": [
    0.0,
    150.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11315": {
   "dept": "113",
   "desc": "一吸酸冷却器出口酸温度\nТемпература кислоты на выходе кислотного охладителя кислоты первой абсорбционной колонны",
   "range": [
    0.0,
    100.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11316": {
   "dept": "113",
   "desc": "脱盐水预热器进口酸温度\nТемпература кислоты на входе из подогревателя обессоленной воды",
   "range": [
    0.0,
    150.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11317": {
   "dept": "113",
   "desc": "脱盐水预热器出口酸温度\nТемпература кислоты на выходе из подогревателя обессоленной воды",
   "range": [
    0.0,
    100.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11318": {
   "dept": "113",
   "desc": "二吸酸冷却器进口酸温度\nТемпература кислоты на входе кислотного охладителя кислоты второй абсорбционной колонны",
   "range": [
    0.0,
    150.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11319": {
   "dept": "113",
   "desc": "二吸酸冷却器出口酸温度\nТемпература кислоты на выходе кислотного охладителя кислоты второй абсорбционной колонны",
   "range": [
    0.0,
    150.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11320": {
   "dept": "113",
   "desc": "成品酸冷却器进口酸温度\nТемпература кислоты на входе кислотного охладителя товарной кислоты",
   "range": [
    0.0,
    150.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11321": {
   "dept": "113",
   "desc": "干燥酸冷却器出口水温度\nТемпература воды на выходе кислотного охладителя осушенной кислоты",
   "range": [
    0.0,
    100.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11322": {
   "dept": "113",
   "desc": "一吸酸冷却器出口水温度\nТемпература воды на выходе кислотного охладителя кислоты первой абсорбционной колонны",
   "range": [
    0.0,
    100.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11323": {
   "dept": "113",
   "desc": "脱盐水预热器出口水温度\nТемпература воды на выходе из подогревателя обессоленной воды",
   "range": [
    0.0,
    100.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11324": {
   "dept": "113",
   "desc": "二吸酸冷却器出口水温度\nТемпература воды на выходе кислотного охладителя кислоты второй абсорбционной колонны",
   "range": [
    0.0,
    100.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11325": {
   "dept": "113",
   "desc": "成品酸冷却器出口水温度\nТемпература воды на выходе кислотного охладителя товарной кислоты",
   "range": [
    0.0,
    100.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11326": {
   "dept": "113",
   "desc": "循环冷却上水总管温度\nТемпература в коллекторе оборотного охлаждающего водоснабжения",
   "range": [
    0.0,
    100.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11327": {
   "dept": "113",
   "desc": "循环冷却回水总管温度\nТемпература коллектора обратной воды циркуляционного охлаждения",
   "range": [
    0.0,
    100.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11328": {
   "dept": "113",
   "desc": "工艺水总管温度\nТемпература в коллекторе технологической воды",
   "range": [
    0.0,
    100.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11329": {
   "dept": "113",
   "desc": "成品酸冷却器出口酸温度\nТемпература кислоты на выходе охладителя товарной кислоты",
   "range": [
    0.0,
    100.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-114.151": {
   "dept": "114.1",
   "desc": "除氧器进汽温度\nТемпература пара на входе деаэратора",
   "range": [
    0.0,
    200.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-114.152": {
   "dept": "114.1",
   "desc": "除氧水箱温度\nТемпература в деаэраторном баке",
   "range": [
    0.0,
    200.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-114.153": {
   "dept": "114.1",
   "desc": "脱盐水进水温度\nТемпература обессоленной воды на входе",
   "range": [
    0.0,
    100.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11401": {
   "dept": "114",
   "desc": "省煤器入口母管锅炉给水温度（进水调节阀前）\nТемпература питательной воды котла на входном коллекторе экономайзера (до регулирующего клапана подачи воды)",
   "range": [
    0.0,
    200.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11402": {
   "dept": "114",
   "desc": "省煤器3A给水入口管温度\nТемпература трубопровода на входе питательной воды в экономайзер 3A",
   "range": [
    0.0,
    200.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11403": {
   "dept": "114",
   "desc": "省煤器3A给水出口管温度\nТемпература трубопровода на выходе питательной воды в экономайзер 3A",
   "range": [
    0.0,
    300.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "TC"
  },
  "TE-11404": {
   "dept": "114",
   "desc": "省煤器4A给水出口管温度\nТемпература трубопровода на выходе питательной воды в экономайзер 4A",
   "range": [
    0.0,
    300.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "TC"
  },
  "TE-11405": {
   "dept": "114",
   "desc": "废热锅炉给水入口管温度\nТемпература трубопровода на входе питательной воды в утилизационный котёл",
   "range": [
    0.0,
    300.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "TC"
  },
  "TE-11406": {
   "dept": "114",
   "desc": "过热器4A出口管温度\nТемпература на выходном трубопроводе пароперегревателя 4A",
   "range": [
    0.0,
    400.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "TC"
  },
  "TE-11407": {
   "dept": "114",
   "desc": "1#喷水减温器入口管温度\nТемпература на входном трубопроводе устройства для впрыска воды и снижения температуры",
   "range": [
    0.0,
    400.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "TC"
  },
  "TE-11408": {
   "dept": "114",
   "desc": "1#喷水减温器出口管温度\nТемпература на выходном трубопроводе устройства для впрыска воды и снижения температуры",
   "range": [
    0.0,
    400.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": 324.0,
   "L": null,
   "LL": null,
   "signal": "TC"
  },
  "TE-11409": {
   "dept": "114",
   "desc": "2#喷水减温器入口管温度\nТемпература на входном трубопроводе устройства для впрыска воды и снижения температуры",
   "range": [
    0.0,
    500.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "TC"
  },
  "TE-11410": {
   "dept": "114",
   "desc": "2#喷水减温器出口管温度\nТемпература на выходном трубопроводе устройства для впрыска воды и снижения температуры",
   "range": [
    0.0,
    400.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": 384.0,
   "L": null,
   "LL": null,
   "signal": "TC"
  },
  "TE-11501": {
   "dept": "115",
   "desc": "汽轮机进汽管温度\nТемпература пара во входном трубопроводе турбины",
   "range": [
    0.0,
    600.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "K"
  },
  "TE-11502": {
   "dept": "115",
   "desc": "备用减温减压装置入口温度温度\nТемпература на входе резервной редукционно-охладительной установки",
   "range": [
    0.0,
    600.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "K"
  },
  "TE-11503": {
   "dept": "115",
   "desc": "汽轮机抽汽口出口温度\nТемпература на выходе отбора пара турбины",
   "range": [
    0.0,
    300.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11504": {
   "dept": "115",
   "desc": "减温装置出口温度\nТемпература на выходе пароохладителя",
   "range": [
    0.0,
    200.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11505": {
   "dept": "115",
   "desc": "备用减温减压装置出口温度\nТемпература на выходе резервной редукционно-охладительной установки",
   "range": [
    0.0,
    200.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11506": {
   "dept": "115",
   "desc": "减温减压装置出口温度（配套均压箱）\nТемпература на выходе редукционно-охладительной установки в комплекте с уравнительным коллектором",
   "range": [
    0.0,
    300.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11507": {
   "dept": "115",
   "desc": "空气冷却器入口温度\nТемпература на входе воздухоохладителя",
   "range": [
    0.0,
    100.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11508": {
   "dept": "115",
   "desc": "空气冷却器出口温度\nТемпература на выходе воздухоохладителя",
   "range": [
    0.0,
    100.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-11509": {
   "dept": "115",
   "desc": "射水箱温度\nТемпература воды в баке водоструйной системы",
   "range": [
    0.0,
    100.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": 35.0,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-12201": {
   "dept": "122",
   "desc": "液硫储罐上部液硫温度\nТемпература жидкой серы в верхней части резервуара",
   "range": [
    0.0,
    200.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": 150.0,
   "L": 130.0,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-12202": {
   "dept": "122",
   "desc": "液硫储罐中部液硫温度\nТемпература жидкой серы в средней части резервуара",
   "range": [
    0.0,
    200.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": 150.0,
   "L": 130.0,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-12203": {
   "dept": "122",
   "desc": "液硫储罐下部液硫温度\nТемпература жидкой серы в нижней части резервуара",
   "range": [
    0.0,
    200.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": 155.0,
   "H": 150.0,
   "L": 130.0,
   "LL": 125.0,
   "signal": "Pt100"
  },
  "TE-12204": {
   "dept": "122",
   "desc": "液硫储罐顶部蒸汽温度\nТемпература пара в верхней части резервуара жидкой серы",
   "range": [
    0.0,
    200.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": 165.0,
   "L": 130.0,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-12205": {
   "dept": "122",
   "desc": "精硫槽液硫(液相)温度\nТемпература жидкой серы (жидкая фаза) в резервуаре очищенной серы",
   "range": [
    0.0,
    200.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": 150.0,
   "L": 130.0,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-12206": {
   "dept": "122",
   "desc": "精硫槽(气相)温度\nТемпература газовой фазы в резервуаре очищенной серы",
   "range": [
    0.0,
    200.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": 165.0,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-12207": {
   "dept": "122",
   "desc": "冷凝水箱温度\nТемпература бака конденсата",
   "range": [
    0.0,
    200.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-13301": {
   "dept": "133",
   "desc": "硫酸循环水给水总管温度\nТемпература магистрального трубопровода подачи сернокислой циркуляционной воды",
   "range": [
    0.0,
    100.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-13302": {
   "dept": "133",
   "desc": "硫酸循环水回水总管温度\nТемпература магистрального трубопровода возвратной сернокислой циркуляционной воды",
   "range": [
    0.0,
    100.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-13401": {
   "dept": "134",
   "desc": "发电循环水给水总管温度\nТемпература магистрального трубопровода подачи циркуляционной воды для электрогенерации",
   "range": [
    0.0,
    100.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE-13402": {
   "dept": "134",
   "desc": "发电循环水回水总管温度\nТемпература магистрального трубопровода обратной циркуляционной воды для электрогенерации",
   "range": [
    0.0,
    100.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TE2100": {
   "dept": "115",
   "desc": "主汽门前蒸汽温度\nТемпература пара перед главным паровым клапаном",
   "range": [
    0.0,
    600.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "K"
  },
  "TE2110": {
   "dept": "115",
   "desc": "汽缸上半温度\nТемпература верхней половины корпуса турбины",
   "range": [
    0.0,
    600.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "K"
  },
  "TE2111": {
   "dept": "115",
   "desc": "汽缸下半温度\nТемпература нижней половины корпуса турбины",
   "range": [
    0.0,
    600.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "K"
  },
  "TE2120": {
   "dept": "115",
   "desc": "调节级后蒸汽温度\nТемпература пара за регулирующей ступенью",
   "range": [
    0.0,
    600.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "K"
  },
  "TE2121": {
   "dept": "115",
   "desc": "调节级后汽缸法兰温度\nТемпература фланца корпуса за регулирующей ступенью",
   "range": [
    0.0,
    600.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "K"
  },
  "TE2123": {
   "dept": "115",
   "desc": "内外缸夹层蒸汽温度\nТемпература пара между внутренним и наружным корпусами турбины",
   "range": [
    0.0,
    600.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "K"
  },
  "TE2130": {
   "dept": "115",
   "desc": "工业抽汽温度\nТемпература промышленного отбора пара",
   "range": [
    0.0,
    600.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "K"
  },
  "TE2140": {
   "dept": "115",
   "desc": "排汽室温度\nТемпература выхлопной камеры",
   "range": [
    0.0,
    150.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TIE-HG-11501-Z13~Z14": {
   "dept": "115",
   "desc": "空气冷却器热风温度\nТемпература горячего воздуха воздухоохладителя",
   "range": null,
   "unit": "℃",
   "sp": null,
   "HH": 80.0,
   "H": 75.0,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TIE-HG-11501-Z15~Z16": {
   "dept": "115",
   "desc": "空气冷却器冷风温度\nТемпература холодного воздуха воздухоохладителя",
   "range": null,
   "unit": "℃",
   "sp": null,
   "HH": 55.0,
   "H": 50.0,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TIE-HG-11501-Z17/Z19": {
   "dept": "115",
   "desc": "发电机冷风温度\nТемпература холодного воздуха генератора",
   "range": null,
   "unit": "℃",
   "sp": null,
   "HH": 55.0,
   "H": 50.0,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TIE-HG-11501-Z18": {
   "dept": "115",
   "desc": "发电机热风温度\nТемпература горячего воздуха генератора",
   "range": null,
   "unit": "℃",
   "sp": null,
   "HH": 80.0,
   "H": 75.0,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TIE-HG-11501-Z1~Z6": {
   "dept": "115",
   "desc": "定子线圈测温\nИзмерение температуры обмоток: Статор",
   "range": null,
   "unit": "℃",
   "sp": null,
   "HH": 130.0,
   "H": 125.0,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TIE-HG-11501-Z20": {
   "dept": "115",
   "desc": "轴承油温\nТемпература масла подшипника",
   "range": null,
   "unit": "℃",
   "sp": null,
   "HH": 80.0,
   "H": 75.0,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TIE-HG-11501-Z21": {
   "dept": "115",
   "desc": "轴承瓦温\nТемпература вкладыша подшипника",
   "range": null,
   "unit": "℃",
   "sp": null,
   "HH": 90.0,
   "H": 85.0,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TIE-HG-11501-Z7~Z12": {
   "dept": "115",
   "desc": "定子铁芯温度\nТемпература сердечника статора",
   "range": null,
   "unit": "℃",
   "sp": null,
   "HH": 130.0,
   "H": 125.0,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TIE2201": {
   "dept": "115",
   "desc": "冷凝器进汽温度\nТемпература пара на входе конденсатора",
   "range": [
    0.0,
    150.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TIE2202": {
   "dept": "115",
   "desc": "冷凝器凝结水温\nТемпература конденсата в конденсаторе",
   "range": [
    0.0,
    100.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TIE2203": {
   "dept": "115",
   "desc": "循环水进口温度\nТемпература оборотной воды на входе",
   "range": [
    0.0,
    100.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TIE2204": {
   "dept": "115",
   "desc": "循环水出口温度\nТемпература оборотной воды на выходе",
   "range": [
    0.0,
    100.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TIE2230": {
   "dept": "115",
   "desc": "均压箱温度\nТемпература уравнительного коллектора",
   "range": [
    0.0,
    400.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TIE2260": {
   "dept": "115",
   "desc": "冷油器进水温度\nТемпература воды на входе маслоохладителя",
   "range": [
    0.0,
    100.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TIE2261": {
   "dept": "115",
   "desc": "冷油器出水温度\nТемпература воды на выходе маслоохладителя",
   "range": [
    0.0,
    100.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TIE4100": {
   "dept": "115",
   "desc": "推力轴承回油温度\nТемпература обратного масла упорного подшипника",
   "range": [
    0.0,
    100.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": 70.0,
   "H": 65.0,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TIE4101": {
   "dept": "115",
   "desc": "汽轮机前轴承回油温度\nТемпература обратного масла переднего подшипника турбины",
   "range": [
    0.0,
    100.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": 70.0,
   "H": 65.0,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TIE4102": {
   "dept": "115",
   "desc": "汽轮机后轴承回油温度\nТемпература обратного масла заднего подшипника турбины",
   "range": [
    0.0,
    100.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": 70.0,
   "H": 65.0,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TIE4103": {
   "dept": "115",
   "desc": "发电机前轴承回油温度\nТемпература обратного масла переднего подшипника генератора",
   "range": [
    0.0,
    100.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": 70.0,
   "H": 65.0,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TIE4110": {
   "dept": "115",
   "desc": "冷油器进油温度\nТемпература масла на входе маслоохладителя",
   "range": [
    0.0,
    100.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TIE4111": {
   "dept": "115",
   "desc": "冷油器出油温度\nТемпература масла на выходе маслоохладителя",
   "range": [
    0.0,
    100.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TIE4115": {
   "dept": "115",
   "desc": "油箱油温\nТемпература масла в баке",
   "range": [
    0.0,
    100.0
   ],
   "unit": "℃",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TIE4200": {
   "dept": "115",
   "desc": "推力瓦块温度\nТемпература колодок упорного подшипника",
   "range": null,
   "unit": "℃",
   "sp": null,
   "HH": 100.0,
   "H": 85.0,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TIE4201": {
   "dept": "115",
   "desc": "前轴承轴瓦温度\nТемпература вкладыша переднего подшипника",
   "range": null,
   "unit": "℃",
   "sp": null,
   "HH": 100.0,
   "H": 85.0,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TIE4202": {
   "dept": "115",
   "desc": "后轴承轴瓦温度\nТемпература вкладыша заднего подшипника",
   "range": null,
   "unit": "℃",
   "sp": null,
   "HH": 100.0,
   "H": 85.0,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TIE4203": {
   "dept": "115",
   "desc": "发电机前轴承轴瓦温度\nТемпература вкладыша переднего подшипника генератора",
   "range": null,
   "unit": "℃",
   "sp": null,
   "HH": 100.0,
   "H": 85.0,
   "L": null,
   "LL": null,
   "signal": "Pt100"
  },
  "TV-11209": {
   "dept": "114",
   "desc": "过热器1B进出口管副线调节阀\nРегулирующий клапан побочной линии трубопроводов входа/выхода пароперегревателя 1B",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "TV-11306": {
   "dept": "113",
   "desc": "干燥酸冷却器酸管副线\nПобочная линия кислотного трубопровода охладителя сухой кислоты",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "TV-11308A": {
   "dept": "113",
   "desc": "一吸酸冷却器酸管副线\nПобочная линия кислотного трубопровода на холодильнике кислоты первой абсорбционной колонны",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "TV-11308B": {
   "dept": "113",
   "desc": "脱盐水预热器酸管副线\nПобочная линия кислотного трубопровода подогревателя обессоленной воды",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "TV-11310": {
   "dept": "113",
   "desc": "二吸酸冷却器酸管副线\nПобочная линия кислотного трубопровода на холодильнике кислоты второй абсорбционной колонны",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "TV-11408": {
   "dept": "114",
   "desc": "1#喷水减温器入口减温水\nВода со снижением температуры на входе устройства для впрыска воды и снижения температуры",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "TV-11410": {
   "dept": "114",
   "desc": "2#喷水减温器入口减温水\nВода со снижением температуры на входе устройства для впрыска воды и снижения температуры",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "TV-11411": {
   "dept": "114",
   "desc": "过热器4A进出口管副线调节阀\nРегулирующий клапан побочной линии трубопроводов входа/выхода пароперегревателя 4A",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "TV-11505": {
   "dept": "115",
   "desc": "控制备用减温减压装置后蒸汽温度\nРегулирование температуры пара после резервной редукционно-охладительной установки",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "TV-11506": {
   "dept": "115",
   "desc": "控制均压箱配套减温减压装置后蒸汽温度\nРегулирование температуры пара после редукционно-охладительной установки уравнительного коллектора",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "TV-11509": {
   "dept": "115",
   "desc": "控制射水箱温度\nРегулирование температуры воды в баке водоструйной системы",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "TV-12203": {
   "dept": "122",
   "desc": "蒸汽进液硫储罐温度控制阀\nКлапан регулирования температуры пара, поступающего в резервуар жидкой серы",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "TYZI-11209": {
   "dept": "114",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "TYZI-11306": {
   "dept": "113",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "TYZI-11308A": {
   "dept": "113",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "TYZI-11308B": {
   "dept": "113",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "TYZI-11310": {
   "dept": "113",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "TYZI-11408": {
   "dept": "114",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "TYZI-11410": {
   "dept": "114",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "TYZI-11411": {
   "dept": "114",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "TYZI-11505": {
   "dept": "115",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "TYZI-11506": {
   "dept": "115",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "TYZI-11509": {
   "dept": "115",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC"
  },
  "TYZI-12203": {
   "dept": "122",
   "desc": "阀位反馈\nОбратная связь положения клапана",
   "range": [
    0.0,
    100.0
   ],
   "unit": "%",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  },
  "WT-12101A/B": {
   "dept": "121",
   "desc": "供料胶带输送机A~B硫磺重量\nВес серы на питающей ленточном конвейере A~B",
   "range": [
    0.0,
    80.0
   ],
   "unit": "t/h",
   "sp": null,
   "HH": null,
   "H": null,
   "L": null,
   "LL": null,
   "signal": "4~20mA.DC+HART"
  }
 }
};
  if (typeof module !== 'undefined' && module.exports) module.exports = D;
  else root.TWIN_SIGNALS = D;
})(typeof self !== 'undefined' ? self : this);
