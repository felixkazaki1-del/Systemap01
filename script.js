
let alters = JSON.parse(localStorage.getItem("alters")||"[]")
let pkToken = localStorage.getItem("pkToken")||""

document.getElementById("pkToken").value = pkToken

function toggleTheme(){
document.body.classList.toggle("dark")
}

function savePK(){
pkToken=document.getElementById("pkToken").value
localStorage.setItem("pkToken",pkToken)
alert("Token saved.")
}

async function syncPK(){

if(!pkToken){
alert("Add token first")
return
}

try{

let res = await fetch("https://api.pluralkit.me/v2/systems/@me",{
headers:{Authorization:pkToken}
})

let data = await res.json()

alert("Connected to system: "+data.name)

}catch(e){

alert("Sync failed")

}

}

function openAdd(){
document.getElementById("addModal").style.display="block"
}

function closeModal(){
document.getElementById("alterModal").style.display="none"
document.getElementById("addModal").style.display="none"
}

function addAlter(){

let file = document.getElementById("avatarInput").files[0]

let reader = new FileReader()

reader.onload = function(){

let alter={
name:document.getElementById("nameInput").value,
bio:document.getElementById("bioInput").value,
avatar:reader.result,
color:document.getElementById("colorInput").value,
group:document.getElementById("groupInput").value||"Ungrouped",
subgroup:document.getElementById("subgroupInput").value||"",
front:document.getElementById("frontPercent").value||0,
history:[{date:new Date().toLocaleDateString(),percent:document.getElementById("frontPercent").value||0}]
}

alters.push(alter)

save()

render()

closeModal()

}

if(file){
reader.readAsDataURL(file)
}else{
reader.onload()
}

}

function save(){
localStorage.setItem("alters",JSON.stringify(alters))
}

function render(){

let container=document.getElementById("groupsContainer")

container.innerHTML=""

let groups={}

alters.forEach(a=>{

if(!groups[a.group]) groups[a.group]=[]

groups[a.group].push(a)

})

for(let g in groups){

let div=document.createElement("div")
div.className="group"

let title=document.createElement("h2")
title.innerText=g

div.appendChild(title)

let grid=document.createElement("div")
grid.className="grid"

groups[g].forEach(a=>{

let card=document.createElement("div")
card.className="alterCard"
card.style.background=a.color+"cc"

let avatar=""

if(a.avatar){
avatar="<img class='avatar' src='"+a.avatar+"'>"
}

card.innerHTML=avatar+"<div>"+a.name+"</div>"

card.onclick=()=>openAlter(a)

grid.appendChild(card)

})

div.appendChild(grid)

container.appendChild(div)

}

}

function openAlter(a){

let modal=document.getElementById("alterModal")
let card=document.getElementById("modalCard")

modal.style.display="block"

card.style.background=a.color+"22"

document.getElementById("modalName").innerText=a.name

document.getElementById("modalBio").innerHTML=marked.parse(a.bio)

document.getElementById("modalAvatar").src=a.avatar||""

document.getElementById("modalFront").innerHTML="<b>Front %:</b> "+a.front

let h="<b>History</b><br>"

a.history.forEach(x=>{

h+=x.date+" – "+x.percent+"%<br>"

})

document.getElementById("modalHistory").innerHTML=h

}

document.getElementById("searchBar").addEventListener("input",e=>{

let q=e.target.value.toLowerCase()

document.querySelectorAll(".alterCard").forEach(card=>{

if(card.innerText.toLowerCase().includes(q)){
card.style.display="block"
}else{
card.style.display="none"
}

})

})

function exportData(){

let data=JSON.stringify(alters)

let blob=new Blob([data],{type:"application/json"})

let a=document.createElement("a")

a.href=URL.createObjectURL(blob)
a.download="system_backup.json"

a.click()

}

function importData(){

let input=document.createElement("input")
input.type="file"

input.onchange=e=>{

let file=e.target.files[0]

let reader=new FileReader()

reader.onload=function(){

alters=JSON.parse(reader.result)

save()

render()

}

reader.readAsText(file)

}

input.click()

}

render()
