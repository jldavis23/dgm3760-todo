const express = require('express')
const app = express()
const port = 3001

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

app.get('/api/todos', (req, res) => {
    res.send(todos)
})

app.post('/api/todos', (req, res) => {

    // get new todo text

    todos.push(
        {
            id: todos.length + 1,
            name: req.body.name,
            isComplete: false,
            category: req.body.category,
            editMode: false
        }
    )

    res.send(todos)
})

app.listen(port, () => {
    console.log(`Example app listening on ${port}`)
})