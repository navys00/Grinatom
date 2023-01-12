let users=[]
let tasks=[]
Promise.all([loadusers(),loadtask()]).then((result)=>{
    let [loadedusers,loadedtasks]=result
    users=loadedusers;
    tasks=loadedtasks;
    UpdateDOMtasks();
    UpdateDOMUsers();
})

document.querySelector('form').addEventListener('submit',(e)=>{
    e.preventDefault();
    if(document.querySelector('#user-todo').value=='select user')return 
    let newtasktitle=document.querySelector('#new-todo').value;
    let newtaskuserID=document.querySelector('#user-todo').value;

    sendtask({
       userId:newtaskuserID,
       title:newtasktitle,
       completed:false    
    }).then((newtask)=>{
        tasks.push(newtask)
        UpdateDOMtasks()
        newtasktitle=document.querySelector('#new-todo').value='';
        newtaskuserID=document.querySelector('#user-todo').value='select user';
    })
})

function UpdateDOMUsers(){
    let user_todo=document.querySelector('#user-todo');
    user_todo.innerHTML="<option desabled selected >select user</option>"
    for(let i=0;i<users.length;i++){
        let currUser=users[i];
        let option = document.createElement('option');
        option.innerHTML=currUser.name;
        option.value=currUser.id;
        user_todo.appendChild(option);
    }
    

}

function UpdateDOMtasks(){
    let todolist=document.querySelector("#todo-list");
    todolist.innerHTML=""
    for(let i=tasks.length-1;i>=0;i--){
        let currtask=tasks[i];
        let taskLi=document.createElement('li');
        let userName=users.find((user)=>{return user.id==currtask.userId}).name;
        taskLi.className="todo-item";
        taskLi.innerHTML=`<input type="checkbox" ${currtask.completed ?'checked':''}> <div>${currtask.title}</div><div style='font style:italic'>by </div><div>${userName}</div><div class='close'>*</div>`;

        taskLi.querySelector('input').addEventListener('click',(e)=>{e.preventDefault() 
            updatetaskstatus(currtask.id,e.target.checked).then((updatedtask)=>{tasks.find((task)=>task.id==currtask.id).completed=updatedtask.completed
            UpdateDOMtasks()
        })
    });
            
        taskLi.querySelector(".close").addEventListener('click',()=>{deletetask(currtask.id).then((isDeleted)=>{if(isDeleted){
            tasks=tasks.filter((task)=>task.id !=currtask.id)
            UpdateDOMtasks();
        }})})
        todolist.appendChild(taskLi);

    }
}

async function loadusers(){
let response=await fetch('http://jsonplaceholder.typicode.com/users');
let loadedusers=await response.json();
return loadedusers;
}

async function loadtask(){
    let response= await fetch('http://jsonplaceholder.typicode.com/todos')
    let loadedtasks=await response.json();
    return loadedtasks;
}

async function sendtask(task){
    let response= await fetch('http://jsonplaceholder.typicode.com/todos',{method:'POST',headers:{'Content-type':'application/json'},body:JSON.stringify(task)});
    let newtask=await response.json();
    return newtask;
}


async function updatetaskstatus(taskid,iscompleted){
    let response= await fetch(`http://jsonplaceholder.typicode.com/todos/${taskid}`,{method:'PATCH',headers:{'Content-type':'application/json'},body:JSON.stringify({completed:iscompleted})});
    let updatedtask=await response.json();
    return updatedtask;
}
async function deletetask(taskid){
    let response= await fetch(`http://jsonplaceholder.typicode.com/todos/${taskid}`,{method:'DELETE',headers:{'Content-type':'application/json'}});
    
    return response.ok;
}