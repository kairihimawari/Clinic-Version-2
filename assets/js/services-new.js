let cart=[];

const cartBtn=document.getElementById("cartBtn");
const drawer=document.getElementById("cartDrawer");
const cartItems=document.getElementById("cartItems");
const cartTotal=document.getElementById("cartTotal");
const cartCount=document.getElementById("cartCount");

const checkoutBtn=document.getElementById("checkoutBtn");
const checkoutModal=document.getElementById("checkoutModal");
const closeCheckout=document.getElementById("closeCheckout");

const delivery=document.getElementById("delivery");
const finalTotal=document.getElementById("finalTotal");

const breakSubtotal=document.getElementById("breakSubtotal");
const breakInterest=document.getElementById("breakInterest");
const breakShipping=document.getElementById("breakShipping");
const breakFirst=document.getElementById("breakFirst");
const breakSecond=document.getElementById("breakSecond");

const paymentMethod=document.getElementById("paymentMethod");

document.querySelectorAll(".add").forEach(btn=>{

btn.addEventListener("click",()=>{

let name=btn.dataset.name;
let price=parseInt(btn.dataset.price);
let image=btn.dataset.image;

let item=cart.find(i=>i.name===name);

if(item){item.qty++}
else{cart.push({name,price,image,qty:1})}

renderCart();

});

});

function renderCart(){

cartItems.innerHTML="";
let total=0;

cart.forEach((item,i)=>{

let div=document.createElement("div");

div.innerHTML=
`${item.name} x${item.qty} - ₱${item.price*item.qty} <button onclick="removeItem(${i})">x</button>`;

cartItems.appendChild(div);

total+=item.price*item.qty;

});

cartTotal.textContent=total;
cartCount.textContent=cart.length;

updateTotal();

}

function removeItem(i){
cart.splice(i,1);
renderCart();
}

window.removeItem=removeItem;

cartBtn.onclick=()=>{
drawer.classList.toggle("open")
}

checkoutBtn.onclick=()=>{

if(cart.length===0){
alert("Cart empty")
return
}

checkoutModal.style.display="flex";
updateTotal();

}

closeCheckout.onclick=()=>{
checkoutModal.style.display="none";
}

delivery.onchange=updateTotal;
paymentMethod.onchange=updateTotal;

function updateTotal(){

let subtotal = cart.reduce((a,b)=>a+b.price*b.qty,0);

let interest = 0;
let shipping = 0;

let deliveryText = delivery.selectedOptions[0].text;
let deliveryValue = delivery.value;

let isInstallment = paymentMethod.value === "Installment";
let isInternational = deliveryText.includes("International");
let isCOD = deliveryText.includes("COD");
let isPayNow = deliveryText.includes("Pay Now");

/* =========================
   INTERNATIONAL SHIPMENT
========================= */

if(isInternational){

subtotal = 20000;
interest = 0;
shipping = 0;

paymentMethod.value = "Full Payment";
paymentMethod.disabled = true;

}else{

paymentMethod.disabled = false;

/* =========================
   SHIPPING RULES
========================= */

if(isCOD){
shipping = 500;
}

if(isPayNow){
shipping = 0;
}

/* =========================
   INSTALLMENT INTEREST
========================= */

if(isInstallment){
interest = subtotal * 0.20;
}

}

/* =========================
   TOTAL
========================= */

let total = subtotal + interest + shipping;

finalTotal.textContent = Math.round(total);

/* =========================
   BREAKDOWN
========================= */

breakSubtotal.textContent = Math.round(subtotal);
breakInterest.textContent = Math.round(interest);
breakShipping.textContent = Math.round(shipping);

/* =========================
   INSTALLMENT BREAKDOWN
========================= */

if(isInstallment && !isInternational){

let installmentTotal = subtotal + interest;

let half = installmentTotal / 2;

let firstPayment = half + shipping;
let secondPayment = half;

breakFirst.textContent = Math.round(firstPayment);
breakSecond.textContent = Math.round(secondPayment);

}else{

breakFirst.textContent = Math.round(total);
breakSecond.textContent = "0";

}

}

document.getElementById("orderForm").addEventListener("submit", function(e){

e.preventDefault();

let orderID = "MED-" + Date.now();

let timestamp = new Date().toLocaleString();

let fullName = document.getElementById("name").value;
let email = document.getElementById("email").value;

let address = document.getElementById("address").value;
let phone = document.getElementById("phone").value;

let deliveryMode = document.getElementById("delivery").selectedOptions[0].text;

let paymentMethodValue = paymentMethod.value;

let shippingCost = parseInt(delivery.value || 0);

let subtotal = cart.reduce((a,b)=>a+b.price*b.qty,0);

let interest = paymentMethodValue==="Installment" ? subtotal*0.20 : 0;

let total = subtotal + interest + shippingCost;

let orderItems = cart.map(item => ({
name:item.name,
price:item.price,
image_url:item.image || "",
qty:item.qty
}));

let file=document.getElementById("gcashProof").files[0];

if(file){

let reader=new FileReader();

reader.onload=function(){

sendEmail(reader.result);

}

reader.readAsDataURL(file);

}else{

sendEmail("");

}

function sendEmail(proof){

let templateParams={

order_id:orderID,
order_date:timestamp,

full_name:fullName,
address:address,
contact_number:phone,
email:email,

delivery_mode:deliveryMode,
payment_method:paymentMethodValue,

orders:orderItems,

gcash_proof:proof,

cost:{
subtotal:subtotal,
interest:interest,
shipping:shippingCost,
total:total
}

};

emailjs.send(
"YOUR_SERVICE_ID",
"YOUR_TEMPLATE_ID",
templateParams
)

.then(()=>{

alert("Order Sent Successfully!");

cart=[];
renderCart();

checkoutModal.style.display="none";
document.body.classList.remove("modal-open");
});

}

});
