import * as babel from '@babel/core';
import generate from '@babel/generator';
import { HOOKS } from '../../constants/hooks';
import { createUnisynthComponent } from '../../helpers/create-unisynth-component';
import { getBindingsCode } from '../../helpers/get-bindings';
import { traceReferenceToModulePath } from '../../helpers/trace-reference-to-module-path';
import { JSONOrNode } from '../../types/json';
import { ReactivityType, UnisynthComponent } from '../../types/unisynth-component';
import { UnisynthNode } from '../../types/unisynth-node';
import { getPropsTypeRef } from './component-types';
import { jsxElementToJson } from './element-parser';
import { parseCode, parseCodeJson } from './helpers';
import { generateUseStyleCode, parseDefaultPropsHook } from './hooks';
import { processHookCode } from './hooks/helpers';
import { parseStateObjectToUnisynthState } from './state';
import { Context } from './types';

const { types } = babel;

/**
 * Parses function declarations within the Unisynth copmonent's body to JSON
 */
export const componentFunctionToJson = (
  node: babel.types.FunctionDeclaration,
  context: Context,
  stateToScope: string[],
): JSONOrNode => {
  const hooks: UnisynthComponent['hooks'] = {
    onMount: [],
    onEvent: [],
  };
  const state: UnisynthComponent['state'] = {};
  const accessedContext: UnisynthComponent['context']['get'] = {};
  const setContext: UnisynthComponent['context']['set'] = {};
  const refs: UnisynthComponent['refs'] = {};
  for (const item of node.body.body) {
    if (types.isExpressionStatement(item)) {
      const expression = item.expression;
      if (types.isCallExpression(expression) && types.isIdentifier(expression.callee)) {
        switch (expression.callee.name) {
          case HOOKS.SET_CONTEXT: {
            const keyNode = expression.arguments[0];
            const valueNode = expression.arguments[1];
            if (types.isIdentifier(keyNode)) {
              const key = keyNode.name;
              const keyPath = traceReferenceToModulePath(context.khulnasoft.component.imports, key)!;
              if (valueNode) {
                if (types.isObjectExpression(valueNode)) {
                  const value = parseStateObjectToUnisynthState(valueNode);
                  setContext[keyPath] = {
                    name: keyNode.name,
                    value,
                  };
                } else {
                  const ref = generate(valueNode).code;
                  setContext[keyPath] = {
                    name: keyNode.name,
                    ref,
                  };
                }
              }
            } else if (types.isStringLiteral(keyNode)) {
              if (types.isExpression(valueNode)) {
                setContext[keyNode.value] = {
                  name: `"${keyNode.value}"`,
                  ref: generate(valueNode).code,
                };
              }
            }
            break;
          }
          case HOOKS.MOUNT: {
            const firstArg = expression.arguments[0];
            const hookOptions = expression.arguments[1];
            if (types.isFunctionExpression(firstArg) || types.isArrowFunctionExpression(firstArg)) {
              const code = processHookCode(firstArg);
              let onSSR = false;

              if (types.isObjectExpression(hookOptions)) {
                const onSSRProp = hookOptions.properties.find(
                  (property) =>
                    types.isProperty(property) &&
                    types.isIdentifier(property.key) &&
                    property.key.name === 'onSSR',
                );

                if (types.isObjectProperty(onSSRProp) && types.isBooleanLiteral(onSSRProp.value)) {
                  onSSR = onSSRProp.value.value;
                }
              }

              hooks.onMount.push({
                code,
                onSSR,
              });
            }
            break;
          }
          case HOOKS.EVENT: {
            const firstArg = expression.arguments[0];
            const secondArg = expression.arguments[1];
            const thirdArg = expression.arguments[2];
            const fourthArg = expression.arguments[3];

            if (!types.isStringLiteral(firstArg)) {
              console.warn(
                '`onEvent` hook skipped. Event name must be a string literal: ',
                generate(expression).code,
              );
              break;
            }
            if (
              !types.isFunctionExpression(secondArg) &&
              !types.isArrowFunctionExpression(secondArg)
            ) {
              console.warn(
                '`onEvent` hook skipped. Event handler must be a function: ',
                generate(expression).code,
              );
              break;
            }

            if (!types.isIdentifier(thirdArg)) {
              console.warn(
                '`onEvent` hook skipped. Element ref must be a value: ',
                generate(expression).code,
              );
              break;
            }

            const isRoot = types.isBooleanLiteral(fourthArg) ? fourthArg.value : false;

            const eventArgName = types.isIdentifier(secondArg.params[0])
              ? secondArg.params[0].name
              : 'event';

            const elementArgName = types.isIdentifier(secondArg.params[1])
              ? secondArg.params[1].name
              : 'element';

            hooks.onEvent.push({
              eventName: firstArg.value,
              code: processHookCode(secondArg),
              refName: thirdArg.name,
              isRoot,
              eventArgName,
              elementArgName,
            });
            break;
          }
          case HOOKS.UPDATE: {
            const firstArg = expression.arguments[0];
            const secondArg = expression.arguments[1];
            if (types.isFunctionExpression(firstArg) || types.isArrowFunctionExpression(firstArg)) {
              const code = processHookCode(firstArg);
              if (
                !secondArg ||
                (types.isArrayExpression(secondArg) && secondArg.elements.length > 0)
              ) {
                const depsCode = secondArg ? generate(secondArg).code : '';

                hooks.onUpdate = [
                  ...(hooks.onUpdate || []),
                  {
                    code,
                    deps: depsCode,
                  },
                ];
              }
            }
            break;
          }
          case HOOKS.UNMOUNT: {
            const firstArg = expression.arguments[0];
            if (types.isFunctionExpression(firstArg) || types.isArrowFunctionExpression(firstArg)) {
              const code = processHookCode(firstArg);
              hooks.onUnMount = { code };
            }
            break;
          }
          case HOOKS.INIT: {
            const firstArg = expression.arguments[0];
            if (types.isFunctionExpression(firstArg) || types.isArrowFunctionExpression(firstArg)) {
              const code = processHookCode(firstArg);
              hooks.onInit = { code };
            }
            break;
          }
          case HOOKS.DEFAULT_PROPS: {
            parseDefaultPropsHook(context.khulnasoft.component, expression);
            break;
          }
          case HOOKS.STYLE: {
            context.khulnasoft.component.style = generateUseStyleCode(expression);
            break;
          }
          case HOOKS.METADATA: {
            context.khulnasoft.component.meta[HOOKS.METADATA] = {
              ...context.khulnasoft.component.meta[HOOKS.METADATA],
              ...parseCodeJson(expression.arguments[0]),
            };
            break;
          }
        }
      }
    }

    if (types.isFunctionDeclaration(item)) {
      if (types.isIdentifier(item.id)) {
        state[item.id.name] = {
          code: generate(item).code,
          type: 'function',
        };
        stateToScope.push(item.id.name);
      }
    }

    if (types.isVariableDeclaration(item)) {
      const declaration = item.declarations[0];
      const init = declaration.init;
      if (types.isCallExpression(init) && types.isIdentifier(init.callee)) {
        // React format, like:
        // const [foo, setFoo] = useState(...)
        if (types.isArrayPattern(declaration.id) && init.callee.name === HOOKS.STATE) {
          const varName =
            types.isIdentifier(declaration.id.elements[0]) && declaration.id.elements[0].name;
          if (varName) {
            const value = init.arguments[0];
            // Function as init, like:
            // useState(() => true)
            if (types.isArrowFunctionExpression(value)) {
              state[varName] = {
                code: parseCode(value.body),
                type: 'function',
              };
            } else {
              const stateOptions = init.arguments[1];

              let propertyType: ReactivityType = 'normal';

              if (types.isObjectExpression(stateOptions)) {
                for (const prop of stateOptions.properties) {
                  if (!types.isProperty(prop) || !types.isIdentifier(prop.key)) continue;
                  const isReactive = prop.key.name === 'reactive';

                  if (isReactive && types.isBooleanLiteral(prop.value) && prop.value.value) {
                    propertyType = 'reactive';
                  }
                }
              }

              // Value as init, like:
              // useState(true)
              state[varName] = {
                code: parseCode(value),
                type: 'property',
                propertyType,
              };
            }

            stateToScope.push(varName);

            // Typescript Parameter
            if (types.isTSTypeParameterInstantiation(init.typeParameters)) {
              state[varName]!.typeParameter = generate(init.typeParameters.params[0]).code;
            }
          }
        } else if (init.callee.name === HOOKS.STORE) {
          const firstArg = init.arguments[0];
          if (types.isObjectExpression(firstArg)) {
            const useStoreState = parseStateObjectToUnisynthState(firstArg);
            Object.assign(state, useStoreState);
            const stateKeys = Object.keys(useStoreState);
            if (types.isTSTypeParameterInstantiation(init.typeParameters)) {
              const type = generate(init.typeParameters.params[0]);
              // Type for store has to be an object so we can use it like this
              for (const key of stateKeys) {
                state[key]!.typeParameter = `${type.code}["${key}"]`;
              }
            }
          }
        } else if (init.callee.name === HOOKS.CONTEXT) {
          const firstArg = init.arguments[0];
          if (types.isVariableDeclarator(declaration) && types.isIdentifier(declaration.id)) {
            if (types.isIdentifier(firstArg)) {
              const varName = declaration.id.name;
              const name = firstArg.name;
              accessedContext[varName] = {
                name,
                path: traceReferenceToModulePath(context.khulnasoft.component.imports, name)!,
              };
            } else {
              const varName = declaration.id.name;
              const name = generate(firstArg).code;
              accessedContext[varName] = {
                name,
                path: '',
              };
            }
          }
        } else if (init.callee.name === HOOKS.REF) {
          if (types.isIdentifier(declaration.id)) {
            const firstArg = init.arguments[0];
            const varName = declaration.id.name;
            refs[varName] = {
              argument: generate(firstArg).code,
            };
            // Typescript Parameter
            if (types.isTSTypeParameterInstantiation(init.typeParameters)) {
              refs[varName].typeParameter = generate(init.typeParameters.params[0]).code;
            }
          }
        }
      }
    }
  }

  const theReturn = node.body.body.find((item) => types.isReturnStatement(item));
  const children: UnisynthNode[] = [];
  if (theReturn) {
    const value = (theReturn as babel.types.ReturnStatement).argument;
    if (types.isJSXElement(value) || types.isJSXFragment(value)) {
      const jsxElement = jsxElementToJson(value);
      if (jsxElement) {
        children.push(jsxElement);
      }
    }
  }

  const { exports: localExports } = context.khulnasoft.component;
  if (localExports) {
    const bindingsCode = getBindingsCode(children);
    Object.keys(localExports).forEach((name) => {
      const found = bindingsCode.find((code: string) => code.match(new RegExp(`\\b${name}\\b`)));
      localExports[name].usedInLocal = Boolean(found);
    });
    context.khulnasoft.component.exports = localExports;
  }

  const propsTypeRef = getPropsTypeRef(node, context);

  return createUnisynthComponent({
    ...context.khulnasoft.component,
    name: node.id?.name,
    state,
    children,
    refs: refs,
    hooks,
    context: {
      get: accessedContext,
      set: setContext,
    },
    propsTypeRef,
  }) as any;
};