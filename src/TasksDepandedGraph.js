const Graph = require("graph-data-structure");
import helpers from './helpers';

class TasksDepandedGraph {
    constructor(serializeGraph = null) {
        this._experimentMembers = new Set();
        this._experimentParam = null
        this._experimentValues = null;
        this._hasExperiment = false;

        if (serializeGraph) {
            try {
                this._graph = Graph(serializeGraph);
                this._members = new Set(this._graph.nodes());
            } catch (e) {
                throw new Error(e)
            }
        } else {
            this._graph = Graph();
            this._members = new Set();
        }
    }

    setExperimentData({ experimentTask, experimentParam, experimentValues }) {
        this._experimentParam = experimentParam
        this._experimentValues = experimentValues
        let adjacent = this._graph.adjacent(experimentTask)
        this._hasExperiment = true;
        this._experimentMembers.add(experimentTask)

        while (adjacent.length) {
            this._experimentMembers = new Set([...adjacent, ...this._experimentMembers])
            let nextAdjacents = adjacent.flatMap(node => this._graph.adjacent(node))
            adjacent = [];
            nextAdjacents.forEach(node => {
                if (!this._experimentMembers.has(node)) adjacent.push(node)
            })
            nextAdjacents = [];
        }
    }

    addRelations(dependencie, task) {
        this._graph.addEdge(dependencie, task);
        this._members.add(dependencie);
        this._members.add(task);
    }

    isContained(value) {
        return this._members.has(value);
    }

    hasCycle() {
        return this._graph.hasCycle();
    }

    serialize() {
        return this._graph.serialize();
    }

    graphToExeCommands(config) {
        let codeChunk = ''
        // topologicalSort promise for each edge (u -> v), u comes before v 
        for (let task of this._graph.topologicalSort()) {
            if (this._hasExperiment && this._experimentMembers.has(task)) {
                codeChunk += helpers.taskToExeCommands({
                    task,
                    config,
                    experimentParam: this._experimentParam,
                    experimentValues: this._experimentValues,
                })
            }
            else codeChunk += helpers.taskToExeCommands({ task, config })
        }
        return codeChunk;
    }

}


export default TasksDepandedGraph;