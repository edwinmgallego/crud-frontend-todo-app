const API_URL="http://localhost:5002/todos"

//inicializar  la aplicacion
document.addEventListener("DOMContentLoaded",()=>{
    fetchTodos();
});

//obtener  tareas del servID


async function fetchTodos(){
try {
    const response= await fetch(API_URL);
    const todos = await  response.json();
    console.log(todos);
    renderTodos(todos);

    
} catch (error) {
    console.log(error)
}

}

function renderTodos(todos) {
    const todoList = document.querySelector('#todo-list');
    if (!todoList) {
        console.error("El elemento #todo-list no se encontró en el DOM.");
        return;
    }
    todoList.innerHTML = ""; 
    todos.forEach((todo) => {
        const todoItem = document.createElement("li");
        todoItem.innerHTML = `
         
        
    
        <div class="card is-flex is-justify-content-space-between is-align-items-center">
            <div class="card-content  is-align-items-center">
             <div></div>
             <div class="is-flex ">
                        <span class="todo-text" data-id="${todo.ID}" style="margin-right: 10px;">${todo.text}</span>
                        <input type="checkbox" ${todo.completed ? "checked" : ""} data-id="${todo.ID}">
                    </div>
              
                <div class="buttons">
                        <button data-id="${todo.ID}" class="button update-btn is-info">updt</button>
                        <button data-id="${todo.ID}" class="button delete-btn is-danger">dlt</button>
                    </div>
            </div>
        </div>



        `;
        todoList.appendChild(todoItem);
    });
}


//agregar datos.

document.querySelector("#todo-form").addEventListener("submit",async(e)=>{
e.preventDefault();
const text= document.querySelector("#todo-input").value.trim();
if(text==="")return;
try {
    const response = await fetch(API_URL,{
        method:"POST",
        headers:{"Content-type":"application/json"},
        body: JSON.stringify({text})
    });
    await response.json();
    fetchTodos();
    document.querySelector("#todo-input").value="";

} catch (error) {
    console.log("error al enviar  tarea: ",error)
}

});

//actualizar  los  estados  y  el texto de la tarea

document.querySelector("#todo-list").addEventListener("click",(e)=>{
    console.log(e.target.dataset.id);
    const ID = e.target.dataset.id;
        console.log("before: ",ID);
    if(e.target.classList.contains("update-btn")){
        const todoText= document.querySelector(`.todo-text[data-id= "${ID}"]`)
        const newText= prompt("editar tarea:",todoText.textContent)
        if(newText&&newText.trim()!==""){
            console.log("after: ",ID)
            updateTodoText(ID,newText.trim())
        }
    }else if(e.target.type==='checkbox'){
        console.log("target type: ",e.target.type);
        updateTodoStatus(ID,e.target.checked)

    }else if(e.target.classList.contains("delete-btn")){
        console.log("estoy en  el boton de  delete")
        deletetodo(ID );
    }
});

async function updateTodoText(ID,newText){
    try {
        await fetch(`${API_URL}/${ID}`,{
            method: "PUT",
            headers:{"Content-type":"application/json"},
            body: JSON.stringify({text:newText})
        });
        fetchTodos();
        
    } catch (error) {
        console.log("error al actualizar el  texto: ",error)
        
    }
}

// actualizar  el  estado (completado)
async function updateTodoStatus(ID,completed){
    console.log("data status:",ID,completed)
    try {
        await fetch(`${API_URL}/${ID}`,{
            method:"PUT",
            headers:{"Content-type":"application/json"},
            body:JSON.stringify({completed})
            }
        );
        fetchTodos();
        
    } catch (error) {
        console.log("error al actualizar estado: ",error)
        
    }
}

async function deletetodo(ID)
    {
    console.log("estoy en deletetodo",ID)
    try {
        await fetch(`${API_URL}/${ID}`,{
            method:"DELETE",
        });
        fetchTodos()

        
    } catch (error) {
        console.log("error al  borrar tarea: ",error)
        
    }
}


