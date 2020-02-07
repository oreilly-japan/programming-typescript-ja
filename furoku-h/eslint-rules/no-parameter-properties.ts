import {
  AST_NODE_TYPES,
  ESLintUtils,
  TSESTree
} from '@typescript-eslint/experimental-utils'

const createRule = ESLintUtils.RuleCreator(name => name)

module.exports = createRule({
  name: 'no-parameter-properties',
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow parameter properties of classes',
      category: 'Stylistic Issues',
      recommended: false
    },
    messages: {
      parameterProperty: 'Parameter property {{name}} is not allowed.'
    },
    schema: [],
    fixable: 'code'
  },
  defaultOptions: [],
  create: ctx => ({
    TSParameterProperty: node => {
      const { name } =
        node.parameter.type === AST_NODE_TYPES.Identifier
          ? node.parameter
          : ((node.parameter as TSESTree.AssignmentPattern)
              .left as TSESTree.Identifier)
      ctx.report({
        node,
        messageId: 'parameterProperty',
        data: { name },
        fix: fixer => {  // ❷
          // ❸
          const typeChecker = ctx.parserServices?.program?.getTypeChecker()
          const tsNode = ctx.parserServices?.esTreeNodeToTSNodeMap?.get(node)
          if (!typeChecker || !tsNode) {
            throw new Error(
              'Missing "parserOptions.project" for @typescript-eslint/parser.'
            )
          }
          const modifiers = tsNode.modifiers!  // ❹
          const modifiersString = modifiers
            .map(modifier => modifier.getText())
            .join(' ')
          // ❺
          const constructorFn = node.parent as TSESTree.FunctionExpression
          const constructorBody = constructorFn.body!
          const classBody = (constructorFn.parent as TSESTree.MethodDefinition)
            .parent as TSESTree.ClassBody
          return [
            fixer.insertTextAfterRange(  // ❻
              [classBody.range[0], classBody.range[0] + 1],
              `${modifiersString} ${name}: ${typeChecker.typeToString(
                typeChecker.getTypeAtLocation(tsNode)
              )};`
            ),
            fixer.removeRange([  // ❼
              modifiers[0].getStart(),
              modifiers[modifiers.length - 1].getEnd()
            ]),
            fixer.insertTextAfterRange(  // ❽
              [constructorBody.range[0], constructorBody.range[0] + 1],
              `this.${name} = ${name};`
            )
          ]
        }
      })
    }
  })
})
