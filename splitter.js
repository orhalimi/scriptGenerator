import TasksDepandedGraph from './TasksDepandedGraph'

class Splitter{
    constructor(config){
        this._config = config;
        this.individualTasks = {}
        this.taskGraphs = {}
    }

    splitTasks() {
        this.individualTasks = {...this._config.tasks}
        for (let task in this._config.dependencies) {
            const dependencies = this._config.dependencies[task]
            if (dependencies.length < 1) throw new Error("expect one or more dependencies on task " + task + " got none.")
            if (!this._config.tasks[task]) throw new Error('All the dependencies should be defined as a tasks' + task)
            for (let dep of dependencies) {
                if (!this._config.tasks[dep]) throw new Error('All the dependencies should be defined as a tasks' + dep)
                this._addToDependenciesGraph(dep, task)
                delete this.individualTasks[dep];
                delete this.individualTasks[task];
            }
        }
        this._validateNoCycleGraphs();
    }

    getGraphByTask(task) {
        for (let graphId in this.taskGraphs) {
            const graph =  this.taskGraphs[graphId]
            if (graph.isContained(task)) return { graphId, graph }
        }
        return {graphId:null, graph:null};
    }

    _addToDependenciesGraph(dependencie, task) {
        console.log('dep')
        console.log(dependencie)
        console.log('task')
        console.log(task)
        const { graph: graphA, graphId: graphAId } = this.getGraphByTask(dependencie);
        const { graph: graphB, graphId: graphBId } = this.getGraphByTask(task);
        console.log('graphidA')
        console.log(graphAId)
        console.log('graphidB')
        console.log(graphBId)
        let relevantGraph;
        if (!graphA && !graphB) {
            relevantGraph = this._createNewTaskDepGraph(dependencie, task)
        } 
        else if (graphA && graphB) {
            relevantGraph = this._mergeGraphs(graphAId, graphBId)
        }
        else if (graphA) {
            relevantGraph = graphA;
        } 
        else if (graphB) {
            relevantGraph = graphB;
        } 
        relevantGraph.addRelations(dependencie, task)
    }

    _createNewTaskDepGraph(dependencie, task){
        const graph = new TasksDepandedGraph()
        // we check the is only on this graph so are using it it as unique id
        this.taskGraphs[task] = graph; 
        return graph;
    }

    _mergeGraphs(graphAId, graphBId) {
        const graphA = this.taskGraphs[graphAId];
        const graphB = this.taskGraphs[graphBId];
        const serializedA = graphA.serialize()
        const serializedB = graphB.serialize()
        console.log("serA")
        console.log(serializedA)
        console.log("serB")
        console.log(serializedB)
        const mergedSerialized = {
            nodes:[
                ...serializedA.nodes,
                ...serializedB.nodes
            ],
            links:[
                ...serializedA.links,
                ...serializedB.links
            ]
        }
        console.log("merge")
        console.log(mergedSerialized)

        const mergeGraph =  new TasksDepandedGraph(mergedSerialized)
        delete this.taskGraphs[graphAId]
        delete this.taskGraphs[graphBId]
        this.taskGraphs[graphAId] = mergeGraph; 
        console.log('task graph after merge')
        console.log( this.taskGraphs);
        return mergeGraph;
    }
    
    _validateNoCycleGraphs(){
        for(let graphId in this.taskGraphs){
            if(this.taskGraphs[graphId].hasCycle()) throw new Error('One or more of the dependencie lead the circular dependencies')
        }
    }
    
    
}




export default Splitter