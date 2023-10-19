const formInputNode = document.querySelector('.form_input');
const addNode = document.querySelector('.add');
const masterWrapperPageNode = document.querySelector('.master-wrapper-page');
const cancelFormNode = document.querySelector('.form_input .btn-cancel-form');
const addNewPerSonNode = document.querySelector('.add-person');
const subFormNode = document.querySelector('.sub-form');
const inputPersonDivNodes = document.querySelectorAll('.sub-form .form-insert-person div');
const addPersonNode = document.querySelector('.sub-form .btn-add-subform button');
const cancelsubFormNode = document.querySelector('.btn-cancel-subform');
const tablePersonNode = document.querySelector('.body-form .table');
const formInformationNode = document.querySelector('.form-information');
const cancelFormInformationNode = document.querySelector('.cancel-form-information');
const formChangePersonNode = document.querySelector('.form-change-person');
const cancelFormChangePersonNode = document.querySelector('.cancel-form-change-person');
const formEditInformationNode = document.querySelector('.form-edit-information');
const addEmployeebtn = document.querySelector('.btn-add-person-to-employee');
const cancelFormEditInformationNode = document.querySelector('.cancel-edit-form-information');
const headerFormInformationNode = document.querySelector('.header-form-information');
const detailInformationNode = document.querySelector('.detail-information');
const headerEditFormInformationNode = document.querySelector('.header-edit-form-information');
const editInformationNode = document.querySelector('.edit-information');
const employeeTBodyNode = document.querySelector('.data-table tbody');
const saveEditbtn = document.querySelector('.btn-update-information');
let employeeList = [];
let benefitPlanList = [];
fetch('http://localhost:3000/benefit')
    .then(response => response.json())
    .then(data => benefitPlanList = data)
