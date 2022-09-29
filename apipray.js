let api     = "https://api.aladhan.com/v1/calendarByCity?city=",
    search  =  document.querySelector('#search'),
    input   =  document.querySelector('input'),
    date    = new Date();
    
let place = [];
if(localStorage.location_pray == null){
    place = [];
}else{
    localStorage.location_pray.split(',').forEach(ele => {
        document.querySelector('.city-location').innerHTML +=`
        <span class="material-icons" onclick=locationSpan(this.innerText)>place ${ele.toUpperCase()}
        </span>
        `;
        place.unshift(ele);
    });
    document.querySelector('.city-location button').style.display = 'block';
}

//s
function clearlocal(){
    localStorage.removeItem('location_pray');
    document.querySelector('.city-location button').style.display= 'none';
    document.querySelectorAll('.city-location span').forEach((span)=>{
        span.remove();
    })
}

//
search.addEventListener('click',async (e)=>{
    e.preventDefault();
    let result = await getdata();
    if (input.value.length == 0 || input.value.length < 2 || result == undefined) {
        document.querySelector('.searche-box h4').innerHTML = 'الرجاء التاكد من الاسم';
    }else{
    document.querySelector('.output h4').innerHTML = input.value;
    document.querySelector('.output span').innerHTML =`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;    
    document.querySelector('.city-location').innerHTML +=`
    <span class="material-icons" onclick=locationSpan(this.innerText)>place ${input.value.toUpperCase()}
    </span>
    `;
    document.querySelector('.city-location button').style.display = 'block';
    place.unshift(input.value);
    localStorage.setItem('location_pray',place);
    TagGenerator(result);
    };
});

//Get all times prays from the api 
async function TagGenerator(result){
        document.querySelector('.searche-box h4').innerHTML = '';
        document.querySelector('.city-info').style.transform = 'rotate(0)';
        input.value = '';
        const AllPraysBox = document.createElement('div');
        AllPraysBox.classList.add('prays-box');
    let prays = {
        Sunrise : 'شروق الشمس',
        Fajr    : 'الفجر',
        Dhuhr   :'الظهر' , 
        Asr     : 'العصر',
        Maghrib : 'المغرب',
        Sunset  : 'غروب الشمس',
        Isha    : 'العشاء',
        Imsak   : 'الامساك',
    };
    Object.entries(prays).map((salat)=>{
        let prayBox = document.createElement('div');
        prayBox.classList.add('pray-box');
        let prayTitle = document.createElement('h4');
        let prayTime  = document.createElement('h4');
        prayTitle.innerText = salat[1];
        prayTime.innerHTML  = result[salat[0]].split(' ')[0];
        prayBox.appendChild(prayTitle);
        prayBox.appendChild(prayTime);
        AllPraysBox.appendChild(prayBox);
    });
    if(document.querySelector('.output .prays-box')==null){
        document.querySelector('.output').appendChild(AllPraysBox);
    }else{
        document.querySelector('.output .prays-box').remove();
        document.querySelector('.output').appendChild(AllPraysBox);
}
};

//
async function locationSpan(value){
    input.value = value.split(' ')[1];
    document.querySelector('.output h4').innerHTML = input.value.toUpperCase();
    document.querySelector('.output span').innerHTML =`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
    let result = await getdata();
    TagGenerator(result);
}
//
async function getdata (){
    
    const response = await fetch(`
        ${api}${input.value}&country=${input.value}&method=2&month=${date.getMonth()}&year=${date.getFullYear}
        `);
        if(response.status  == 200){
            const dataonresp = await response.json();
            let AllPrays = dataonresp.data[date.getDate()].timings;    
            return AllPrays;
        }else{
            return undefined;
        };
    }