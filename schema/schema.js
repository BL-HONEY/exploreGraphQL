const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book.model');
const Author = require('../models/author.model');
const { GraphQLObjectType , 
    GraphQLString ,
     GraphQLSchema ,
    GraphQLID,
GraphQLInt,
GraphQLList } = graphql;

// var books = [
//  {name:"11 minutes", genre: "Fantasy", id:"1" , authorId: '1'},
//  {name:"Lord of rings", genre: "Sci-fi", id:"2" , authorId: '2'},
//  {name:"The one unicorn", genre: "Biography", id:"3", authorId: '3'}
// ];

// var authors = [
//     {name : "Patrick",age:44,id:"1", bookId: '1'},
//     {name : "Brandon",age:42,id:"2", bookId: '2'},
//     {name : "Paulo",age:40,id:"3", bookId: '3'}
// ]
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
      id: { type: GraphQLString},
      name: { type: GraphQLString},
      genre: { type: GraphQLString},
      author: {
          type: AuthorType,
          resolve(parent, args){
            //   return _.find(authors,{id: parent.authorId});
            return Author.findById(parent.authorId);
          }
      }
    })
});


const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
      id: { type: GraphQLString},
      name: { type: GraphQLString},
      age: { type: GraphQLInt},
      books: {
          type: new GraphQLList(BookType),
          resolve(parent, args){
            //   return _.filter(books, {authorId: parent.id})
            return Book.find({authorId:parent.id})
          }
      }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLID}},
            resolve(parent,args){
                //code to get data from db or other resource
            //  return _.find(books , {id : args.id});
            return Book.findById(args.id);
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID}},
            resolve(parent,args){
                //code to get data from db or other resource
            //  return _.find(authors , {id : args.id});
            return Author.findById(args.id);
            }
        },
        books:{
            type: new GraphQLList(BookType),
            resolve(parent, args){
                return Book.find({});
            }
        },
        authors:{
            type: new GraphQLList(AuthorType),
            resolve(parent, args){
                return Author.find({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: GraphQLString },
                age: { type: GraphQLInt }
            },
            resolve(parent, args){
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: GraphQLString },
                genre: { type: GraphQLString },
                authorId: { type: GraphQLID}
            },
            resolve(parent, args){
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });
                return book.save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});