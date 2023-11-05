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

let categories = [
    {
        id: null,
        categoryName: 'all',
        editMode: false
    },
    {
        id: 1,
        categoryName: 'home',
        editMode: false
    },
    {
        id: 2,
        categoryName: 'work',
        editMode: false
    },
    {
        id: 3,
        categoryName: 'school',
        editMode: false
    }
]
let categoriesID = categories.length


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

// DELETE TODO
app.delete('/api/todos', (req, res) => {
    const newTodos = todos.filter(todo => todo.id !== req.body.id)
    todos = newTodos

    res.send(newTodos)
})

// GET ALL TODOS FOR A CATEGORY
app.get('/api/categories/todos', (req, res) => {
    const filteredTodos = todos.filter(todo => todo.category === req.body.id)

    res.send(filteredTodos)
})

// GET CATEGORIES
app.get('/api/categories', (req, res) => {
    res.send(categories)
})

// POST CATEGORIES
app.post('/api/categories', (req, res) => {
    categories = [...categories,
        {
            id: categoriesID++,
            categoryName: req.body.categoryName,
            editMode: false
        }
    ]

    res.send(categories)
})

app.listen(port, () => {
    console.log(`Example app listening on ${port}`)
})