import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLNonNull
} from 'graphql';

import ToDoMongo from '../model/to-do'

/**
 * generate projection object for mongoose
 * @param  {Object} fieldASTs
 * @return {Project}
 */

export function getProjection(fieldASTs) {
  return fieldASTs.fieldNodes[0].selectionSet.selections.reduce((projections, selection) => {
    projections[selection.name.value] = true;
    return projections;
  }, {});
}

const TodoType = new GraphQLObjectType({
  name: 'Todo',
  description: 'todo item',
  fields: () => ({
    itemId: {
      type: (GraphQLInt),
      description: 'The id of the todo.',
    },
    item: {
      type: GraphQLString,
      description: 'The name of the todo.',
    },
    completed: {
      type: GraphQLBoolean,
      description: 'Completed todo? '
    }
  })
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'The root of all... queries',
    fields: {
      todo: {
        type: new GraphQLList(TodoType),
        args: {
          itemId: {
            name: 'itemId',
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve: (root, {
          itemId
        }, source, fieldASTs) => {
          var projections = getProjection(fieldASTs);
          var foundItems = new Promise((resolve, reject) => {
            ToDoMongo.find({
              itemId
            }, projections, (err, todos) => {
              err ? reject(err) : resolve(todos)
            })
          })
          return foundItems
        }
      }
    }
  })
});

export default schema;
