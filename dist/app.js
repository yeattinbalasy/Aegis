const events = [
  {time:'16:42:18',severity:'Критический',title:'Серия неуспешных входов с последующим успехом',source:'Windows',user:'admin.ops',ip:'10.24.8.19',score:0.96},
  {time:'16:40:02',severity:'Высокий',title:'Вход в VPN из нетипичного местоположения',source:'VPN',user:'d.ivanov',ip:'185.220.101.14',score:0.89},
  {time:'16:37:44',severity:'Средний',title:'Запуск редкого процесса PowerShell',source:'Endpoint',user:'a.kim',ip:'10.24.4.57',score:0.72},
  {time:'16:34:11',severity:'Низкий',title:'Обновление групповой политики',source:'Windows',user:'system',ip:'10.24.1.11',score:0.18},
  {time:'16:29:03',severity:'Высокий',title:'Сканирование портов внутреннего сегмента',source:'Firewall',user:'—',ip:'10.24.9.33',score:0.87},
  {time:'16:25:55',severity:'Средний',title:'Изменение прав на системный каталог',source:'Linux',user:'svc_backup',ip:'10.24.3.10',score:0.66},
  {time:'16:21:09',severity:'Критический',title:'Массовая выгрузка данных приложения',source:'Application',user:'api_report',ip:'10.24.7.22',score:0.94},
  {time:'16:17:20',severity:'Средний',title:'Первый вход пользователя с нового устройства',source:'VPN',user:'m.sadyk',ip:'91.185.3.77',score:0.61},
  {time:'16:12:47',severity:'Низкий',title:'Успешная проверка целостности файлов',source:'Endpoint',user:'system',ip:'10.24.6.18',score:0.09},
  {time:'16:08:31',severity:'Высокий',title:'Создание привилегированной учётной записи',source:'Windows',user:'helpdesk.1',ip:'10.24.2.41',score:0.91},
  {time:'16:03:06',severity:'Средний',title:'Необычное число DNS-запросов',source:'Firewall',user:'—',ip:'10.24.5.92',score:0.69},
  {time:'15:58:22',severity:'Низкий',title:'Плановый запуск резервного копирования',source:'Linux',user:'svc_backup',ip:'10.24.3.10',score:0.12}
];

const incidents = [
  {id:'INC-2048',severity:'Критический',risk:96,title:'Возможный подбор пароля привилегированной учётной записи',source:'Windows Security',object:'admin.ops',time:'16:42',status:'Новый',ip:'10.24.8.19',technique:'Credential Access',explanation:'За 4 минуты зафиксировано 18 неуспешных попыток входа, после которых произошла успешная аутентификация. Частота события и последовательность действий отличаются от обычного профиля учётной записи.',timeline:[['16:38','Первая неуспешная попытка входа'],['16:41','Число ошибок превысило порог правила'],['16:42','Успешный вход с того же IP-адреса']]},
  {id:'INC-2047',severity:'Критический',risk:94,title:'Нетипичная массовая выгрузка данных',source:'Application Logs',object:'api_report',time:'16:21',status:'Расследование',ip:'10.24.7.22',technique:'Exfiltration',explanation:'Объём выгрузки превышает обычный часовой профиль сервиса. Операция выполнена вне стандартного окна формирования отчётов.',timeline:[['16:14','Рост числа запросов к API'],['16:18','Превышен объём обычной сессии'],['16:21','Создан инцидент высокого приоритета']]},
  {id:'INC-2046',severity:'Критический',risk:91,title:'Создание привилегированной учётной записи',source:'Windows Security',object:'helpdesk.1',time:'16:08',status:'Новый',ip:'10.24.2.41',technique:'Persistence',explanation:'Пользователь службы поддержки создал учётную запись с административными правами. Аналогичных действий в его профиле за наблюдаемый период не было.',timeline:[['16:07','Открыта консоль управления'],['16:08','Создана новая учётная запись'],['16:08','Учётная запись добавлена в группу администраторов']]},
  {id:'INC-2045',severity:'Высокий',risk:89,title:'Вход в VPN из нетипичного местоположения',source:'VPN Gateway',object:'d.ivanov',time:'16:40',status:'Расследование',ip:'185.220.101.14',technique:'Initial Access',explanation:'Географический и сетевой профиль входа ранее не встречался для пользователя. За 12 минут до входа зафиксирована активная сессия из корпоративной сети.',timeline:[['16:28','Активная сессия из корпоративной сети'],['16:40','Вход через VPN с нового адреса'],['16:40','Срабатывание правила невозможного перемещения']]},
  {id:'INC-2044',severity:'Высокий',risk:87,title:'Сканирование портов внутреннего сегмента',source:'Firewall',object:'10.24.9.33',time:'16:29',status:'Новый',ip:'10.24.9.33',technique:'Discovery',explanation:'Узел обратился к 46 портам на 11 внутренних адресах за короткий интервал. Шаблон похож на разведывательное сканирование.',timeline:[['16:27','Начало серии соединений'],['16:28','Обнаружено обращение к нескольким узлам'],['16:29','Превышен порог уникальных портов']]}
];