fetch('http://localhost:3000/employee')
    .then(response => response.json())
    .then(data => {
        employeeList = data;
        employeeList.forEach(item => {
            const trNode = document.createElement('tr');
            employeeTBodyNode.appendChild(trNode);
            const date = new Date(item.Day_Of_Birth);
            trNode.innerHTML = `
            <td>${item.Employee_ID}</td>
            <td>${item.First_Name}</td>
            <td>${item.Last_Name}</td>
            <td>${(item.Gender) ? 'Nam' : 'Nữ'}</td>
            <td>${(!item.Employment_Status) ? 'Chưa Cập Nhật' : item.Employment_Status}</td>
            <td>${(!item.Department) ? 'Chưa Cập Nhật' : item.Department}</td>
            <td>${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}</td>
            <td>${item.Phone_Number[0]}</td>
            <td>${(item['idPay Rates'] === 1) ? Number(item.Salary).toFixed(0) + ' USD/Hour' : (item['idPay Rates'] === 2) ? Number(item.Salary).toFixed(0) + ' USD/Day' : Number(item.Salary).toFixed(0) + ' USD/Month'}</td>
            <td>
                <button>Edit</button>
                <button>Delete</button>
            </td>
        `;
            const editNode = trNode.children[9].children[0];
            
            editNode.addEventListener('click', (e) => {
                let Day_Of_Birth = new Date(item.Day_Of_Birth);
                let Start_Date = new Date(item.Start_Date);
                let End_Date = new Date(item.End_Date);
                e.stopPropagation();
                formEditInformationNode.style.display = 'block';
                headerEditFormInformationNode.textContent = `Cập Nhật Thông Tin Của Nhân Viên ${item.First_Name} ${item.Last_Name}`;
                editInformationNode.innerHTML = `
                <div>
                    <p>First Name</p>
                    <input value="${item.First_Name}" type="text">
                </div>
                <div>
                    <p>Last Name</p>
                    <input value="${item.Last_Name}" type="text">
                </div>
                <div>
                    <p>Middle Initiale</p>
                    <input value="${item.Middle_Initial}" type="text">
                </div>
                <div>
                    <p>Address 1</p>
                    <input value="${item.Address1}" type="text">
                </div>
                <div>
                    <p>Address 2</p>
                    <input value="${item.Address2}" type="text">
                </div>
                <div>
                    <p>City</p>
                    <input value="${item.City}" type="text">
                </div>
                <div>
                    <p>State</p>
                    <input value="${item.State}" type="text">
                </div>
                <div>
                    <p>Zip</p>
                    <input value="${item.Zip}" type="number">
                </div>
                <div>
                    <p>Email</p>
                    <input value="${item.Email}" type="text">
                </div>
                <div>
                    <p>Phone Number</p>
                    <input value="${item.Phone_Number[0]}" type="text">
                </div>
                <div>
                    <p>Date of Birth</p>
                    <input value="${Day_Of_Birth.getFullYear()}-${((Day_Of_Birth.getMonth() + 1) > 9) ? Day_Of_Birth.getMonth() + 1 : '0' + String(Day_Of_Birth.getMonth() + 1)}-${(Day_Of_Birth.getDate() > 9) ? Day_Of_Birth.getDate() : '0' + String(Day_Of_Birth.getDate())}" type="date">
                </div>
                <div>
                    <p>Social Security Number</p>
                    <input value="${item.Social_Security_Number}" type="text" placeholder="allow null">
                </div>
                <div>
                    <p>Driver License</p>
                    <input value="${item.Drivers_License}" type="text" placeholder="allow null">
                </div>
                <div>
                    <p>Marital Status</p>
                    <select>
                        ${(item.Marital_Status === 'Married') ? '<option value="Married" selected>Married</option> <option value="Single">Single</option>' : '<option value="Married">Married</option> <option selected value="Single">Single</option>'}  
                    </select>
                </div>
                <div>
                    <p>Gender</p>
                    <select>
                        ${(item.Gender === true) ? '<option value="1" selected>Nam</option> <option value="0">Nữ</option>' : '<option value="1">Nam</option> <option selected value="0">Nữ</option>'}
                    </select>
                </div>
                <div>
                    <p>Shareholder Status</p>
                    <span>False</span>
                </div>
                <div>
                    <p>Benefit Plans</p>
                    <select>
                        ${benefitPlanList.map(element => (
                    `<option ${(item.Benefit_Plans === element.Benefit_Plan_ID) ? 'selected' : ''} value='${element.Benefit_Plan_ID}'>${element.Plan_Name}</option>`
                ))}
                    </select>
                </div>
                <div>
                    <p>Ethnicity</p>
                    <select>
                    ${(item.Ethnicity === "Kinh") ?'<option value="Kinh" selected>Kinh</option><option value="Other">Other</option>':'<option value="Kinh">Kinh</option><option value="Other" selected>Other</option>' }
                    </select>
                </div>
                <div>
                    <p>Department</p>
                    <select>
                        <option ${(item.Department === 'Marketing') ? 'selected' : ''} value="Marketing">Marketing</option>
                        <option ${(item.Department === 'Sales') ? 'selected' : ''} value="Sales">Sales</option>
                        <option ${(item.Department === 'Finance') ? 'selected' : ''} value="Finance">Finance</option>
                        <option ${(item.Department === 'Operations') ? 'selected' : ''} value="Operations">Operations</option>
                    </select>
                </div>
                <div>
                    <p>Division</p>
                    <input value="${item.Division}" type="text" placeholder="allow null">
                </div>
                <div>
                    <p>Start Date</p>
                    <input value="${Start_Date.getFullYear()}-${((Start_Date.getMonth() + 1) > 9) ? Start_Date.getMonth() + 1 : '0' + String(Start_Date.getMonth() + 1)}-${(Start_Date.getDate() > 9) ? Start_Date.getDate() : '0' + String(Start_Date.getDate())}" type="date">
                </div>
                <div>
                    <p>End Date</p>
                    <input value="${End_Date.getFullYear()}-${((End_Date.getMonth() + 1) > 9) ? End_Date.getMonth() + 1 : '0' + String(End_Date.getMonth() + 1)}-${(End_Date.getDate() > 9) ? End_Date.getDate() : '0' + String(End_Date.getDate())}" type="date">
                </div>
                <div>
                    <p>Job Title</p>
                    <input value="${item.Job_Title}" type="text" placeholder="allow null">
                </div>
                <div>
                    <p>Supervisor</p>
                    <input value="${(!item.Supervisor) ? 0 : item.Supervisor}" type="number" placeholder="allow null">
                </div>
                <div>
                    <p>Job Category</p>
                    <select>
                        ${(item.Job_Category === 'Website') ? '<option value="Website" selected>Website</option> <option value="Mobile">Mobile</option> <option value="Desktop">Desktop</option>' : (item.Job_Category === 'Mobile') ? '<option value="Website">Website</option> <option value="Mobile" selected>Mobile</option> <option value="Desktop">Desktop</option>' : '<option value="Website">Website</option> <option value="Mobile">Mobile</option> <option value="Desktop" selected>Desktop</option>'}
                    </select>
                </div>
                <div>
                    <p>Location</p>
                    <input value="${item.Location}" type="text" placeholder="allow null">
                </div>
                <div>
                    <p>Departmen Code</p>
                    <input value="${(!item.Departmen_Code) ? 0 : item.Departmen_Code}" type="number" placeholder="allow null">
                </div>
                <div>
                    <p>Salary Type</p>
                    <select value="${item['idPay Rates']}">
                        ${(item['idPay Rates'] === 1) ? '<option value="1" selected>Hourly</option> <option value="2">Daily</option> <option value="3">Monthly</option>' : (item['idPay Rates'] === 2) ? '<option value="1">Hourly</option> <option value="2" selected>Daily</option> <option value="3">Monthly</option>' : '<option value="1">Hourly</option> <option value="2">Daily</option> <option value="3" selected>Monthly</option>'}
                    </select>
                </div>
                <div>
                    <p>Pay Period</p>
                    <input value="${item.Pay_Period}" type="text" placeholder="allow null">
                </div>
                <div>
                    <p>Hours Per Week</p>
                    <input value="${(!item.Hours_Per_Week) ? 0 : item.Hours_Per_Week}" type="number" placeholder="allow null">
                </div>
                <div>
                    <p>Hazardous Training</p>
                    <select>
                        <option ${(item.Hazardous_Training) ? 'selected' : ''} value="1">True</option>
                        <option ${(item.Hazardous_Training) ? '' : 'selected'} value="0">False</option>
                    </select>
                </div>
                <div>
                    <p>Emergency Contact Name</p>
                    <input value="${item.Emergency_Contact_Name}" type="text" placeholder="allow null">
                </div>
                <div>
                    <p>Emergency Phone Number</p>
                    <input value="${item.Phone_Number[1]}" type="text" placeholder="allow null">
                </div>
                <div>
                    <p>Relationship</p>
                    <input value="${item.Relationship}"type="text" placeholder="allow null">
                </div>
                <div>
                    <p>Employment Status</p>
                    <select>
                        ${(item.Employment_Status === 'Active') ? '<option value="Active" selected>Active</option> <option value="Rehired">Rehired</option>' : '<option value="Active">Active</option> <option value="Rehired" selected>Rehired</option>'}
                    </select>
                </div>
                <div>
                    <p>Vacation Day</p>
                    <input type="date">
                </div>
                <div>
                    <p>Paid To Date</p>
                    <input value="${item['Paid To Date']}" type="number">
                </div>
                <div>
                    <p>Paid Last Year</p>
                    <input value="${item['Paid Last Year']}" type="number">
                </div>
            </div>
                `;
                saveEditbtn.addEventListener('click', () => {
                    console.log(`Save ${item.Employee_ID} ${item.First_Name} ${item.Last_Name}`);
                    const inputNodes = editInformationNode.querySelectorAll('input');
                    const selectNodes = editInformationNode.querySelectorAll('select');
                    const Employee_ID = item.Employee_ID;
                    const First_Name = inputNodes[0].value;
                    const Last_Name = inputNodes[1].value;
                    const Middle_Initial = inputNodes[2].value;
                    const Address1 = inputNodes[3].value;
                    const Address2 = inputNodes[4].value;
                    const City = inputNodes[5].value;
                    const State = inputNodes[6].value;
                    const Zip = inputNodes[7].value;
                    const Email = inputNodes[8].value;
                    const Phone_Number = inputNodes[9].value;
                    const Day_Of_Birth = inputNodes[10].value;
                    const Social_Security_Number = inputNodes[11].value;
                    const Drivers_License = inputNodes[12].value;
                    const Marital_Status = selectNodes[0].value;
                    const Gender = selectNodes[1].value;
                    const Benefit_Plans = selectNodes[2].value;
                    const Ethnicity = selectNodes[3].value;
                    const Department = selectNodes[4].value;
                    const Division = inputNodes[13].value;
                    const Start_Date = inputNodes[14].value;
                    const End_Date = inputNodes[15].value;
                    const Job_Title = inputNodes[16].value;
                    const Supervisor = inputNodes[17].value;
                    const Job_Category = selectNodes[5].value;
                    const Location = inputNodes[18].value;
                    const Departmen_Code = inputNodes[19].value;
                    const Salary_Type = selectNodes[6].value;
                    const Pay_Period = inputNodes[20].value;
                    const Hours_Per_Week = inputNodes[21].value;
                    const Hazardous_Training = selectNodes[7].value;
                    const Emergency_Contact_Name = inputNodes[22].value;
                    const Phone_NumberE = inputNodes[23].value;
                    const Relationship = inputNodes[24].value;
                    const Employment_Status = selectNodes[8].value;
                    const VacationDay = inputNodes[25].value;
                    const PaidToDate = inputNodes[26].value;
                    const PaidLastYear = inputNodes[27].value;
                    let Workers_Comp_Code = '';
                    if(item.Benefit_Plans !== Number(Benefit_Plans)) {
                        Workers_Comp_Code = Number(item.Workers_Comp_Code) + 1;
                    }
                    else {
                        Workers_Comp_Code = Number(item.Workers_Comp_Code);
                    }
                    

                    fetch('http://localhost:3000/employee', {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            Employee_ID,
                            First_Name,
                            Last_Name,
                            Middle_Initial,
                            Address1,
                            Address2,
                            City,
                            State,
                            Zip,
                            Email,
                            Phone_Number,
                            Day_Of_Birth,
                            Social_Security_Number,
                            Drivers_License,
                            Marital_Status,
                            Gender,
                            Benefit_Plans,
                            Ethnicity,
                            Department,
                            Division,
                            Start_Date,
                            End_Date,
                            Job_Title,
                            Supervisor,
                            Job_Category,
                            Location,
                            Departmen_Code,
                            Salary_Type,
                            Pay_Period,
                            Hours_Per_Week,
                            Hazardous_Training,
                            Emergency_Contact_Name,
                            Phone_NumberE,
                            Relationship,
                            Employment_Status,
                            Workers_Comp_Code,
                            VacationDay,
                            PaidToDate,
                            PaidLastYear
                        })
                    })
                        .then(respones => respones.json())
                        .then(result => {
                            if (result) {
                                alert(`Cập Nhật Thông Tin Nhân Viên ${item.First_Name} ${item.Last_Name} Thành Công`);
                                location.reload();
                            }
                            else {
                                alert('Cập Nhật Lỗi');
                            }
                        })
                        .catch(err => console.log(err))
                })
            })
            
            const deletebtn = trNode.children[9].children[1];
            deletebtn.addEventListener('click', (e) => {
                e.stopPropagation();
                let choice = confirm(`Bạn Muốn Xóa ${item.First_Name} ${item.Last_Name}`);
                if(choice) {
                    fetch('http://localhost:3000/employee', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        Employee_ID: item.Employee_ID
                    })
                })
                    .then(result => {
                        if (result) {
                            alert('Xóa Thành Công');
                            location.reload();
                        }
                        else {
                            alert('Xóa Thất Bại');
                        }
                    })
                    .catch(err => console.log(err));
                }
            })
                trNode.addEventListener('click', () => {
                    
                    let Day_Of_Birth = new Date(item.Day_Of_Birth);
                    let Start_Date = new Date(item.Start_Date);
                    let End_Date = new Date(item.End_Date);
                    let Hire_Date = new Date(item.Hire_Date);
                    formInformationNode.style.display = 'block';
                    headerFormInformationNode.textContent = `Thông Tin Chi Tiết Của Nhân Viên ${item.First_Name} ${item.Last_Name}`;
                    detailInformationNode.innerHTML = `
                    <div>
                        <p>First Name</p>
                        <span>${item.First_Name}</span>
                    </div>
                    <div>
                        <p>Last Name</p>
                        <span>${item.Last_Name}</span>
                    </div>
                    <div>
                        <p>Middle Initiale</p>
                        <span>${item.Middle_Initial}</span>
                    </div>
                    <div>
                        <p>Address 1</p>
                        <span>${item.Address1}</span>
                    </div>
                    <div>
                        <p>Address 2</p>
                        <span>${item.Address2}</span>
                    </div>
                    <div>
                        <p>City</p>
                        <span>${item.City}</span>
                    </div>
                    <div>
                        <p>State</p>
                        <span>${item.State}</span>
                    </div>
                    <div>
                        <p>Zip</p>
                        <span>${item.Zip}</span>
                    </div>
                    <div>
                        <p>Email</p>
                        <span>${item.Email}</span>
                    </div>
                    <div>
                        <p>Phone Number</p>
                        <span>${item.Phone_Number[0]}</span>
                    </div>
                    <div>
                        <p>Date of Birth</p>
                        <span>${Day_Of_Birth.getDate()}/${Day_Of_Birth.getMonth() + 1}/${Day_Of_Birth.getFullYear()}</span>
                    </div>
                    <div>
                        <p>Social Security Number</p>
                        <span>${item.Social_Security_Number}</span>
                    </div>
                    <div>
                        <p>Driver License</p>
                        <span>${item.Drivers_License}</span>
                    </div>
                    <div>
                        <p>Marital Status</p>
                        <span>${item.Marital_Status}</span>
                    </div>
                    <div>
                        <p>Gender</p>
                        <span>${(item.Gender) ? 'Nam' : 'Nữ'}</span>
                    </div>
                    <div>
                        <p>Shareholder Status</p>
                        <span>${item.Shareholder_Status}</span>
                    </div>
                    <div>
                        <p>Benefit Plans</p>
                        <span>${item.Benefit_Plans}</span>
                    </div>
                    <div>
                        <p>Ethnicity</p>
                        <span>${item.Ethnicity}</span>
                    </div>
                    <div>
                        <p>Department</p>
                        <span>${item.Department}</span>
                    </div>
                    <div>
                        <p>Division</p>
                        <span>${item.Division}</span>
                    </div>
                    <div>
                        <p>Start Date</p>
                        <span>${Start_Date.getDate()}/${Start_Date.getMonth() + 1}/${Start_Date.getFullYear()}</span>
                    </div>
                    <div>
                        <p>End Date</p>
                        <span>${End_Date.getDate()}/${End_Date.getMonth() + 1}/${End_Date.getFullYear()}</span>
                    </div>
                    <div>
                        <p>Job Title</p>
                        <span>${item.Job_Title}</span>
                    </div>
                    <div>
                        <p>Supervisor</p>
                        <span>${item.Supervisor}</span>
                    </div>
                    <div>
                        <p>Job Category</p>
                        <span>${item.Job_Category}</span>
                    </div>
                    <div>
                        <p>Location</p>
                        <span>${item.Location}</span>
                    </div>
                    <div>
                        <p>Department Code</p>
                        <span>${item.Departmen_Code}</span>
                    </div>
                    <div>
                        <p>Salary Type</p>
                        <span>${(item['idPay Rates'] === 1) ? 'Hourly' : (item['idPay Rates'] === 2) ? 'Daily' : 'Monthly'}</span>
                    </div>
                    <div>
                        <p>Salary</p>
                        <span>${Number(item.Salary)}</span>
                    </div>
                    <div>
                        <p>Pay Period</p>
                        <span>${item.Pay_Period}</span>
                    </div>
                    <div>
                        <p>Hours Per Week</p>
                        <span>${item.Hours_per_Week}</span>
                    </div>
                    <div>
                        <p>Hazardous Training</p>
                        <span>${item.Hazardous_Training}</span>
                    </div>
                    <div>
                        <p>Emergency Contact Name</p>
                        <span>${item.Emergency_Contact_Name}</span>
                    </div>
                    <div>
                        <p>Emergency Phone Number</p>
                        <span>${item.Phone_Number[1]}</span>
                    </div>
                    <div>
                        <p>Relationship</p>
                        <span>${item.Relationship}</span>
                    </div>
                    <div>
                        <p>Employment Status</p>
                        <span>${item.Employment_Status}</span>
                    </div>
                    <div>
                        <p>Hire Date</p>
                        <span>${Hire_Date.getDate()}/${Hire_Date.getMonth() + 1}/${Hire_Date.getFullYear()}</span>
                    </div>
                    <div>
                        <p>Workers Comp Code</p>
                        <span>${item.Workers_Comp_Code}</span>
                    </div>
                    <div>
                        <p>Vacation Days</p>
                        <span>${item['Vacation Days']}</span>
                    </div>
                    <div>
                        <p>Paid To Date</p>
                        <span>${item['Paid To Date']} USD</span>
                    </div>
                    <div>
                        <p>Paid Last Year</p>
                        <span>${item['Paid Last Year']} USD</span>
                    </div>
                `;
                })
            })
        })

