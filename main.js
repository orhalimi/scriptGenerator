const json = require('./tamplates/example.json');
import Splitter from './splitter';

function createExeFiles(config, input) {
    // try {
        const splitter = new Splitter(config)
        splitter.splitTasks()
        console.log(splitter.individualTasks);
        for (let gId in splitter.taskGraphs){
            console.log(gId + ";")
            console.log(splitter.taskGraphs[gId].serialize())
        }

    // } catch (e) {
    //     console.log('error:' + e)
    // }
}

createExeFiles(json, ['x'])