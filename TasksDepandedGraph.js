const Graph = require("graph-data-structure");

class TasksDepandedGraph{
    constructor(serializeGraph = null){
        this._experimentMembers = new Set();
        this._experimentParam = null
        this._experimentValues = null;

        if(serializeGraph){
            try{
                this._graph = Graph(serializeGraph);
                this._members = new Set(this._graph.nodes());
            } catch (e){
                throw new Error(e)
            }
        } else{
            this._graph = Graph();
            this._members = new Set();
        }
    }

    setExperimentData({experimentTask, experimentParam, experimentValues}){
        this._experimentParam = experimentParam
        this._experimentValues = experimentValues
        let adjacent = this._graph.adjacent(experimentTask)
        this._experimentMembers.add(experimentTask)

        while(adjacent.length){
            this._experimentMembers = new Set([...adjacent, ...this._experimentMembers])
            let nextAdjacents = adjacent.flatMap(node=> this._graph.adjacent(node))
            adjacent = [];
            nextAdjacents.forEach(node=>{
                if (!this._experimentMembers.has(node)) adjacent.push(node) 
            })
            nextAdjacents =[];
        }
    }

    addRelations(dependencie, task){
        this._graph.addEdge(dependencie, task);
        this._members.add(dependencie);
        this._members.add(task);
    }

    isContained(value){
        return this._members.has(value);
    }

    hasCycle(){
        return this._graph.hasCycle();
    }

    serialize(){
        return this._graph.serialize();
    }

}


export default TasksDepandedGraph;