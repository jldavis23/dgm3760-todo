const express = require('express')
const app = express()
const port = 3000

const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

let todos = [
    {
        id: 1,
        name: "do homework",
        isComplete: false,
        category: 3,
        editMode: false
    },
    {
        id: 2,
        name: "submit report",
        isComplete: false,
        category: 2,
        editMode: false
    },
    {
        id: 3,
        name: "go grocery shopping",
        isComplete: true,
        category: 1,
        editMode: false
    }
]
let todoID = todos.length + 1


// GET TODOS
app.get('/api/todos', (req, res) => {
    res.send(todos)
})

// POST TODO
app.post('/api/todos', (req, res) => {
    todos = [...todos,
        {
            id: todoID++,
            name: req.body.name,
            isComplete: false,
            category: req.body.category,
            editMode: false
        }
    ]

    res.send(todos)
})

// PUT TODO
app.put('/api/todos', (req, res) => {
    let todoToBeUpdated = todos.indexOf(todos.filter(todo => todo.id === req.body.id)[0])
    todos[todoToBeUpdated] = req.body

    res.send(todos)
})

app.listen(port, () => {
    console.log(`Example app listening on ${port}`)
})