const $=q=>document.querySelector(q);
const R=v=>(v<0?"−":"")+"R$ "+Math.abs(Math.round(v)).toLocaleString("pt-BR");
const SAL=2500,FIX=1600,TOTAL=10;
const NIV=["Noob","Aprendiz","Veterano","Lenda"];
let s,ev,dl=null;
dl={save:async({filename,data})=>{const u=URL.createObjectURL(new Blob([data],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}));const a=document.createElement("a");a.href=u;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000)}};
const fresh=()=>({m:1,cash:300,fix:FIX,card:0,loan:0,inst:[],interest:0,happy:5,xp:0,combo:0,log:[]});
const debt=()=>s.card+s.loan+s.inst.reduce((a,i)=>a+i.amt*i.left,0);
const net=()=>s.cash-debt();
const lvl=()=>Math.min(3,Math.floor(s.xp/300));

const EV=[
()=>({e:"📱",t:"Fase 1: o celular que morreu",d:"O celular do Thaw só liga se ele rezar. A loja grita: R$ 1.800 em 10x “sem juros” de R$ 180. Seu dedo já está coçando.",o:[
 {l:"Parcelar em 10x de R$ 180",q:"meh",h:2,f:s=>s.inst.push({n:"Parcela do celular",amt:180,left:10}),tip:"Sem juros declarados, mas são R$ 180 a menos por 10 meses. Parcela é renda do futuro já gasta."},
 {l:"Consertar o antigo por R$ 150",q:"good",h:0,f:s=>s.cash-=150,tip:"Celular vivo, orçamento vivo. O Dr. Juros 👾 saiu de mãos vazias."},
 {l:"Esperar e juntar o dinheiro",q:"good",h:-1,f:s=>{},tip:"Paciência é um power-up raro. Cobra um pouco de ansiedade, mas protege o bolso."}]}),
()=>({e:"🦷",t:"Fase 2: o dente rebelde",d:"Aquele dente que ele ignorava resolveu protestar. Conta do dentista: R$ 600.",o:[
 {l:"Pagar com o dinheiro da conta",q:s=>s.cash>=600?"good":"bad",h:0,f:s=>s.cash-=600,tip:"Pagar do saldo evita juros. Reserva existe exatamente para dente rebelde."},
 {l:"Passar no cartão e ver depois",q:"meh",h:0,f:s=>s.card+=600,tip:"No cartão você só adiou a dor. Fatura não paga inteira vira rotativo, e o Dr. Juros adora."},
 {l:"Empréstimo “rapidinho” de R$ 600",q:"bad",h:0,f:s=>s.loan+=600,tip:"Crédito de aprovação rápida costuma cobrar juros altos. É o golpe de chefão fase 2."}]}),
()=>s.card>0?({e:"🧾",t:"Fase 3: a fatura chegou",d:"Você deve "+R(s.card)+" no cartão. O banco, muito gentil, oferece pagar só o mínimo (15%). Que fofo.",o:[
 {l:"Pagar a fatura inteira",q:s=>s.cash>=s.card?"good":"meh",h:0,f:s=>{s.cash-=s.card;s.card=0},tip:"Fatura paga inteira, rotativo zerado. Se faltar saldo, o cheque especial entra, então fique de olho."},
 {l:"Pagar só o mínimo",q:"bad",h:1,f:s=>{const p=s.card*.15;s.cash-=p;s.card-=p},tip:"O restante cai no rotativo, um dos juros mais altos do mercado. A dívida cresce sozinha, tipo planta."}]}):
({e:"🏖️",t:"Fase 3: viagem com a galera",d:"O grupo combinou praia no fim de semana: R$ 700 no total. Todo mundo já postou “vai ser épico”.",o:[
 {l:"Ir e pagar com o saldo",q:s=>s.cash>=700?"good":"bad",h:3,f:s=>s.cash-=700,tip:"Lazer faz parte do jogo, e pagar do saldo é o modo barato."},
 {l:"Ir e parcelar no cartão",q:"meh",h:3,f:s=>s.card+=700,tip:"Divertido agora, vira fatura depois. Sem pagar tudo, entra o rotativo."},
 {l:"Ficar em casa e guardar",q:"good",h:-1,f:s=>{},tip:"Perdeu o rolê, ganhou fôlego no orçamento."}]}),
()=>({e:"💬",t:"Fase 4: “crédito aprovado!”",d:"Chegou uma mensagem: R$ 1.500 na hora, sem burocracia. Pra quem você não pediu nada. Suspeito de graça.",o:[
 {l:"Aceitar e usar o dinheiro",q:"bad",h:2,f:s=>{s.loan+=1500;s.cash+=1500},tip:"Dinheiro fácil sai caro: o juro corre todo mês sobre tudo."},
 {l:"Pedir o CET e comparar",q:"good",h:0,f:s=>{},tip:"O Custo Efetivo Total junta juros, tarifas e encargos. É a lupa certa para comparar propostas."},
 {l:"Ignorar a mensagem",q:"good",h:0,f:s=>{},tip:"Ninguém precisa contratar crédito só porque ofereceram."}]}),
()=>({e:"💰",t:"Fase 5: freela caiu na conta",d:"Entrou R$ 800 extra! "+(s.card+s.loan>0?"Mas tem dívida de juros altos rondando.":"E as contas estão em dia, que luxo.")+" O que o Thaw faz?",o:[
 {l:"Quitar primeiro a dívida mais cara",q:"good",h:1,f:s=>{let r=800;for(const k of ["card","loan"]){const p=Math.min(s[k],r);s[k]-=p;r-=p}s.cash+=r},tip:"Mate primeiro o juro mais alto: rotativo, depois empréstimo. É o ataque crítico."},
 {l:"Guardar tudo na conta",q:s=>s.card+s.loan>0?"bad":"good",h:0,f:s=>s.cash+=800,tip:"Guardar é ótimo sem dívida. Com dívida cara, você paga mais juros do que a reserva rende."},
 {l:"Gastar R$ 500 num fim de semana",q:"meh",h:3,f:s=>s.cash+=300,tip:"Recompensa com moderação. Sobraram R$ 300 do extra."}]}),
()=>({e:"🤝",t:"Fase 6: o amigo do Pix",d:"O Léo manda: “mano, me empresta R$ 300 até sexta?” Sexta de qual ano, Léo?",o:[
 {l:"Emprestar os R$ 300",q:"meh",h:1,f:s=>s.cash-=300,tip:"Dinheiro emprestado a amigo raramente volta rápido. Empreste só o que você aguenta perder."},
 {l:"Emprestar R$ 100 e explicar o limite",q:"good",h:1,f:s=>s.cash-=100,tip:"Ajudou sem se comprometer. Limite combinado evita briga."},
 {l:"Dizer não, com carinho",q:"good",h:-1,f:s=>{},tip:"Dizer não ao orçamento dos outros é proteger o seu."}]}),
()=>({e:"📺",t:"Fase 7: o cemitério de assinaturas",d:"Thaw descobre que paga 7 streamings, R$ 190 por mês, e assiste só a 2. Um deles ele nem lembra o nome.",o:[
 {l:"Cancelar 5 e ficar com os 2 que usa",q:"good",h:0,f:s=>s.fix-=140,tip:"Gasto pequeno e recorrente é vazamento. Cortar 5 libera R$ 140 por mês, de graça."},
 {l:"Manter tudo, vai que eu uso",q:"bad",h:1,f:s=>{},tip:"Vai que não usa. Assinatura esquecida é o Dr. Juros sem precisar de juros."},
 {l:"Cancelar todos",q:"meh",h:-2,f:s=>s.fix-=190,tip:"Economiza R$ 190, mas diversão zero também desanima. Equilíbrio é o segredo."}]}),
()=>({e:"🚗",t:"Fase 8: o carro do tio quebrou",d:"Você pegou o carro emprestado e ele fez um barulho que lembra um dragão. Oficina: R$ 900.",o:[
 {l:"Pagar com o saldo",q:s=>s.cash>=900?"good":"bad",h:0,f:s=>s.cash-=900,tip:"Quem tem reserva dorme melhor. Sem saldo suficiente, o cheque especial cobra caro."},
 {l:"Passar no cartão",q:"meh",h:0,f:s=>s.card+=900,tip:"Cartão adia, não cancela. Pague a fatura inteira ou volte ao rotativo."},
 {l:"Pegar empréstimo de R$ 900",q:"bad",h:0,f:s=>s.loan+=900,tip:"Juros de empréstimo por um imprevisto que a reserva cobriria. Chefão fácil de evitar."}]}),
()=>({e:"🎣",t:"Fase 9: o golpe do Pix",d:"Mensagem: “Você ganhou R$ 500! Clique no link e confirme seus dados do Pix.” O Thaw sente um frio na barriga.",o:[
 {l:"Clicar e confirmar os dados",q:"bad",h:-3,f:s=>s.cash-=400,tip:"Era golpe: R$ 400 foram embora. Prêmio que pede senha não é prêmio."},
 {l:"Ignorar e bloquear o número",q:"good",h:1,f:s=>{},tip:"Defesa perfeita. Desconfie de prêmio, urgência e link."},
 {l:"Conferir no app oficial do banco",q:"good",h:1,f:s=>{},tip:"Na dúvida, abra o app oficial por conta própria. Nunca pelo link recebido."}]}),
()=>({e:"👹",t:"Chefão: Black Friday",d:"A TV dos sonhos custa R$ 2.000 à vista ou 12x de R$ 230 (R$ 2.760 no total). O Dr. Juros 👾 aparece de capa e sussurra: “parcela, parcela...”",o:[
 {l:"Parcelar em 12x de R$ 230",q:"bad",h:3,f:s=>s.inst.push({n:"Parcela da TV",amt:230,left:12}),tip:"R$ 760 a mais em juros embutidos e 12 meses de orçamento preso. Dano crítico."},
 {l:"Pagar à vista",q:s=>s.cash>=2000?"good":"bad",h:3,f:s=>s.cash-=2000,tip:"À vista costuma ter desconto. Sem saldo suficiente, o cheque especial entra e dói."},
 {l:"Não comprar agora",q:"good",h:-1,f:s=>{},tip:"Promoção imperdível sempre volta. Chefão derrotado sem gastar um centavo."}]})
];

