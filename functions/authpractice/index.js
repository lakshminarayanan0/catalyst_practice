'use strict';

const catalyst=require('zcatalyst-sdk-node');
const express=require('express');
const { USER_STATUS } = require('zcatalyst-sdk-node/lib/user-management/user-management');
const expressApp=express()

expressApp.use(express.json())


expressApp.get('/orgusers/:id',(req,res)=>
{
	const app=catalyst.initialize(req)
	const id=req.params.id
	const userManagement=app.userManagement()
	userManagement.getAllUsers(id)
	.then(users=>
	{
		if(users.length===0)
		{
		res.status(200).json({success:true,response:"users not found for organization"})
		}
		else
		{
		console.log(users);
		res.status(200).json({success:true,response:users})
		}
	})
	.catch(err=>
	{
		res.json({err:err.message})
	})
});

expressApp.get("/authusers",(req,res)=>
{
	const app=catalyst.initialize(req)
	const userManagement=app.userManagement()
	userManagement.getAllUsers()
	.then(users=>
	{
		console.log(users);
		res.status(200).json({success:true,response:users})
	})
	.catch(err=>
	{
		console.log(err.message);
		res.json({err:err.message})
	})
});

expressApp.get('/authusers/:id',(req,res)=>
{
	const app=catalyst.initialize(req)
	const userManagement=app.userManagement()

	userManagement.getUserDetails(req.params.id)
	.then(user=>
	{
		console.log(user);
		res.status(200).json({success:true,response:user})
	})
	.catch(err=>
	{
		console.log(err.message);
		res.json({err:err.message})
	})
})

expressApp.post('/authusers',(req,res)=>
{
	
	const app=catalyst.initialize(req)
	const newUser=req.body

	const userManagement=app.userManagement()

    const signUpConfig=
	{
		platform_type:"web",
		template_details: 
		{
			subject: 'Welcome to %APP_NAME%',
			message: '<p>Login link to %APP_NAME% : </p><a href="%LINK%">%LINK%</a>'
		}
	}

	const registerPromise=userManagement.addUserToOrg(signUpConfig,newUser)
    registerPromise
	.then(user=>
	{
		console.log(user);
		res.status(200).json({success:true,response:user})
	})
	.catch(err=>{
		console.log(err.message);
		res.status(500).json({success:false,response:err.message})
	})
})


expressApp.put('/authusers/:id',(req,res)=>
{
	const app=catalyst.initialize(req)
	const userManagement=app.userManagement()
	const userId=req.params.id
	const toUpdate=req.body

	userManagement.getUserDetails(userId)
	.then(user=>
	{
		console.log(user);
        if(!user)
		{
          res.status(404).json({success:false,message:`${userId} does not exists in authenticated userList.`})
		}
		else
		{
			const userDetails=
			{
				first_name:user.first_name,
				last_name:user.last_name,
				zaaid:user.zaaid,
				email_id:user.email_id,
				role_id:user.role_details.role_id
			}
			const updateUserDetails={...userDetails,...toUpdate}
			 userManagement.updateUserDetails(userId,updateUserDetails)
			 .then(isUpdated=>
				{
					res.status(200).json({success:true,message:`${userId} updated successfully.`})
				})
		}
		
		})
	.catch(err=>
	{
		res.json({message:"Error updating user.",err:err.message})
	})

})

expressApp.delete('/authusers/:id',(req,res)=>
{
	const app=catalyst.initialize(req)
	const userManagement=app.userManagement()
    const userId=req.params.id
	userManagement.deleteUser(userId)
	.then(deletedUser=>
	{
		console.log(deletedUser);
		res.json(deletedUser)
	})
	.catch(err=>
	{
		res.json({err:err.message})
	})
})

expressApp.get('/authusers/enable/:id',(req,res)=>
{
	const app=catalyst.initialize(req)
	const userId=req.params.id
	const userManagement=app.userManagement()
	userManagement.updateUserStatus(userId,USER_STATUS.ENABLE)
	.then(response=>
	{
		res.status(200).json({message:`${userId}  is enabled.`,response:response})
	})
	.catch(err=>
	{
		res.json({err:err.message})
	})
	
})

expressApp.get('/authusers/disable/:id',(req,res)=>
{
	const app=catalyst.initialize(req)
	const userId=req.params.id
	const userManagement=app.userManagement()
	userManagement.updateUserStatus(userId,USER_STATUS.DISABLE)
	.then(response=>
	{
		res.status(200).json({message:`${userId}  is disabled.`,response:response})
	})
	.catch(err=>
	{
		res.json({err:err.message})
	})

})

module.exports=expressApp