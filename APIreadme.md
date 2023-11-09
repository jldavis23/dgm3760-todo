# API Reference

## Get All Todos
Get all of the todos

Request: **GET /api/todos**

Response: an array of all todo objects

## Add a Todo
Add a new todo to the todo list

Request: **POST /api/todos**

Request Body: 
* name: (string) the name of the new todo
* category: (number) the id of the category the todo is being added to

Example:

```
{ 
    "name": "string", 
    "category": 1
}
```
Response: the updated todo array

## Update a Todo
Make an update to an existing todo object

Request **PUT /api/todos/{todo_id}**
* todo_id: the id of the todo to be updated

Request Body: 
* name: (string) the updated name of the todo
* isComplete: (boolean) true/false if the todo is complete
* category: (number) the id of the category the todo is assigned to
* editMode: (boolean) whether or not the todo is in edit mode

Example:
```
{
    "name": "string",
    "isComplete": false,
    "category": 3,
    "editMode": false
}
```
Response: The updated array of todos

## Delete a Todo
Delete an existing todo

Request: **DELETE /api/todos/{todo_id}**

* todo_id: the id of the todo to be deleted

Response: The todos array with the specified todo removed

## Get Category's Todos
Get all the todos of a specified category

Request: **GET /api/categories/{category_id}/todos**
* category_id: the id of the category you wish to get all todos from

Response: an array of todos in the specified category

## Get Categories
Get a list of all categories

Request: **GET /api/categories**

Response: an array of all categories

## Add Category
Add a new category

Request: **POST /api/categories**

Request Body:
* categoryName: the name of the new category

Example:
````
{
    "categoryName": "string"
}
````

Response: the category array with the newly added category

## Update a Category
Make an update to an existing category

Request: **PUT /api/categories/{category_id}**
* category_id: the id of the category to be updated

Request Body:
* categoryName: (string) The updated name of the category
* editMode: (boolean) Whether or not the category is in edit mode

Example:
````
{
    "categoryName": "string",
    "editMode": true
}
````
Response: The categories array with the updated category

## Delete a Category
Delete an existing category

Request **DELETE /api/categories/{category_id}**
* category_id: the id of the category to be deleted

Response: The categories array with the specified category removed
