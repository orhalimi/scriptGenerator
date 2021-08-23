const json = require('./tamplates/exampleSimple.json');
import Splitter from './splitter';
import helpers from './helpers';

function createExeFiles(config, input =[]) {
    // try {
        const {        
            experimentTask,
            experimentParam,
            experimentValues,
        } = helpers.getExperiment(config)

        const splitter = new Splitter(config)
        splitter.splitTasks();
        if(experimentTask) splitter.insertExperimentData({experimentTask, experimentParam, experimentValues})
        // console.log(splitter.individualTasks);
        for (let gId in splitter.taskGraphs){
            console.log(splitter.taskGraphs[gId]._experimentMembers)
            // console.log(splitter.taskGraphs[gId]._graph.adjacent("B"));
            // console.log(splitter.taskGraphs[gId]._graph.adjacent("C"));
            // console.log(splitter.taskGraphs[gId]._graph.adjacent("D"));
            break;
            // console.log(gId + ";")
            // console.log(splitter.taskGraphs[gId].serialize())
        }


    // } catch (e) {
    //     console.log('error:' + e)
    // }
}


createExeFiles(json, ['x'])