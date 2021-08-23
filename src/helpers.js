function taskToExeCommands({ task, config, experimentParam, experimentValues }) {
    let commandsChain = ''
    let command = config.tasks[task];
    if (experimentParam && experimentValues) {
        const firstCommand = command.split(' ')[0];
        for (let value of experimentValues) {
            let str = command.replace(firstCommand, `${firstCommand} -v ${experimentParam.substring(1)}${value}`)
            if (command.includes(experimentParam)){
                str = str.replace(experimentParam, value)
            }
            commandsChain += `${str}; `
        }
    } else {
        commandsChain += `${config.tasks[task]}; `
    }
    return commandsChain;
}

function countExcCommands(text) {
    return text.split(';').length
}

function getExperiment(config) {
    let experimentTask = null;
    let experimentParam = null;
    let experimentValues = null;

    if (config.experiment) {
        if (Object.keys(config.experiment).length !== 1) {
            throw new Error("Only one task can be experimented");
        }
        experimentTask = Object.keys(config.experiment)[0];

        if (Object.keys(config.experiment[experimentTask]).length !== 1) {
            throw new Error("Only one parameter can be experimented");
        }
        experimentParam = Object.keys(config.experiment[experimentTask])[0];
        experimentValues = config.experiment[experimentTask][experimentParam];
        if (!config.tasks[experimentTask].includes(experimentParam)) {
            throw new Error("Experiment parameter is not set on the task");
        }

    }

    return {
        experimentTask,
        experimentParam,
        experimentValues,
    }
}


export default {
    taskToExeCommands,
    countExcCommands,
    getExperiment,
}