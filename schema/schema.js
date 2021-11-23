const graphql = require('graphql');
const Employee = require('../models/employee');

const { GraphQLObjectType, GraphQLString, 
       GraphQLID, GraphQLInt, GraphQLSchema, GraphQLList} = graphql;

//Schema defines data on the Graph like object types(book type), relation between 
//these object types and descibes how it can reach into the graph to interact with 
//the data to retrieve or mutate the data   
const mongoose = require('mongoose');

const connectDB = async() => {
    console.log("connecting to db");
    const dbName = 'test';
    await mongoose.connect(
        'mongodb://127.0.0.1:27017', 
    );
    console.log("MongoDB connected");
}
connectDB();


const employeetype = new GraphQLObjectType({
    name: 'Employee',
    fields: () => ({
        id: { type: GraphQLID  },
        name: { type: GraphQLString }, 
        department: { type: GraphQLString },
        email: { type: GraphQLString }
    })
});

//RootQuery describe how users can use the graph and grab data.
//E.g Root query to get all authors, get all books, get a particular book 
//or get a particular author.
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        employee: {
            type: employeetype,
            //argument passed by the user while making the query
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //Here we define how to get data from database source

                //this will return the book with id passed in argument 
                //by the user
                return Employee.findById(args.id);
            }
        },
        employees:{
            type: new GraphQLList(employeetype),
            resolve(parent, args) {
                return Employee.find({});
            }
        },
       
        
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addEmployee:{
            type: employeetype,
            args: {
                name: { type: GraphQLString },
                department: { type: GraphQLString },
                email: { type: GraphQLString },
                ID: { type: GraphQLString }
            },
            resolve(parent, args) {
                let employee = new Employee({
                    name: args.name,
                    department: args.department,
                    email: args.email,
                    ID: args.ID
                });
                return employee.save();
            }
        },
        deleteEmployee:{
            type: employeetype,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                return Employee.findByIdAndRemove(args.id);
            }
    },
    updateEmployee:{
        type: employeetype,
        args: {
            id: { type: GraphQLID },
            name: { type: GraphQLString },
            department: { type: GraphQLString },
            email: { type: GraphQLString },
            ID: { type: GraphQLString }
        },
        resolve(parent, args) {
            return Employee.findByIdAndUpdate(args.id, {
                $set: {
                    name: args.name,
                    department: args.department,
                    email: args.email,
                    ID: args.ID
                }
            });
        }
    },
}});
 
//Creating a new GraphQL Schema, with options query which defines query 
//we will allow users to use when they are making request.
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});