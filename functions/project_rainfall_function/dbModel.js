

function getUsers(catalystApp)
{
    let zcql=catalystApp.zcql()
    let query ='SELECT * FROM users';
    return zcql.executeZCQLQuery(query);
  
}

function postUser(catalystApp,newUser)
{
    const zcql=catalystApp.zcql()
    const { id, name, age } = newUser;
    const query = `insert into users (userId, name, age) values (${id}, '${name}', ${age})`;    
    let insertPromise =zcql.executeZCQLQuery(query)
    return insertPromise

}


function deleteUser(catalystApp,id)
{
    const zcql=catalystApp.zcql()
    const query=`select * from users where userId=${id}`
	
	const getPromise=zcql.executeZCQLQuery(query);

    return getPromise.then(data => {
        if (Object.keys(data).length !== 0) 
        {
            let deleteQuery = `delete from users where userId=${id}`;

            const deletePromise = zcql.executeZCQLQuery(deleteQuery);

           return deletePromise.then(() => true).catch(()=>false);
        } 
    })
}

function updateUser(catalystApp, id, updatedData) 
{
    const zcql=catalystApp.zcql()
	const query=`select * from users where userId=${id}`
	
	const getPromise=zcql.executeZCQLQuery(query);

    return getPromise
          .then(data => 
            {
             if (Object.keys(data).length !== 0) 
             {
                let updateQuery = `update users set`;

                if (updatedData.name) 
                {
                    updateQuery += ` name='${updatedData.name}'`;
                }

                if (updatedData.age) 
                {
                    updateQuery += `${updatedData.name ? ',' : ''} age=${updatedData.age}`;
                }

                updateQuery += ` where userId=${id}`;

                const updatePromise = zcql.executeZCQLQuery(updateQuery);

                   return updatePromise.then(() => true).catch(()=>false);
             } 
            })

}


const db={
    getUsers:getUsers,
    postUser:postUser,
    updateUser:updateUser,
    deleteUser:deleteUser
}

module.exports=db

