let runId=0;

function rand(arr){
return arr[Math.floor(Math.random()*arr.length)];
}

function makeUser(){
const country=rand(countries);
const f=rand(firstNames);
const l=rand(lastNames);

const username=(f+l+Math.floor(Math.random()*9999)).toLowerCase();

return{
name:`${f} ${l}`,
username,
email:`${username}@${rand(emails)}`,
phone:country.p+Math.floor(1000000000+Math.random()*9000000000),
country:country.c
};
}

function show(data){
document.getElementById("userOut").value=JSON.stringify(data,null,2);
}

function genUser(){
show(makeUser());
}

function genBulk(){
const count=parseInt(document.getElementById("bulkCount").value)||50;
const arr=[];
for(let i=0;i<count;i++)arr.push(makeUser());
show(arr);
}

function copyUser(){
navigator.clipboard.writeText(document.getElementById("userOut").value);
}

function exportJSON(){
const blob=new Blob([document.getElementById("userOut").value],{type:"application/json"});
const a=document.createElement("a");
a.href=URL.createObjectURL(blob);
a.download="users.json";
a.click();
}

function exportCSV(){
const data=JSON.parse(document.getElementById("userOut").value);
let csv="name,username,email,phone,country\n";
data.forEach(u=>{
csv+=`${u.name},${u.username},${u.email},${u.phone},${u.country}\n`;
});
const blob=new Blob([csv],{type:"text/csv"});
const a=document.createElement("a");
a.href=URL.createObjectURL(blob);
a.download="users.csv";
a.click();
}

document.getElementById("genBtn").onclick=genUser;
document.getElementById("bulkBtn").onclick=genBulk;
document.getElementById("copyBtn").onclick=copyUser;