const titles={dashboard:'Центр мониторинга',events:'События безопасности',incidents:'Управление инцидентами',model:'Модуль искусственного интеллекта',architecture:'Архитектура системы'};
const severityClass=s=>({Критический:'critical',Высокий:'high',Средний:'medium',Низкий:'low'}[s]||'low');
const statusClass=s=>({Новый:'new',Расследование:'investigation',Закрыт:'closed','Ложное срабатывание':'closed'}[s]||'');
const escapeText=value=>String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

function switchView(name){
  document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===`${name}-view`));
  document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view===name));
  document.getElementById('page-title').textContent=titles[name];
  window.scrollTo({top:0,behavior:'smooth'});
}

document.querySelectorAll('.nav-item').forEach(button=>button.addEventListener('click',()=>switchView(button.dataset.view)));
document.querySelectorAll('[data-view-target]').forEach(button=>button.addEventListener('click',()=>switchView(button.dataset.viewTarget)));

function eventRows(items){return items.map(e=>`<tr><td>${e.time}</td><td><span class="severity ${severityClass(e.severity)}">${e.severity}</span></td><td>${escapeText(e.title)}</td><td>${e.source}</td><td>${e.user}</td><td><span class="score">${e.ip}</span></td><td><span class="score ${e.score>=.85?'high':e.score>=.6?'medium':''}">${e.score.toFixed(2)}</span></td></tr>`).join('')}
function renderEvents(){
  const query=document.getElementById('event-search').value.trim().toLowerCase();
  const severity=document.getElementById('severity-filter').value;
  const source=document.getElementById('source-filter').value;
  const filtered=events.filter(e=>(severity==='all'||e.severity===severity)&&(source==='all'||e.source===source)&&(!query||Object.values(e).join(' ').toLowerCase().includes(query)));
  document.getElementById('events-table').innerHTML=eventRows(filtered);
  document.getElementById('event-result-count').textContent=`${filtered.length} событий`;
  return filtered;
}

['event-search','severity-filter','source-filter'].forEach(id=>document.getElementById(id).addEventListener('input',renderEvents));
document.getElementById('reset-filters').addEventListener('click',()=>{document.getElementById('event-search').value='';document.getElementById('severity-filter').value='all';document.getElementById('source-filter').value='all';renderEvents()});

function incidentRows(){return incidents.slice(0,4).map(i=>`<tr data-incident="${i.id}"><td><span class="severity ${severityClass(i.severity)}">${i.risk}</span></td><td>${escapeText(i.title)}</td><td>${i.source}</td><td>${i.object}</td><td>${i.time}</td><td><span class="status-badge ${statusClass(i.status)}">${i.status}</span></td></tr>`).join('')}
function renderDashboardIncidents(){document.getElementById('dashboard-incidents').innerHTML=incidentRows();document.querySelectorAll('#dashboard-incidents tr').forEach(row=>row.addEventListener('click',()=>{switchView('incidents');selectIncident(row.dataset.incident)}))}

function renderIncidentList(filter='all'){
  const list=filter==='critical'?incidents.filter(i=>i.severity==='Критический'):incidents;
  document.getElementById('incident-list').innerHTML=list.map((i,index)=>`<button class="incident-card ${index===0?'active':''}" data-id="${i.id}"><header><span class="severity ${severityClass(i.severity)}">${i.id}</span><time>${i.time}</time></header><h3>${escapeText(i.title)}</h3><p>${i.source} · ${i.object}</p></button>`).join('');
  document.querySelectorAll('.incident-card').forEach(card=>card.addEventListener('click',()=>selectIncident(card.dataset.id)));
  if(list.length)selectIncident(list[0].id);
}