function head(){
 const c=s.cash<0?"neg":"";
 $("#hud").innerHTML=`<div class="hud"><div class="chip"><small>Fase</small><b>${Math.min(s.m,TOTAL)}/${TOTAL}</b></div>
 <div class="chip"><small>${s.cash<0?"Cheque especial":"Saldo"}</small><b class="${c}">${R(s.cash)}</b></div>
 <div class="chip"><small>Dívidas</small><b class="${debt()>0?"neg":""}">${R(debt())}</b></div>
 <div class="chip"><small>Juros pagos</small><b class="${s.interest>0?"neg":""}">${R(s.interest)}</b></div></div>
 <div class="xp"><span class="px">Nv.${lvl()+1}</span><div class="bar" aria-label="Experiência"><i style="width:${Math.min(100,(s.xp%300)/3)}%"></i></div><span>${NIV[lvl()]}${s.combo>1?" 🔥x"+s.combo:""}</span></div>`;
}
const face=h=>["😭","😭","😢","😕","😐","🙂","😊","😄","😄","🤩","🤩"][Math.max(0,Math.min(10,h))];

function intro(){
 s=fresh();head();
 $("#app").innerHTML=`<div class="card"><div class="big">🧑‍💻</div><h1>DÍVIDA EM JOGO</h1>
 <p>Esse é o Thaw, 22 anos, primeiro emprego. Salário de ${R(SAL)}, ${R(FIX)} de contas fixas e já 14 ofertas de cartão na caixa de mensagens.</p>
 <p style="margin-top:10px">São 10 fases de decisões sobre crédito, golpes e tentações. Ganhe XP, mantenha o Thaw feliz e derrote o Dr. Juros 👾 no chefão final. Quem passar ganha um prêmio de verdade.</p>
 <button class="go" onclick="show()">START ▶</button>
 <p class="notice">Taxas ilustrativas: rotativo 14% ao mês, empréstimo 9% e cheque especial 8%. Projeto acadêmico da UNISA, sem fins de consultoria financeira.</p></div>`;
}
function show(){
 head();ev=EV[s.m-1]();
 $("#app").innerHTML=`<div class="card"><div class="big">${ev.e}</div><h2>${ev.t}</h2><p>${ev.d}</p>
 <div class="mood"><span>${face(s.happy)}</span><div class="bar" aria-label="Felicidade do Thaw"><i style="width:${s.happy*10}%;background:var(--cyan)"></i></div></div>
 ${ev.o.map((o,i)=>`<button class="opt" onclick="pick(${i})">${o.l}</button>`).join("")}</div>`;
}
function pick(i){
 const o=ev.o[i],q=typeof o.q==="function"?o.q(s):o.q,before=s.interest;
 o.f(s);s.happy=Math.max(0,Math.min(10,s.happy+o.h));
 if(q==="good"){s.combo++;s.xp+=100+Math.min(s.combo,5)*20}else{s.combo=0;if(q==="meh")s.xp+=40}
 s.log.push({m:s.m,l:o.l,q,tip:o.tip});
 const L=close();head();
 const tag={good:"BOA! +XP 🎉",meh:"MAIS OU MENOS 🤔",bad:"OPS… 😬"}[q];
 const j=s.interest-before;
 $("#app").innerHTML=`<div class="card"><span class="tag ${q}">${tag}</span><p>${o.tip}</p>
 ${j>0?`<p class="muted" style="margin-top:8px">👾 O Dr. Juros faturou ${R(j)} neste mês.</p>`:""}
 <h2 style="margin-top:16px">Fechando a fase ${s.m}</h2>
 <ul class="stmt">${L.map(x=>`<li><span>${x[0]}</span><b class="${x[1]<0?"neg":""}">${R(x[1])}</b></li>`).join("")}</ul>
 <button class="go" onclick="next()">${s.m<TOTAL?"PRÓXIMA FASE ▶":"VER RESULTADO ▶"}</button></div>`;
}
function close(){
 const L=[["Salário",SAL],["Contas fixas",-s.fix]];
 s.cash+=SAL-s.fix;
 s.inst.forEach(i=>{s.cash-=i.amt;i.left--;L.push([i.n,-i.amt])});
 s.inst=s.inst.filter(i=>i.left>0);
 const j=(k,r,n)=>{const x=s[k]*r;s[k]+=x;s.interest+=x;L.push([n,-x])};
 if(s.card>0)j("card",.14,"Juros do rotativo (14%)");
 if(s.loan>0)j("loan",.09,"Juros do empréstimo (9%)");
 if(s.cash<0){const x=-s.cash*.08;s.cash-=x;s.interest+=x;L.push(["Juros do cheque especial (8%)",-x])}
 return L;
}
function next(){s.m++;s.m>TOTAL?end():show()}
function end(){
 head();const good=s.log.filter(x=>x.q==="good").length,pass=net()>=0&&good>=6;
 const t=pass?(s.interest<300?["🏆","LENDA DO CRÉDITO"]:["🎓","VETERANO DO CRÉDITO"]):["💀","GAME OVER… POR ENQUANTO"];
 const gift=pass?`<div style="text-align:center;margin:18px 0 4px"><div class="chest">🎁</div><h2>Baú desbloqueado!</h2>
 <p>Prêmio: a <b>Planilha do Thaw</b>, para controlar gastos de verdade, com resumo mensal, regra 50/30/20 e mapa de dívidas.</p>
 ${dl?`<button class="go" onclick="gift()">BAIXAR PLANILHA ▼</button><p id="gmsg" class="notice"></p>`:`<p class="notice">O download não está disponível neste ambiente. Peça a planilha ao autor do projeto.</p>`}</div>`:
 `<p style="margin-top:14px">Para abrir o baú você precisa de pelo menos 6 boas escolhas e patrimônio final positivo. Tem revanche, e o Dr. Juros já está rindo.</p>`;
 $("#app").innerHTML=`<div class="card"><div class="big">${t[0]}</div><h1>${t[1]}</h1>
 <ul class="stmt"><li><span>Patrimônio final (saldo menos dívidas)</span><b class="${net()<0?"neg":""}">${R(net())}</b></li>
 <li><span>Juros pagos ao Dr. Juros</span><b>${R(s.interest)}</b></li>
 <li><span>Boas escolhas</span><b>${good} de ${TOTAL}</b></li>
 <li><span>Nível final</span><b>${NIV[lvl()]}</b></li>
 <li><span>Felicidade do Thaw</span><b>${face(s.happy)}</b></li></ul>
 ${gift}
 <h2 style="margin-top:20px">O que cada decisão ensinou</h2>
 <ul class="log">${s.log.map(x=>`<li>${{good:"🟢",meh:"🟡",bad:"🔴"}[x.q]} <b>Fase ${x.m}: ${x.l}.</b> <span class="muted">${x.tip}</span></li>`).join("")}</ul>
 <button class="go" onclick="intro()">${pass?"JOGAR DE NOVO ↻":"REVANCHE ↻"}</button></div>`;
}
async function gift(){
 const m=$("#gmsg");
 try{
  const b=Uint8Array.from(atob(XLSX),c=>c.charCodeAt(0));
  await dl.save({filename:"planilha-thaw-controle-de-gastos.xlsx",data:b});
  m.textContent="Planilha salva. Agora é só preencher a aba Lançamentos!";
 }catch(e){m.textContent=e&&e.code==="declined"?"Sem problemas, o baú continua aqui.":"Não foi possível salvar a planilha neste ambiente."}
}
intro();