let personList = [];
addNode.addEventListener('click', async () => {
    tablePersonNode.innerHTML = `
                    <div class="thead">
                        <span>Person ID</span>
                        <span>First Name</span>
                        <span>Last Name</span>
                        <span>Middle Initial</span>
                        <span>Address 1</span>
                        <span>Address 2</span>
                        <span>City</span>
                        <span>State</span>
                        <span>Zip</span>
                        <span>Email</span>
                        <span>Phone Number</span>
                        <span>Date Of Birth</span>
                        <span>Social Security Number</span>
                        <span>Driver License</span>
                        <span>Marital Status</span>
                        <span>Gender</span>
                        <span>Shareholder Status</span>
                        <span>Benefit Plans</span>
                        <span>Ethnicity</span>
                        <span>Add To Employee</span>
                    </div>
                `;
    formInputNode.style.display = 'block';
    masterWrapperPageNode.style.opacity = '0.5';
    masterWrapperPageNode.classList.add('cancel-event');
    const respone = await fetch('http://localhost:3000/person');
    personList = await respone.json();
    personList.forEach(item => {
        const date = new Date(item.Day_Of_Birth);
        const tbodyNode = document.createElement('div');
        tbodyNode.classList.add('tbody');
        tablePersonNode.appendChild(tbodyNode);
        tbodyNode.innerHTML = `
                    <span>${item.Employee_ID}</span>
                    <span>${item.First_Name}</span>
                    <span>${item.Last_Name}</span>
                    <span>${item.Middle_Initial}</span>
                    <span>${item.Address1}</span>
                    <span>${item.Address2}</span>
                    <span>${item.City}</span>
                    <span>${item.State}</span>
                    <span>${item.Zip}</span>
                    <span>${item.Email}</span>
                    <span>${item.Phone_Number}</span>
                    <span>${(item.Day_Of_Birth !== null) ? `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}` : 'Chưa Có Ngày'}</span>
                    <span>${item.Social_Security_Number}</span>
                    <span>${item.Drivers_License}</span>
                    <span>${item.Marital_Status}</span>
                    <span>${item.Gender}</span>
                    <span>${item.Shareholder_Status}</span>
                    <span>${item.Benefit_Plans}</span>
                    <span>${item.Ethnicity}</span>
                    <span class="changePerson">>>></span>
                `;
        const spanNode = tbodyNode.children[tbodyNode.children.length - 1];
        spanNode.addEventListener('click', async () => {
            if (!item.Shareholder_Status) {
                let isChange = confirm(`Bạn có muốn Thêm ${item.First_Name} ${item.Last_Name} Thành Nhân Viên Không ?`);
                if (isChange) {
                    const respone = await fetch('http://localhost:3000/employee', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            Employee_ID: item.Employee_ID,
                            First_Name: item.First_Name,
                            Last_Name: item.Last_Name,
                            SSN: item.Social_Security_Number
                        })
                    });
                    const result = await respone.json();
                    if (result) {
                        alert('Thêm Thành Công');
                        location.reload();
                    }
                    else {
                        alert('Thêm Thất Bại');
                    }
                }
            }
            else {
                alert(`Không Thể Thêm ${item.First_Name} ${item.Last_Name} Thành Nhân Viên`);
            }
        })
    })
})
// Tắt Form Input
cancelFormNode.addEventListener('click', () => {
    formInputNode.style.display = 'none';
    masterWrapperPageNode.style.opacity = '1';
    masterWrapperPageNode.classList.remove('cancel-event');
})
let check = true;
// Hiển Thị Sub Form
addNewPerSonNode.addEventListener('click', () => {
    subFormNode.style.display = 'block';
    const selectPersonNodes = document.querySelectorAll('.sub-form .form-insert-person div select');
    console.log(selectPersonNodes)
    addPersonNode.addEventListener('click', async () => {
        check = true;
        for (let i = 0; i < inputPersonDivNodes.length; i += 1) {
            if (!inputPersonDivNodes[i].children[1].value) {
                check = false;
                break;
            }
        }
        if (check) {
            const First_Name = inputPersonDivNodes[0].children[1].value;
            const Last_Name = inputPersonDivNodes[1].children[1].value;
            const Middle_Initial = inputPersonDivNodes[2].children[1].value;
            const Address1 = inputPersonDivNodes[3].children[1].value;
            const Address2 = inputPersonDivNodes[4].children[1].value;
            const City = inputPersonDivNodes[5].children[1].value;
            const State = inputPersonDivNodes[6].children[1].value;
            const Zip = inputPersonDivNodes[7].children[1].value;
            const Email = inputPersonDivNodes[8].children[1].value;
            const Phone_Number = inputPersonDivNodes[9].children[1].value;
            const Day_Of_Birth = inputPersonDivNodes[10].children[1].value;
            const Social_Security_Number = inputPersonDivNodes[11].children[1].value;
            const Drivers_License = inputPersonDivNodes[12].children[1].value;
            const Marital_Status = selectPersonNodes[0].children[1].value;
            const Gender = selectPersonNodes[1].children[1].value;
            const Shareholder_Status = selectPersonNodes[2].children[1].value;
            const Benefit_Plans = 1;
            const Ethnicity = selectPersonNodes[3].children[1].value;
            const respone = await fetch('http://localhost:3000/person', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    First_Name,
                    Last_Name,
                    Middle_Initial,
                    Address1,
                    Address2,
                    City,
                    State,
                    Zip,
                    Email,
                    Phone_Number,
                    Day_Of_Birth,
                    Social_Security_Number,
                    Drivers_License,
                    Marital_Status,
                    Gender,
                    Shareholder_Status,
                    Benefit_Plans,
                    Ethnicity
                })
            });
            const result = await respone.json();
            if (result) {
                alert('Thêm Thành Công');
                location.reload();
            }
        }
        else {
            alert("Không Được Phép Bỏ Trống");
        }
    })
})
// Tắt Sub Form
cancelsubFormNode.addEventListener('click', () => {
    subFormNode.style.display = 'none';
})

cancelFormEditInformationNode.addEventListener('click', () => {
    formEditInformationNode.style.display = 'none';
})
cancelFormInformationNode.addEventListener('click', () => {
    formInformationNode.style.display = 'none';
})

