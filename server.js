const inquirer = require("inquirer");
const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootroot",
    database: "employees"
})

connection.connect(err => {
    if (err) throw err
    console.log("connected properly")
})
console.log("Welcome to my Company")

function viewAll() {
    let query = `SELECT employee.id, first_name, last_name, title, salary, deptName, manager_id
    FROM employee
    JOIN roles
    ON role_id = roles.id
    JOIN department
    ON department_id = department.id`
    connection.query(query, (err, result) => {
        if (err) throw err;
        console.log("\n\n")
        console.table(result)
    })
}

function viewRole(){
    let query = `SELECT roles.id, title, salary, deptName
    FROM roles
    JOIN department
    ON department_id = department.id`
    connection.query(query, (err, result) =>{
        if (err) throw err;
        console.log("\n\n");
        console.table(result);
    })
}

function viewDepartment(){
    let query = `SELECT department.id, department.deptName
    FROM department`;
    connection.query(query, (err, result) => {
        if(err) throw err;
        console.log("\n\n");
        console.table(result);
    })
}

function addDepartment(param){
    let query = `INSERT INTO department(deptName)
    VALUES(?)`
    connection.query(query, [param], (err, result) =>{
        if(err) throw err;
        console.log("\n\nDocuments Have been Added!");
    })
};

function addRole(title, salary, deptID){
    let query = `INSERT INTO roles(title, salary, department_id)
    VALUES(?,?,?)`
    connection.query(query, [title, salary, deptID], (err, result) => {
        if(err) throw err;
        console.log("\n\nDocuments Have been Added!");
    })
}

function begin() {
    inquirer.prompt([
        {
            type: "list",
            message: "What do you want to do?",
            choices: [
                "Add a new department",
                "Add a new role",
                "Add a new employee",
                "View all departments",
                "View all roles",
                "View all Employees",
                "Update an employees role"
            ],
            name: "choice"
        }
    ]).then(initialChoice => {
        console.log(initialChoice)
        if (initialChoice.choice == "View all Employees") {
            begin();
            viewAll();
        } else if(initialChoice.choice == "View all roles") {
            begin();
            viewRole();
        }else if(initialChoice.choice == "View all departments"){
            begin();
            viewDepartment();
        }else if(initialChoice.choice == "Add a new department"){
            inquirer.prompt([
                {
                    type: "input",
                    message: "What department do you want to add?",
                    name: "newDept"
                }
            ]).then(secondChoice => {
                addDepartment(secondChoice.newDept);
                begin();
            })
        }else if(initialChoice.choice == "Add a new role"){
            inquirer.prompt([
                {
                    type: "input",
                    message: "What role would you like to add?",
                    name: "title"
                },
                {
                    type: "input",
                    message: "How much money do they make?",
                    name: "salary"
                },
                {
                    type: "input",
                    message: "Which department (by ID) does this role belong to?",
                    name: "deptID"
                }
            ]).then(secondChoice => {
                addRole(secondChoice.title, parseInt(secondChoice.salary), parseInt(secondChoice.deptID))
                begin()
            })
        }
    })
}
begin();