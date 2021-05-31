var mydata = JSON.parse(aboutUs);
console.log(mydata);
document.getElementById('infolist').innerHTML = "<pre>"+JSON.stringify(mydata)+"</pre>";
