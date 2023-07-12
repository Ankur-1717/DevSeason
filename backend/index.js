const express = require('express');
const {generateFile} = require('./generateFile');
const { executeCpp } = require('./executeCpp');
const cors = require('cors');
const { executePy } = require('./executePy');
const app = express();

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.get('/', (req,res) => {
    res.json({online: "compiler"});
});

app.post('/run', async (req,res) => {
    const {language = 'cpp', code} = req.body;
    if(code === undefined) {
        return res.status(404).json({success:false, error:"Empty code body!"});
    }
    try{
        const filePath = await generateFile(language, code);
        if(language === 'cpp') {
            output = await executeCpp(filePath);
        }
        else output = await executePy(filePath);
        console.log(output);
        res.json({filePath, output});

    }catch(err) {
        return res.status(500).json({success: false, err: JSON.stringify(err)});
    }
});

app.listen(8000, () => {
    console.log("server is listening to Port 8000");
});