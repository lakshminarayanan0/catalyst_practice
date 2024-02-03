
function getUsers(catalystApp)
{
    const segment=catalystApp.cache().segment();
    return segment.get('users')
           .then(cache=>
            {
                JSON.parse(cache.cache_value)
            })
 }


  function postUser(catalystApp,newUser)
  {
    const segment=catalystApp.cache().segment();
    return getUsers(catalystApp)
           .then(users=>
            {
                users[`user_${newUser.id}`]=newUser
                const updatePromise=segment.put("users",users);
                return updatePromise
            })
  }

  
  function deleteUser(catalystApp,id)
  {
    const segment=catalystApp.cache().segment();
    return getUsers(catalystApp)
           .then(users=>
            {
            const beforeDelete=Object.keys(users).length
            delete users[`user_${id}`];
            const afterDelete=Object.keys(users).length
            const isDeleted=(afterDelete<beforeDelete)
            if(isDeleted)
            {
                const deletePromise=segment.put("users",users);
                return deletePromise.then(isDeleted=>true)
            }
            })
            .catch(err=>
            {
                console.log(err);
                return false;
            })
  }

  function updateUser(catalystApp,id,updatedData)
  {
    const segment=catalystApp.cache().segment();
    return getUsers(catalystApp)
            .then(users=>
            {
                Object.assign(users[`user_${id}`],updatedData);
                    const updatePromise=segment.put("users",users);
                    return updatePromise.then(isupdated=>true)
                
            })
            .catch(err=>
            {
                console.log(err);
                return false;
            })
    
  }

 const cache={}

 cache.getUsers=getUsers
 cache.postUser=postUser
 cache.deleteUser=deleteUser
 cache.updateUser=updateUser


module.exports=cache