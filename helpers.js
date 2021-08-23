function tasksToExeCommands(config, tasks=[]){
    const code = ''
    for(let tas in tasks){
        const command = config.tasks[tas];
        code += config.tasks[tas];
        if(command.slice(-1) != ';') code += ';'
    }
    return;
}

function countExcCommands(text){
    return text.split(';').length
}

function getExperiment(config){
    let experimentTask = null;
    let experimentParam = null;
    let experimentValues = null;
    
    if(config.experiment ){
        if(Object.keys(config.experiment).length !==1 ){
            throw new Error("Only one task can be experimented");
        }
        experimentTask = Object.keys(config.experiment)[0];

        if(Object.keys(config.experiment[experimentTask]).length !==1 ){
            throw new Error("Only one parameter can be experimented");
        }
        experimentParam = Object.keys(config.experiment[experimentTask])[0];
        experimentValues = config.experiment[experimentTask][experimentParam];
        if (!config.tasks[experimentTask].includes(experimentParam)){
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
    tasksToExeCommands,
    countExcCommands,
    getExperiment,
}