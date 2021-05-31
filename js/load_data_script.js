var mydata = JSON.parse(data);

document.getElementById('about_text').innerHTML = mydata.aboutUsText;

document.getElementById('achievements-text').innerHTML = mydata.achievementsText;

var i;
text = ``;
for (i = 0; i < mydata.achievement_cards.length; i++) {
  text += `<div class="card">
    <div class="card-title">`+
      mydata.achievement_cards[i].title +`
    </div>
    <div class="card-text content1">`+
      mydata.achievement_cards[i].details +`
    </div>
  </div>`
}

document.getElementById('achievement_cards').innerHTML = text

var i;
text = ``;
if (mydata.upcoming_list.length > 0){
  for (i = 0; i < mydata.upcoming_list.length; i++) {
    text += `<div class="li">`+mydata.upcoming_list[i]+`</div>`
  }
} else {
  text += `<div class="li">Nothing here as of now. Check back later!</div>`
}

document.getElementById('upcoming_list').innerHTML = text
