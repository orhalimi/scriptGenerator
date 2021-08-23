import fileCreator from './src/filleCreator';
import redisClient from './src/redisClient';
const json = require('./tamplates/example.json');

async function main(filename){
    await initilaized();
    const templateRaw = await redisClient.getAsync(`template:${filename}`);
    const template = JSON.parse(templateRaw);
    const values = await redisClient.lrangeAsync(`input:${filename}`,0, -1);
    const files = fileCreator.createExeFiles(template, values)
    await redisClient.rpushAsync(`output:${filename}`, files)
    for(let file of files){
        console.log(file, null, 2)
    }
}

async function initilaized(){
    await redisClient.flushallAsync() // for demo purpuse
    await redisClient.setAsync('template:example', JSON.stringify(json))
    await redisClient.rpushAsync('input:example', ['x','y'])
}

main('example');

// console.log(fileCreator.createExeFiles(json, ['x','y']))

