'use strict';

const express=require('express')
const app=express()
const moment=require('moment')
const catalyst = require('zcatalyst-sdk-node');
const controller = require('./controller');
const fileUpload=require('express-fileupload')
const fs=require('fs')
const path=require("path")


app.use(fileUpload())
app.use(express.json());


app.get('/',(req,res)=>
{
	const formattedTime = moment().utc().format('hh:mm A');
	res.status(200).send(`<h1>Time: ${formattedTime}</h1><br><h1>Zoho Catalyst</h1>`)
})

app.get("/authusers",(req,res)=>
{
	const catalystApp=catalyst.initialize(req)
	const userManagement=catalystApp.userManagement()
	userManagement.getAllUsers()
	.then(users=>
	{
		console.log(users);
		res.status(200).json({success:true,response:users})
	})
	.catch(err=>res.json({err:err.message}))
});

app.get('/users',(req,res)=>
{
    const catalystApp=catalyst.initialize(req);    
    controller.getUsers(catalystApp)
    .then(users=>
    {
        if(users)
        {
         res.status(200).json({success:true,response:users});
        }
        else
        {
         res.status(500).json({success:false,error:"Internal server error"});
        }
    })
    .catch(err=> 
    {
        res.status(500).json({success:false,error:err.message})
    })
     
})

app.post('/users', (req, res) => 
{
    const catalystApp=catalyst.initialize(req);
	const newUser=req.body;
	newUser.id=(Math.floor(Math.random()*1000000000000)).toString()

	if(newUser)
    {        
        controller.postUser(catalystApp,newUser)
        .then(row=>
        {
            if(row)
            {
             res.status(200).json({success:true,body:row})

            }
            else
            {
             res.status(500).json({success:false,error:"user not posted"})
            }
        })
        .catch(err=>
        {
            res.status(500).json({success:false,error:err.message})
        })

	}
	
});

app.delete('/users/:id', (req, res) => 
{
    const catalystApp=catalyst.initialize(req);
    const id = req.params.id;

    controller.deleteUser(catalystApp,id)
    .then(isDeleted=>
    {
        if(isDeleted)
        {
         res.status(200).json({success:true,message:`${id} deleted successfully`})
        }else 
        {
         res.status(404).json({success:false,message:`${id} not found in user list.`})
        }
    })
    .catch(err=>
    {
        res.status(500).json({success:false,error:err.message})
    })
});


app.put('/users/:id', (req, res) => 
{
    const catalystApp=catalyst.initialize(req);
    const id = req.params.id;
    const updatedUserData = req.body;
	updatedUserData.id=id;

    controller.updateUser(catalystApp,id,updatedUserData)
    .then(isUpdated=>
    {
        if(isUpdated)
        {
         res.status(200).json({ success: true, message: `${id} updated successfully.` });
        }
        else
        {
         res.status(404).json({ success: false, message: `${id} not found in user list.` });
        } 
    })
    .catch(err=>
    {
        res.status(500).json({message:err.message})
    })
});


app.post('/fs',(req,res)=>
{
	let file=req.files.image
    const tempFilePath = path.join(__dirname, 'tempFile.txt');
    fs.writeFileSync(tempFilePath, file.data);

    let config = 
    { 
    code:fs.createReadStream(tempFilePath), name: file.name
    };

    let catalystApp=catalyst.initialize(req);
    let filestore = catalystApp.filestore(); 
    let folder = filestore.folder(1721000000022001); 
    let uploadPromise = folder.uploadFile(config); 
    uploadPromise.then((fileObject) => 
    {
    console.log(fileObject);
    fs.unlinkSync(tempFilePath);
     res.status(200).json({success:true,fileObject}) 
    })
    .catch(err=>
    {
    fs.unlinkSync(tempFilePath);
    res.status(500).json({success:false,err:err.message})
    })
})

app.get((req,res)=>
{
	res.status(404).send(`<h1>Try seaching '/' </h1>`)
})

module.exports=app;