function selectIncident(id){
  const incident=incidents.find(i=>i.id===id);if(!incident)return;
  document.querySelectorAll('.incident-card').forEach(card=>card.classList.toggle('active',card.dataset.id===id));
  document.getElementById('incident-detail').innerHTML=`<div class="detail-header"><div><span class="severity ${severityClass(incident.severity)}">${incident.id} · ${incident.severity}</span><h2>${escapeText(incident.title)}</h2></div><div class="risk-number">${incident.risk}<small>риск из 100</small></div></div><div class="detail-grid"><div><span>Источник</span><strong>${incident.source}</strong></div><div><span>Объект</span><strong>${incident.object}</strong></div><div><span>IP-адрес</span><strong>${incident.ip}</strong></div><div><span>Тактика</span><strong>${incident.technique}</strong></div><div><span>Статус</span><strong>${incident.status}</strong></div><div><span>Время</span><strong>${incident.time}</strong></div></div><p class="eyebrow">Хронология</p><div class="timeline">${incident.timeline.map(t=>`<div><time>${t[0]}</time><p>${t[1]}</p></div>`).join('')}</div><p class="eyebrow">Объяснение ИИ</p><div class="explanation">${incident.explanation}</div><div class="detail-actions"><button class="confirm" data-action="Расследование">Подтвердить инцидент</button><button class="false-positive" data-action="Ложное срабатывание">Ложное срабатывание</button><button class="close-action" data-action="Закрыт">Закрыть</button></div>`;
  document.querySelectorAll('.detail-actions button').forEach(button=>button.addEventListener('click',()=>setIncidentStatus(id,button.dataset.action)));
}

function setIncidentStatus(id,status){
  const incident=incidents.find(i=>i.id===id);if(!incident)throw new Error('Инцидент не найден');
  incident.status=status;renderIncidentList();selectIncident(id);renderDashboardIncidents();showToast(`${id}: статус изменён на «${status}»`);return {id,status};
}

function showToast(message){const toast=document.getElementById('toast');toast.textContent=message;toast.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove('show'),2600)}
document.getElementById('focus-critical').addEventListener('click',()=>renderIncidentList('critical'));
document.getElementById('alerts-button').addEventListener('click',()=>{switchView('incidents');renderIncidentList('critical')});
document.getElementById('global-search').addEventListener('keydown',event=>{if(event.key==='Enter'){switchView('events');document.getElementById('event-search').value=event.currentTarget.value;renderEvents()}});

function registerWebMcp(){
  const context=document.modelContext;if(!context?.registerTool)return;
  const lifecycle=new AbortController();
  Promise.resolve(context.registerTool({name:'filter_security_events',title:'Фильтр событий',description:'Открывает журнал событий и фильтрует демонстрационные записи по тексту, уровню и источнику.',inputSchema:{type:'object',properties:{query:{type:'string'},severity:{type:'string',enum:['all','Критический','Высокий','Средний','Низкий']},source:{type:'string',enum:['all','Windows','Linux','Firewall','VPN','Endpoint','Application']}},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute(input={}){const severities=new Set(['all','Критический','Высокий','Средний','Низкий']);const sources=new Set(['all','Windows','Linux','Firewall','VPN','Endpoint','Application']);if(input.severity&&!severities.has(input.severity))throw new Error('Недопустимый уровень события');if(input.source&&!sources.has(input.source))throw new Error('Недопустимый источник события');if(input.query!==undefined&&typeof input.query!=='string')throw new Error('Поисковый запрос должен быть строкой');switchView('events');if(typeof input.query==='string')document.getElementById('event-search').value=input.query;if(input.severity)document.getElementById('severity-filter').value=input.severity;if(input.source)document.getElementById('source-filter').value=input.source;const result=renderEvents();return {count:result.length,view:'events'}}},{signal:lifecycle.signal})).catch(()=>{});
  Promise.resolve(context.registerTool({name:'set_demo_incident_status',title:'Изменить статус демо-инцидента',description:'Изменяет статус выбранного демонстрационного инцидента и обновляет интерфейс.',inputSchema:{type:'object',properties:{id:{type:'string'},status:{type:'string',enum:['Расследование','Ложное срабатывание','Закрыт']}},required:['id','status'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){const statuses=new Set(['Расследование','Ложное срабатывание','Закрыт']);if(!input||typeof input.id!=='string')throw new Error('Требуется идентификатор инцидента');if(!statuses.has(input.status))throw new Error('Недопустимый статус инцидента');if(!incidents.some(item=>item.id===input.id))throw new Error('Инцидент не найден');switchView('incidents');return setIncidentStatus(input.id,input.status)}},{signal:lifecycle.signal})).catch(()=>{});
}

renderEvents();renderDashboardIncidents();renderIncidentList();registerWebMcp();
