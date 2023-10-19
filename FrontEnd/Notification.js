const overViewCardNodes = document.querySelectorAll('.overview-card');
const eventCategoryNode = document.querySelector('.event-category');
let anniversaryList = [];
let vacationList = [];
let benefitChangeList = [];
let birthDayList = [];
fetch('http://localhost:3000/employee')
    .then(response => response.json())
    .then(data => {
        let employeeList = data;
        let today = new Date();
        employeeList.forEach(item => {
            let startDate = new Date(item.Start_Date);
            let birthDay = new Date(item.Day_Of_Birth)
            if (startDate.getDate() === today.getDate() && startDate.getMonth() === today.getMonth() && startDate.getFullYear() < today.getFullYear()) {
                anniversaryList.push(item);
            }
            if (item['Vacation Days'] > 3) {
                vacationList.push(item);
            }
            if (Number(item.Workers_Comp_Code) > 1) {
                benefitChangeList.push(item);
            }
            if (birthDay.getDate() === today.getDate() && birthDay.getMonth() === today.getMonth()) {
                birthDayList.push(item);
            }
        });
        overViewCardNodes[0].children[1].textContent = `${anniversaryList.length}`;
        overViewCardNodes[1].children[1].textContent = `${vacationList.length}`;
        overViewCardNodes[2].children[1].textContent = `${benefitChangeList.length}`;
        overViewCardNodes[3].children[1].textContent = `${birthDayList.length}`;
        if(anniversaryList.length > 0) {
            eventCategoryNode.children[0].textContent = `Hiring Anniversaries`;
            anniversaryList.forEach(item => {
                const liNode = document.createElement('li');
                eventCategoryNode.children[1].appendChild(liNode);
                let startDate = new Date(item.Start_Date);
                let today = new Date();
                liNode.innerHTML = `
                <div class="event-details">
                    <h4>${item.First_Name} ${item.Last_Name}</h4>
                    <span class="event-date">Ngày ${startDate.getDate()} Tháng ${startDate.getMonth() + 1} Năm ${startDate.getFullYear()}</span>
                    <p>${today.getFullYear() - startDate.getFullYear()} years at the company</p>
                </div>
            `;
            })
        }
        else {
            eventCategoryNode.children[0].textContent = `Nothing Here`;
            eventCategoryNode.children[0].style.color = 'red';
        }
    
    })
    .catch(err => console.log(err))
// Anniversaries Notice
overViewCardNodes[0].children[2].children[0].addEventListener('click', () => {
    eventCategoryNode.children[1].innerHTML = ``;
    if(anniversaryList.length > 0) {
        eventCategoryNode.children[0].textContent = `Hiring Anniversaries`;
        anniversaryList.forEach(item => {
            const liNode = document.createElement('li');
            eventCategoryNode.children[1].appendChild(liNode);
            let startDate = new Date(item.Start_Date);
            let today = new Date();
            liNode.innerHTML = `
                <div class="event-details">
                    <h4>${item.First_Name} ${item.Last_Name}</h4>
                    <span class="event-date">Ngày ${startDate.getDate()} Tháng ${startDate.getMonth() + 1} Năm ${startDate.getFullYear()}</span>
                    <p>${today.getFullYear() - startDate.getFullYear()} years at the company</p>
                </div>
            `;
        })
    }
    else {
        eventCategoryNode.children[0].textContent = `Nothing Here`;
    }
 
})
// Vacation Notice
overViewCardNodes[1].children[2].children[0].addEventListener('click', () => {
    eventCategoryNode.children[1].innerHTML = ``;
    if(vacationList.length > 0) {
        eventCategoryNode.children[0].textContent = `Vacation Too Much`;
        vacationList.forEach(item => {
            const liNode = document.createElement('li');
            eventCategoryNode.children[1].appendChild(liNode);
            liNode.innerHTML = `
                <div class="event-details">
                    <h4>${item.First_Name} ${item.Last_Name}</h4>
                    <span class="event-date">Những Ngày Nghỉ: ${item['Vacation Day']}</span>
                    <p>Number Vacation Days: ${item['Vacation Days']} Days</p>
                </div>
            `;
        })
    }
    else {
        eventCategoryNode.children[0].textContent = `Nothing Here`;
    }
  
})
// Benefit Change Notice
overViewCardNodes[2].children[2].children[0].addEventListener('click', () => {
    eventCategoryNode.children[1].innerHTML = ``;
    if(benefitChangeList.length > 0) {
        eventCategoryNode.children[0].textContent = `Benefit Change`;
        benefitChangeList.forEach(item => {
            const liNode = document.createElement('li');
            eventCategoryNode.children[1].appendChild(liNode);
            liNode.innerHTML = `
                <div class="event-details">
                    <h4>${item.First_Name} ${item.Last_Name}</h4>
                    <p>Number Benefit Change: ${item.Workers_Comp_Code} Times</p>
                </div>
            `;
        })
    }
    else {
        eventCategoryNode.children[0].textContent = `Nothing Here`;
    }
  
})
// Birthday Notice
overViewCardNodes[3].children[2].children[0].addEventListener('click', () => {
    eventCategoryNode.children[1].innerHTML = ``;
    if(birthDayList.length > 0) {
        eventCategoryNode.children[0].textContent = `Birthday`;
        birthDayList.forEach(item => {
            const liNode = document.createElement('li');
            eventCategoryNode.children[1].appendChild(liNode);
            const birthDay = new Date(item.Day_Of_Birth);
            const today = new Date();
            liNode.innerHTML = `
                <div class="event-details">
                    <h4>${item.First_Name} ${item.Last_Name}</h4>
                    <span class="event-date">Birthday: Ngày ${birthDay.getDate()} Tháng ${birthDay.getMonth() + 1} Năm ${birthDay.getFullYear()}</span>
                    <p>Happy ${today.getFullYear() - birthDay.getFullYear()}th birthday</p>
                </div>
            `;
        })
    }
    else {
        eventCategoryNode.children[0].textContent = `Nothing Here`;
    }
})