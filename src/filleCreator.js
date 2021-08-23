import Splitter from './splitter';
import helpers from './helpers';

function createExeFiles(config, input = []) {
    const {
        experimentTask,
        experimentParam,
        experimentValues,
    } = helpers.getExperiment(config)

    const splitter = new Splitter(config)
    splitter.splitTasks();
    splitter.insertExperimentData({ experimentTask, experimentParam, experimentValues })

    let files = []
    let codeChunk = '';

    for (let task of splitter.individualTasks) {
        if (task === experimentTask) codeChunk += helpers.taskToExeCommands({ task, config, experimentParam, experimentValues })
        else codeChunk += helpers.taskToExeCommands({ task, config })
    }

    for (let graphId in splitter.taskGraphs) {
        codeChunk += splitter.taskGraphs[graphId].graphToExeCommands(config)
    }

    return createFilePerValue(codeChunk, input);
}

function createFilePerValue(text, values) {
    const files = []
    for (let v of values) {
        files.push(text.replace(/\$input/g, v))
    }
    return files;
}


export default { createExeFiles }