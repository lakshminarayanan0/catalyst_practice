const cache =require('./cacheModel')
const db = require('./dbModel')

  function getUserList(catalystApp)
  {
      // return cache.getUsers(catalystApp)   
      return db.getUsers(catalystApp)
  }

  function postUser(catalystApp,newUser)
  {
   //  return cache.postUser(catalystApp,newUser)
    return db.postUser(catalystApp,newUser)
  }

 function deleteUser(catalystApp,id)
 {
   //  return cache.deleteUser(catalystApp,id)
   return db.deleteUser(catalystApp,id)
 }

 function updateUser(catalystApp,id,updatedData)
 {
   //  return cache.updateUser(catalystApp,id,updatedData)
    return db.updateUser(catalystApp,id,updatedData)
 }


const controller={}
controller.getUsers=getUserList
controller.postUser=postUser
controller.deleteUser=deleteUser
controller.updateUser=updateUser

module.exports=controller