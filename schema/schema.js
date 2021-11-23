const graphql = require('graphql');
const Employee = require('../models/employee');
const Department = require('../models/Department');

const { GraphQLObjectType, GraphQLString, 
       GraphQLID, GraphQLInt, GraphQLSchema, GraphQLList} = graphql;


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

const DepartmentType = new GraphQLObjectType({
    name: 'department',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        employno:{type: GraphQLInt}
        
    })
})



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
                
                return Employee.findById(args.id);
            }
        },
        employees:{
            type: new GraphQLList(employeetype),
            resolve(parent, args) {
                return Employee.find({});
            }
        },

        department:{
            type: DepartmentType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Department.findById(args.id);
            }
        },
        departments:{
            type: new GraphQLList(DepartmentType),
            resolve(parent, args) {
                return Department.find({});
            }
        }
       
        
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addDepartment: {
            type: DepartmentType,
            args: {
                //GraphQLNonNull make these field required
                name: { type: GraphQLString },
                employno: { type: GraphQLInt }
            },
            resolve(parent, args) {
                let department = new Department({
                    name: args.name,
                    employno: args.employno
                });
                return department.save();
            }
        },
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
                Department.find({ name: args.department}, function (err, docs) {
                    if (docs.length == 0) {
                        console.log(err);
                        let department = new Department({
                            name: args.department,
                            employno: 1
                        });
                        department.save();
                    }
                    else{
                        console.log(docs);
                        console.log("Find and Update");
                        Department.findOneAndUpdate({ name: args.department}, { $inc: { employno: 1 } }, function (err, doc) {
                            if (err) {
                                console.log("Something wrong when updating data!");
                            }
                            console.log(doc);
                        });
                    }
                    
                });
                return employee.save();
            }
        },
        updateDepartment: {
            type: DepartmentType,
            args: {
                id: { type: GraphQLID },
                name: { type: GraphQLString },
                employno: { type: GraphQLInt }
            },
            resolve(parent, args) {
                return Department.findByIdAndUpdate(args.id, {
                    $set: {
                        name: args.name,
                        employno: args.employno
                    }
                }, { new: true });
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