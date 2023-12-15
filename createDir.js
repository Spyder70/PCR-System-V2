const fs=require('fs');
const readline=require('readline');

const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

r1.question("Name of the directory: ", (name)=>{
    const dirname = name;
    r1.question("Path: ",(path)=>{
        const dirpath= path || './';
        fs.mkdir(`${dirpath}/${dirname}`,{recursive: true}, (err)=>{
            if(err){
                console.log(err);
            }
            else{
                console.log(`new dir: ${dirname} created at ${dirpath}`);
                r1.close();
            }
        });
    });
})