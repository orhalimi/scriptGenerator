# Task Compiler

## Notes
* The purpose of the assignment is to check the way you think. There is more than one solution to the problem.<br>
* The program will be written in Python 3 or Node.js. You can use any open source library.
* The program is supposed to be runnable easily using a simple command like ```./run.sh``` or ```make run```. It will install the requirements and run the program. Ideally (strongly recommended) it will build and run a docker in order to avoid compatibility and installation issues. (You can assume the executor has python3 and docker on his machine)
* The assignment includes 4 questions. The first three ones are mandatory. The fourth one is a bonus but it's highly recommended to implement it as well. In case your answer to the 3 first questions are less acceptable, the fourth question could get you a significant bonus.
* The 4 questions are very related. Please read them all before starting, as it could help you design your solution from the beginning.

## The context

* The objective is to build a task compiler, based on a task template.
* A task is a simple program execution given an input.
* Task have dependencies, which are other tasks.
* The input is an array of strings.
* A template describes the tasks that need to be executed, and their dependencies.
* A task execution is a UNIX line of code that is able to get a variable ```$input```. Example ```ping $input``` or ```python task.py $input```
* A task may have zero, one, or more dependencies

### Example

#### Template:
```
# task definitions
task1.1: echo "$input 1.1"
task1.2: echo "$input 1.2"
task2.1: echo "$input 2.1"
task2.2: echo "$input 2.2"
task3: echo "$input 3"

# dependencies
2.1<-1.1 # means that 2.1 depends on 1.1 
2.2<-1.2
3<-2.1,2.2 # means that 2.1 depends on 2.1 and 2.2
```

#### Input:
```
A
B
```

#### Output:
File A:
```
echo "A 1.1"
echo "A 1.2"
echo "A 2.1"
echo "A 2.2"
echo "A 3"
```

File B:
```
echo "B 1.2"
echo "B 1.1"
echo "B 2.1"
echo "B 2.2"
echo "B 3"
```
As you can see, independent tasks can run in any order, even in parallel. Dependent tasks have to run one after the other.

## Question 1

Provide a programmatic template definition language that the next program will be able parse.<br>
You can for example take the previous example and write a programmatic template for it.<br>
It should both explain what task should run, and their dependencies (the tasks they should run after).
* The template could be in any document format or even code, as soon as it's parsable by a program.
* Please provide samples of templates


## Question 2

Given the previous template definition language, write a program that's able the parse a template, and given an input (an array of strings), as in the previous example, will write output files, one for each item in the input, that is an execution file according to the template.

### Input
* A template in the template definition language is definied in question 1
* The input (an array of strings)

### Output
For each item in the input a file will be created and will represent the execution program of this item.

### Things to consider
* A single task may be dependent on several other tasks
* A single task may be a dependency of serveral other tasks
* The template (a graph) cannot contain circular paths
* Is there a way to speed up execution by running part of the commands in parallel (bonus)

## Question 3
We want now to read input, and save output, from and to Redis, or any other database. <br>
So given the program of question 3, you will read the template, as well as the input from Redis/DB.<br>
Once the output is ready, we will keep it in Redis.

For example, all the output files will be kept in a single key in Redis, each one as a separate item. You can for example use the LIST data type in Redis.

We strongly suggest here to use Docker as it will be the simpler way to run Redis/other DB. Consider Docker Compose to run both Redis and your program.

## Question 4: A/B test (BONUS)
Let's say we want to run experiments. <br>
An experiment is a small change in one of the tasks. It is helpful to test several values of a parameter of a program, and test which value gives better results.

For example, give the execution ```./forecast.py -G $g $input``` , we may want to try different value of ```G``` and test which one returns the best forecast.

So given the template
```
# tasks
prepare: ./prepare.py $input
forecast: ./forcast.py -G 3 $input

# dependencies
forecast: prepare
```
We may want to test different values of ```G``` this way
```
# tasks
prepare: ./prepare.py $input
forecast: ./forcast.py -G $g $input

# dependencies
forecast: prepare

# experiment
forecast: $g=[2,3,4]
```
Meaning that we want to run forecast 3 times with 3 different values (3,4,5)

So instead of this output on the input ```[A]```
```
./prepare.py A
./forecast.py -G 3 A
```
We will get the output
```
./prepare.py A
./forecast.py -G 3 -v g3 A
./forecast.py -G 4 -v g4 A
./forecast.py -G 5 -v g5 A
```
```-v g3``` means that the execution version if ```g3``` (because the value of the paramter ```g``` in this variant is ```3```)

Pay attention that since ```prepare``` is prior to the tested task, we do not need to duplicate it. Nevertheless, if a task was dependent of ```forecast``` it had to be duplicated too, as well as its own dependencies

Example:
```
# tasks
prepare: ./prepare.py $input
forecast: ./forecast.py -G $g $input
norm: ./nomalize.py $input

# dependencies
forecast: prepare
norm: forecast

# experiment
forecast: $g=[3,4,5]
```
Output on input=[A]
```
./prepare.py A
./forecast.py -G 3 -v g3 A
./forecast.py -G 4 -v g4 A
./forecast.py -G 5 -v g5 A
./normalize.py -v g3 A
./normalize.py -v g4 A
./normalize.py -v g5 A
```

Amend the template language definition from question 1, as well as the program from question 2, so that they support experiments as described in this question

### Things to consider
* We can only run 1 experiment in a single template, meaning that only one single parameter of one single task can be tested with different values
* All the sub-graph under the experiement node should be duplicated.



It you have any question, don't hesitate to contact us.

Good Luck!