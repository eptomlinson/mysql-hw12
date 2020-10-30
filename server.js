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
    // console.log("connected properly")
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
};

function viewRole() {
    let query = `SELECT roles.id, title, salary, deptName
    FROM roles
    JOIN department
    ON department_id = department.id`
    connection.query(query, (err, result) => {
        if (err) throw err;
        console.log("\n\n");
        console.table(result);
    })
};

function viewDepartment() {
    let query = `SELECT department.id, department.deptName
    FROM department`;
    connection.query(query, (err, result) => {
        if (err) throw err;
        console.log("\n\n");
        console.table(result);
    })
};

function addDepartment(param) {
    let query = `INSERT INTO department(deptName)
    VALUES(?)`
    connection.query(query, [param], (err, result) => {
        if (err) throw err;
        console.log("\n\nDeptartment has been added!");
    })
};

function addRole(title, salary, deptID) {
    let query = `INSERT INTO roles(title, salary, department_id)
    VALUES(?,?,?)`
    connection.query(query, [title, salary, deptID], (err, result) => {
        if (err) throw err;
        console.log("\n\nRole has been added!");
    })
};

function addEmployee(first_name, last_name, role_id, manager_id) {
    // console.log(first_name, last_name, role_id, manager_id);
    let query = `INSERT INTO employee(first_name, last_name, role_id, manager_id)
    VALUES(?,?,?,?)`
    // console.log(query);
    connection.query(query, [first_name, last_name, role_id, manager_id], (err, result) => {
        if (err) console.log(err);
        console.log("\n\nEmployee has been added!");
    })
};

function updateRoles(title, salary, department_id) {
    let query = `UPDATE roles(title, salary, department_id)
SET(title,salary,department_id) = VALUES(?,?,?) WHERE title = ()`
    connection.query(query, [title, salary, department_id], (err, result) => {
        if (err) console.log(err);
        console.log("\n\nEmployee role has been updated!");
    })
};

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
                "Update an employee's role"
            ],
            name: "choice"
        }
    ]).then(initialChoice => {
        // console.log(initialChoice)
        if (initialChoice.choice == "View all Employees") {
            begin();
            viewAll();
        } else if (initialChoice.choice == "View all roles") {
            begin();
            viewRole();
        } else if (initialChoice.choice == "View all departments") {
            begin();
            viewDepartment();
        } else if (initialChoice.choice == "Add a new department") {
            inquirer.prompt([
                {
                    type: "input",
                    message: "What department do you want to add?",
                    name: "newDept"
                }
            ]).then(secondChoice => {
                addDepartment(secondChoice.newDept);
                begin();
            });
        } else if (initialChoice.choice == "Add a new role") {
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
                begin();
            });
        } else if (initialChoice.choice == "Add a new employee") {
            inquirer.prompt([
                {
                    type: "input",
                    message: "What is the new employee's first name?",
                    name: "first_name"
                },
                {
                    type: "input",
                    message: "What is the new employee's last name?",
                    name: "last_name"
                },
                {
                    type: "input",
                    message: "What is the new employee's role ID?",
                    name: "role_id"
                },
                {
                    type: "input",
                    message: "Who is the employee's manager? Use manager ID as answer:",
                    name: "manager_id"
                }
            ]).then(secondChoice => {
                // console.log(secondChoice);
                addEmployee(secondChoice.first_name, secondChoice.last_name, parseInt(secondChoice.role_id), parseInt(secondChoice.manager_id));
                begin();
            })
        }else if (initialChoice.choice == "Update an employee's role"){
            inquirer.prompt([
                {
                    type: "update",
                    message: "What title are you updating?",
                    name: "title"
                },
                {
                    type: "update",
                    message: "What salary are you updating?",
                    name: "salary"
                },
                {
                    type: "update",
                    message: "What department ID are you updating?",
                    name: "department_id"
                }
            ]).then(secondChoice => {
                updateRoles(secondChoice.title, parseInt(secondChoice.salary), parseInt(secondChoice.department_id));
                begin();
            })
        }
    })
};
begin();