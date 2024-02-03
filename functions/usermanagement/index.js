'use strict';

const catalyst=require('zcatalyst-sdk-node');
const express=require('express');
const expressApp=express()

expressApp.use(express.json())

expressApp.get("/authusers",async (req,res,next)=>
{
	try{
		const app=catalyst.initialize(req)
		const userManagement= app.userManagement()
		const users=await userManagement.getAllUsers()
	
		console.log(users);
		res.status(200).json({success:true,response:users})
		}
	catch(err)
	    {
			res.json({err:err.message})
		}
});

expressApp.get("/add",(req,res)=>
{
	const a=req.query.a
	const b=req.query.b
	if(!a || !b)
	{
		res.json({response:"please provide both numbers."})
	}
	else
	{
		res.status(200).json({result:parseInt(a)+parseInt(b)})
	}
})

// process.on('uncaughtException', (error) => {
// 	console.error('Uncaught Exception:', error.message);
// 	process.exit(1)
//   });
  
//   process.on('unhandledRejection', (error) => {
// 	console.error('Unhandled Rejection:', error.message);
// 	process.exit(1)
//   });
  
//   process.on('exit', (error) => {
// 	console.error('Exit', error.message);
//   });
  

module.exports=expressApp