const Graph = require("graph-data-structure");

class TasksDepandedGraph{
    constructor(serializeGraph = null){
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