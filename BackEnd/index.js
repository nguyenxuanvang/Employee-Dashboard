
// Import Express framework
const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const mysql = require('mysql2');

// Create an instance of Express
const app = express();
app.use(cors());
app.use(express.json());
const config = {
    server: 'localhost',
    user: 'sa',
    password: '123456',
    database: 'HR',
    trustServerCertificate: true
};

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'mydb'
});
const findNextID = (arr) => {
    let id = 0;
    id = arr[arr.length - 1].Employee_ID + 1;
    return id;
}
const formatDate = (str) => {
    if (str) {
        const arr = str.split('-');
        str = arr[1] + '-' + arr[2] + '-' + arr[0];
        return str;
    }
    return 'NULL';
}
// Define a route

app.get('/', (req, res) => {
    res.send('Hello');
});
let personList = [];
app.get('/person', async (req, res) => {
    let tableEmployment = [];
    await sql.connect(config)
        .then(pool => {

            
            return pool.request().query('select * from Personal');
        })
        .then(result => {
            personList = result.recordset;
        })
        .catch(err => {
            console.error('Error:', err);
        })
        .finally(() => {
            
            sql.close();
        });
    await sql.connect(config)
        .then(pool => {

            
            return pool.request().query('select * from Employment;');
        })
        .then(result => {
            tableEmployment = result.recordset;
        })
        .catch(err => {
            console.error('Error:', err);
        })
        .finally(() => {
            
            sql.close();
        });
    for (let i = 0; i < personList.length; i += 1) {
        for (let j = 0; j < tableEmployment.length; j += 1) {
            if (personList[i].Employee_ID === tableEmployment[j].Employee_ID) {
                personList.splice(i, 1);
            }
        }
    }
    res.json(personList);
});
let employeeList = [];
app.get('/employee', async (req, res) => {
    // Get Data từ Database HR
    let HR = [];
    let Payroll = [];
    await sql.connect(config)
        .then(pool => {
            return pool.request().query('select * from Personal,Employment,Emergency_Contacts,Job_History where (Personal.Employee_ID = Job_History.Employee_ID) and (Personal.Employee_ID = Emergency_Contacts.Employee_ID) and (Personal.Employee_ID = Employment.Employee_ID);');
        })
        .then(result => {
            HR = result.recordset;
            HR.forEach(item => {
                item.Employee_ID = item.Employee_ID[0];
            })
            for (let i = 0; i < HR.length - 1; i += 1) {
                for (let j = i + 1; j < HR.length; j += 1) {
                    if (HR[i].Employee_ID > HR[j].Employee_ID) {
                        let x = HR[i];
                        HR[i] = HR[j];
                        HR[j] = x;
                    }
                }
            }
            console.log('Lấy Dữ Liệu Từ HR Database Thành Công');
        })
        .catch(err => {
            console.error('Error:', err);
        })
        .finally(() => {
            sql.close();
        });

    // Get Data từ Database Pay Roll
    try {
        const query = "SELECT idEmployee as Employee_ID, `idPay Rates`, `Vacation Days`,`Paid To Date`,`Paid Last Year`,`Vacation Day`, (value - value * `Tax Percentage` / 100) as Salary FROM mydb.`employee`, mydb.`pay rates` WHERE mydb.`pay rates`.`idPay Rates` = mydb.`employee`.`Pay Rates_idPay Rates`";
        const [rows] = await connection.promise().query(query);
        Payroll = rows;
        for (let i = 0; i < Payroll.length - 1; i += 1) {
            for (let j = i + 1; j < Payroll.length; j += 1) {
                if (Payroll[i].Employee_ID > Payroll[j].Employee_ID) {
                    let x = Payroll[i];
                    Payroll[i] = Payroll[j];
                    Payroll[j] = x;
                }
            }
        }
        console.log('Lấy Dữ Liệu Từ PayRoll Database Thành Công');
    } catch (error) {
        console.error('Error executing query:', error);
    }
    // Gộp Data từ 2 bảng
    employeeList = [];
    for (let i = 0; i < HR.length; i += 1) {
        employeeList[i] = {
            ...HR[i],
            ...Payroll[i]
        }
    }
    res.json(employeeList);
});
app.get('/benefit', (req, res) => {
    sql.connect(config)
        .then(pool => {
            return pool.request().query('select Benefit_Plan_ID,Plan_Name from Benefit_Plans;');
        })
        .then(result => {
            res.json(result.recordset);
            console.log('Lấy Dữ Liệu Từ Benefit Plans Thành Công');
        })
        .catch(err => {
            console.error('Error:', err);
        })
        .finally(() => {
            sql.close();
        });
})
app.post('/person', async (req, res) => {
    let {
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
    } = req.body;
    Day_Of_Birth = formatDate(Day_Of_Birth);
    let fullPersonList = [];
    await sql.connect(config)
        .then(pool => {

            
            return pool.request().query('select * from Personal;');
        })
        .then(result => {
            fullPersonList = result.recordset;
        })
        .catch(err => {
            console.error('Error:', err);
        })
        .finally(() => {
            
            sql.close()
                .then(() => {
                    console.log('Kết nối đã được đóng.');
                })
                .catch(err => {
                    console.error('Lỗi khi đóng kết nối:', err);
                });
        });
    const id = findNextID(fullPersonList);
    sql.connect(config)
        .then(pool => {

            
            return pool.request().query(`INSERT INTO Personal (Employee_ID, First_Name, Last_Name, Middle_Initial, Address1, Address2, City, State, Zip, Email, Phone_Number, Social_Security_Number, Drivers_License, Marital_Status, Gender, Shareholder_Status, Benefit_Plans, Ethnicity,Day_Of_Birth) VALUES (${id}, '${First_Name}', '${Last_Name}', '${Middle_Initial}', '${Address1}', '${Address2}', '${City}', '${State}', ${Zip}, '${Email}', '${Phone_Number}', '${Social_Security_Number}', '${Drivers_License}', '${Marital_Status}', ${Gender}, ${Shareholder_Status}, ${Benefit_Plans}, '${Ethnicity}','${Day_Of_Birth}');`)
        })
        .then(result => {
            console.log('Thêm Thành Công');
            res.json({
                id,
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
        })
        .catch(err => {
            console.error('Error:', err);
        })
        .finally(() => {
           
            sql.close()
                .then(() => {
                    console.log('Kết nối đã được đóng.');
                })
                .catch(err => {
                    console.error('Lỗi khi đóng kết nối:', err);
                });
        });
})
app.post('/employee', async (req, res) => {
    let {
        Employee_ID,
        First_Name,
        Last_Name,
        SSN

    } = req.body;
    // insert vào table Employment
    await sql.connect(config)
        .then(pool => {
            
            return pool.request().query(`INSERT INTO Employment (Employee_ID,Employment_Status,Hire_Date,Workers_Comp_Code,Termination_Date,Rehire_Date,Last_Review_Date) Values (${Employee_ID},${null},${null},0,${null},${null},${null})`)
        })
        .then(result => {
            console.log('Thêm Thành Công vào bảng Employment');
        })
        .catch(err => {
            console.error('Error:', err);
        })
        .finally(() => {
            
            sql.close();
        });
    // insert vào table Job History
    await sql.connect(config)
        .then(pool => {
            
            let rootDate = '01-01-1800';
            return pool.request().query(`INSERT INTO Job_History (Employee_ID,Department,Division,Start_Date,End_Date,Job_Title,Supervisor,Job_Category,Location,Departmen_Code,Salary_Type,Pay_Period,Hours_Per_Week,Hazardous_Training) Values (${Employee_ID},${null},${null},${rootDate},${rootDate},${null},${null},${null},${null},${null},${null},${null},${null},${null})`)
        })
        .then(result => {
            console.log('Thêm Thành Công vào bảng Job History');
        })
        .catch(err => {
            console.error('Error:', err);
        })
        .finally(() => {
            
            sql.close();
        });
    //Insert vào table Emergency Contacts
    await sql.connect(config)
        .then(pool => {
            
            return pool.request().query(`INSERT INTO Emergency_Contacts (Employee_ID,Emergency_Contact_Name,Phone_Number,Relationship) Values (${Employee_ID},${null},${null},${null})`)
        })
        .then(result => {
            console.log('Thêm Thành Công vào bảng Emergency Contacts');
        })
        .catch(err => {
            console.error('Error:', err);
        })
        .finally(() => {
            
            sql.close();
        });
    //Insert vào table Employee
    try {
        const results = await new Promise((resolve, reject) => {
            connection.query("INSERT INTO mydb.employee (idEmployee, `Employee Number`, `Last Name`, `First Name`, SSN, `Pay Rate`, `Pay Rates_idPay Rates`, `Vacation Days`, `Paid To Date`, `Paid Last Year`,`Vacation Day`) VALUES (" + Employee_ID + ", " + Employee_ID + ", '" + Last_Name + "', '" + First_Name + "', " + SSN + ", 'Hourly', 1, 0, 0, 0,'')", function (err, results) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            });
        });

        console.log('Thêm Thành Công Vào Bảng Employee');
    } catch (err) {
        console.error('Error executing query:', err);
    }
    res.json(true);

})
app.patch('/employee', async (req, res) => {
    let {
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
    } = req.body;
    Day_Of_Birth = formatDate(Day_Of_Birth);
    Start_Date = formatDate(Start_Date);
    End_Date = formatDate(End_Date);
    VacationDay = formatDate(VacationDay);
    let VacationDays = 0;
    let payRate = (Salary_Type === '1') ? 'Hourly' : (Salary_Type === '2') ? 'Daily' : 'Monthly';
    // Update Bảng Personal
    await sql.connect(config)
        .then(pool => {
            
            return pool.request().query(`UPDATE Personal
            SET First_Name = '${First_Name}',Last_Name = '${Last_Name}',Middle_Initial = '${Middle_Initial}',Address1 = '${Address1}',Address2 = '${Address2}',City = '${City}',State = '${State}',Zip = ${Zip},
            Email = '${Email}',Phone_Number = '${Phone_Number}',Social_Security_Number = '${Social_Security_Number}',Drivers_License = '${Drivers_License}',Marital_Status = '${Marital_Status}',
            Gender = ${Gender},Shareholder_Status = 0,Benefit_Plans = ${Benefit_Plans},Ethnicity = '${Ethnicity}',Day_Of_Birth = '${Day_Of_Birth}'
            WHERE Employee_ID = ${Employee_ID};`)
        })
        .then(result => {
            console.log('Update Thành Công Vào Bảng Personal');
        })
        .catch(err => {
            console.error('Error:', err);
        })
        .finally(() => {
            
            sql.close();
        });
    // Update Bảng Employment
    await sql.connect(config)
        .then(pool => {
            
            return pool.request().query(`UPDATE Employment
            SET Employment_Status = '${Employment_Status}',Hire_Date = '${Start_Date}',Workers_Comp_Code = '${Workers_Comp_Code}',Termination_Date = null,Rehire_Date = null,Last_Review_Date = nulL
            WHERE Employee_ID = ${Employee_ID};`)
        })
        .then(result => {
            console.log('Update Thành Công Vào Bảng Employment');
        })
        .catch(err => {
            console.error('Error:', err);
        })
        .finally(() => {
            
            sql.close();
        });
    // Update Bảng Job History
    await sql.connect(config)
        .then(pool => {
            
            return pool.request().query(`UPDATE Job_History
            SET Department = '${Department}',Division = '${Division}',Start_Date = '${Start_Date}',End_Date = '${End_Date}',Job_Title = '${Job_Title}',Supervisor = ${Supervisor},
            Job_Category = '${Job_Category}',Location = '${Location}',Departmen_Code = ${Departmen_Code},Salary_Type = ${Salary_Type},Pay_Period = '${Pay_Period}',Hours_per_Week = ${Hours_Per_Week},Hazardous_Training = ${Hazardous_Training}
            WHERE Employee_ID = ${Employee_ID};`)
        })
        .then(result => {
            console.log('Update Thành Công Vào Bảng Job History');
        })
        .catch(err => {
            console.error('Error:', err);
        })
        .finally(() => {
            
            sql.close();
        });
    // Update Bảng Emergency Contacts
    await sql.connect(config)
        .then(pool => {
            
            return pool.request().query(`UPDATE Emergency_Contacts
            SET Emergency_Contact_Name = '${Emergency_Contact_Name}',Phone_Number = '${Phone_NumberE}',Relationship = '${Relationship}'
            WHERE Employee_ID = ${Employee_ID};`)
        })
        .then(result => {
            console.log('Update Thành Công Vào Bảng Emergency Contacts');
        })
        .catch(err => {
            console.error('Error:', err);
        })
        .finally(() => {
            
            sql.close();
        });
    // Get Vacation Days
    try {
        const query = "select `Vacation Day`,`Vacation Days` from mydb.`employee` where `Employee Number` = " + Employee_ID + ";";
        const [rows] = await connection.promise().query(query);
        if (VacationDay !== 'NULL') {
            if (rows[0]['Vacation Days'] > 0) {
                VacationDay = rows[0]['Vacation Day'] + "," + VacationDay;
                VacationDays = rows[0]['Vacation Days'] + 1;
            }
            else {
                VacationDays = rows[0]['Vacation Days'] + 1;
            }
        }
        else {
            if (rows[0]['Vacation Days'] === 0) {
                VacationDay = '';
            }
            else {
                VacationDay = rows[0]['Vacation Day'];
                VacationDays = rows[0]['Vacation Days'];
            }
        }
    } catch (error) {
        console.error('Error executing query:', error);
    }
    //Update bảng Employee
    try {
        const results = await new Promise((resolve, reject) => {
            connection.query("UPDATE `mydb`.`employee` SET `Last Name` = '" + Last_Name + "', `First Name` = '" + First_Name + "', `SSN` = '" + Social_Security_Number + "', `Pay Rate` = '" + payRate + "', `Pay Rates_idPay Rates` = '" + Salary_Type + "',`Paid To Date` = '" + PaidToDate + "',`Paid Last Year` = '" + PaidLastYear + "', `Vacation Days` = '" + VacationDays + "', `Vacation Day` = '" + VacationDay + "' WHERE (`Employee Number` = '" + Employee_ID + "');", function (err, results) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            });
        });

        console.log('Update Thành Công Vào Bảng Employee');
    } catch (err) {
        console.error('Error executing query:', err);
    }
    res.json(true);

})
app.delete('/employee', async (req, res) => {
    const {
        Employee_ID
    } = req.body;
    // Delete Từ Bảng Employment
    await sql.connect(config)
        .then(pool => {
            
            return pool.request().query(`DELETE FROM Employment WHERE Employee_ID = ${Employee_ID};`)
        })
        .then(result => {
            console.log('Xóa Thành Công Từ Bảng Employment');
        })
        .catch(err => {
            console.error('Error:', err);
        })
        .finally(() => {
            
            sql.close();
        });
    // Delete Từ Bảng Job History
    await sql.connect(config)
        .then(pool => {
            
            return pool.request().query(`DELETE FROM Job_History WHERE Employee_ID = ${Employee_ID};`)
        })
        .then(result => {
            console.log('Xóa Thành Công Từ Bảng Job History');
        })
        .catch(err => {
            console.error('Error:', err);
        })
        .finally(() => {
            
            sql.close();
        });
    // Delete Từ Bảng Emergency Contacts
    await sql.connect(config)
        .then(pool => {
            
            return pool.request().query(`DELETE FROM Emergency_Contacts WHERE Employee_ID = ${Employee_ID};`)
        })
        .then(result => {
            console.log('Xóa Thành Công Từ Bảng Emergency Contacts');
        })
        .catch(err => {
            console.error('Error:', err);
        })
        .finally(() => {
            
            sql.close();
        });
    //Delete Từ Bảng Employee
    try {
        const results = await new Promise((resolve, reject) => {
            connection.query("DELETE FROM `mydb`.employee WHERE `Employee Number` = '" + Employee_ID + "';", function (err, results) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            });
        });

        console.log('Xóa Thành Công Từ Bảng Employee');
    } catch (err) {
        console.error('Error executing query:', err);
    }
    res.json(true);
})
app.get('/fullperson', (req, res) => {

    sql.connect(config)
        .then(pool => {

            
            return pool.request().query('select *,(Deductable*Percentage_CoPay)/100 as Benefit_Paid from Personal,Benefit_Plans where (Personal.Benefit_Plans = Benefit_Plans.Benefit_Plan_ID);');
        })
        .then(result => {
            res.json(result.recordset);
        })
        .catch(err => {
            console.error('Error:', err);
        })
        .finally(() => {
            
            sql.close()
                .then(() => {
                    console.log('Kết nối đã được đóng.');
                })
                .catch(err => {
                    console.error('Lỗi khi đóng kết nối:', err);
                });
        });
})
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});