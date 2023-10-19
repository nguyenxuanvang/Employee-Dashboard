const totalEmployeeNode = document.querySelector('.content-first-left .total:nth-child(1) p');
let employeeList = [];
fetch('http://localhost:3000/employee')
.then(response => response.json())
.then(data => {
    employeeList = data;
    totalEmployeeNode.textContent = `${employeeList.length}`;
})
.catch(err => console.log(err))
