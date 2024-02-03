
window.addEventListener("load",()=>{
    checkLoginStatus()
})

function checkLoginStatus() {
    const loader=document.querySelector(".loader")
    // let isLoading=true
    loader.style.display="block"
    const userManagement = catalyst.userManagement;
    const currentUserPromise = userManagement.getCurrentProjectUser();
    let orgId=""

    currentUserPromise
        .then((response) => {
            console.log(response);
            if(response.code===700){
            const redirectUrl = 'http://localhost:3000/__catalyst/auth/login';
            return window.location.href = redirectUrl; 
            }
            document.querySelector(".pageload").style.display="none"
            console.log("User " + response.content.first_name + " logged in.");
            document.getElementById('title').innerHTML = `Hello ${response.content.first_name} ${response.content.last_name}`;
            orgId = response.content.org_id;
            getUsers(orgId,loader); 
            const getWorkersBtn=document.getElementById('getworkers')
            getWorkersBtn.addEventListener('click',getWorkers)
            
            const logOutBtn=document.getElementById('logout')
            logOutBtn.addEventListener('click',logout)
            
            const addUserBtn=document.getElementById('adduser')
            addUserBtn.addEventListener('click',(event)=>addUser(orgId,event))
            
            const addWorkerBtn=document.getElementById('addworker')
            addWorkerBtn.addEventListener('click',addWorker)
        })
        .catch((err) => {
            console.log(err);
            const redirectUrl = 'http://localhost:3000/__catalyst/auth/login';
            window.location.href = redirectUrl;
        });
}




function getUsers(orgId,loader){
    console.log('/server/authpractice/orgusers/'+orgId);
    fetch('/server/authpractice/orgusers/'+orgId)
    .then(response=>response.json())
    .then(data=>{
        // isLoading=false
        
        console.log(data);
        loader.style.display="none"
       if(data.response.length===0){
        return document.getElementById("users").innerHTML="<tr><td colspan='5' style='text-align:center;'>No users found</td></tr>"
       }

       const users=data.response
       let userList=document.getElementById("users")
       users.forEach(user=>{
            userList.innerHTML+=`<tr> <td>${user.user_id} </td> <td>${user.first_name} </td>  <td>${user.last_name} </td> <td>${user.email_id} </td>  <td>${user.role_details.role_name} </td>  </tr>`
       })
    })    
}



function logout(){
    var redirectURL = "http://localhost:3000/__catalyst/auth/login";
    var auth = catalyst.auth;
    auth.signOut(redirectURL);
}


function getWorkers(){
    console.log("clicked get workers");
    fetch('/server/project_rainfall_function/users')
    .then(response=>response.json())
    .then(data=>{
        console.log(data);
        let workers=document.getElementById('workers');
        workers.innerHTML=''
        data.response.forEach(user=>{
            const userData=user.users
            workers.innerHTML+=`<tr><td>${userData.userId}</td><td>${userData.name}</td><td>${userData.age}</td></tr>`
        })
    })
    console.log("out of process");
}

function addUser(event,org_id){
    event.preventDefault()
   
    const first_name=document.getElementById('firstName').value
    const last_name=document.getElementById('lastName').value
    const email_id=document.getElementById('emailId').value

    const data={
        first_name,
        last_name,
        email_id,
        org_id
    }
    const requestDetails={
        method:"POST",
        body:JSON.stringify(data),
        headers:{
            "Content-Type":"application/json"
        }
    }
    fetch('/server/authpractice/authusers',requestDetails)
    .then(response=>response.json())
    .then(data=>{
        console.log(data);
        const user=data.response.user_details
        alert(`${user.first_name} ${user.last_name} added successfully.`)

            document.getElementById('firstName').value = '';
            document.getElementById('lastName').value = '';
            document.getElementById('emailId').value = '';

            $('#staticBackdrop').modal('hide');

        let userList=document.getElementById("users")
        userList.innerHTML+=`<tr> <td>${user.user_id} </td> <td>${user.first_name} </td>  <td>${user.last_name} </td> <td>${user.email_id} </td>  <td>${user.role_details.role_name} </td>  </tr>`

    })
    .catch(err=>{
        alert('error adding user')
        console.log(err)
    })
}


function addWorker(event){
    event.preventDefault()

    const name=document.getElementById('name').value
    const age=parseInt(document.getElementById('age').value)

    const data={name,age};
    console.log(data);
    

    const requestDetails={
        method:"POST",
        body:JSON.stringify(data),
        headers:{
            "Content-Type":"application/json"
        }
    }
    fetch('/server/project_rainfall_function/users',requestDetails)
    .then(response=>response.json())
    .then(data=>{
        console.log(data);
        const user=data.body[0].users
        alert(`${user.name} added successfully.`)

            document.getElementById('name').value = '';
            document.getElementById('age').value = '';

            $('#addWorker').modal('hide');

        let workerList=document.getElementById("workers")
        workerList.innerHTML+=`<tr> <td>${user.userId} </td> <td>${user.name} </td>  <td>${user.age} </td> </tr>`

    })
    .catch(err=>{
        alert('error adding worker')
        console.log(err)
    })

}
