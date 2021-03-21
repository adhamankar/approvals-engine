import * as _ from "lodash-es"

export enum ConditionTypes {
    COMPLEX = 'COMPLEX',
    ANY = 'ANY',
    BINARY = 'BINARY',
    PARAMETER = 'PARAMETER',
    CONSTANT = 'CONSTANT'
}
export enum OperatorTypes {
    EQ = 'EQ',
    IN = 'IN'
}
export enum ConnectorTypes {
    AND = 'AND',
    OR = 'OR'
}

export function transformTemplate(model) {
    if (model && model.stages && model.stages.length > 0) {
        model.stages.forEach(stage => {
            if (stage.next && stage.next.length > 0) {
                stage.next.forEach(nextStage => {
                    nextStage.priority = nextStage.priority || 100; //lowest priority
                    nextStage.condition = nextStage.condition || { type: ConditionTypes.ANY };
                    nextStage.condition.type = nextStage.condition.type || ConditionTypes.ANY;

                    if (nextStage.condition.type == ConditionTypes.ANY) {
                        nextStage.priority = 100;
                    }
                    nextStage.expression = convertTreeToString(nextStage.condition);
                });
                stage.next = _.sortBy(stage.next, 'priority')
            }
        });
    }
}

export function convertTreeToString(node) {
    switch (node.type) {
        case ConditionTypes.ANY: return ConditionTypes.ANY;
        case ConditionTypes.PARAMETER: return node.value || 'UNKNOWN';
        case ConditionTypes.BINARY:
            return `(${convertTreeToString(node.left)} ${node.operator} ${convertTreeToString(node.right)} )`
        case ConditionTypes.CONSTANT:
            const value = node.value || 'UNKNOWN';
            return Array.isArray(value)
                ? `[${value.join(',')}]`
                : value;

        case ConditionTypes.COMPLEX:
            if (node.list) {
                const list = [];
                node.list.forEach(condition => {
                    list.push(convertTreeToString(condition))
                });
                switch (list.length) {
                    case 0: return '';
                    case 1: return list[0];
                    default:
                        const separator = ` ${node.connector} `;
                        return `(${list.join(separator)})`
                }
            }
            break;
    }
}

export function evaluateExpression(node, parameters) {
    switch (node.type) {
        case ConditionTypes.ANY:
            return true;
        case ConditionTypes.PARAMETER:
            const found = _.find(parameters, { code: node.value })
            return found ? found.value : null;
        case ConditionTypes.BINARY:
            const left = evaluateExpression(node.left, parameters);
            const right = evaluateExpression(node.right, parameters);
            if (node.operator === OperatorTypes.EQ) {
                return left === right;
            } else if (node.operator === OperatorTypes.IN) {
                const found = _.find(right, (p) => p === left);
                return found ? true : false;
            }
        case ConditionTypes.CONSTANT:
            return node.value;
        case ConditionTypes.COMPLEX:
            if (node.list) {
                const list = [];
                node.list.forEach(condition => {
                    list.push(evaluateExpression(condition, parameters))
                });
                switch (list.length) {
                    case 0: return '';
                    case 1: return list[0];
                    default:
                        if (node.connector === ConnectorTypes.AND) {
                            const failedRecords = _.filter(list, p => p === false);
                            return failedRecords.length === 0;
                        } else if (node.connector === ConnectorTypes.OR) {
                            const failedRecords = _.filter(list, p => p === true);
                            return failedRecords.length > 0;
                        }
                }
            }
            break;
    }
}
export function prepareGraph(model) {
    let graphDefinition = '';
    if (model && model.stages && model.stages.length > 0) {
        const stageDefinitions = [];
        stageDefinitions.push("graph TB");
        const endStageCode = 'END';
        model.stages.forEach(stage => {
            if (stage.next && stage.next.length > 0) {
                if (stage.next.length === 1) {
                    stageDefinitions.push(`${stage.code}([${stage.title}])-->${stage.next[0].stage}([${stage.title}])`);
                } else {
                    const ruleCode = stage.code + 'RULE'
                    stageDefinitions.push(`${stage.code}([${stage.title}])--> ${ruleCode}{exec}`);
                    stage.next.forEach(nextStage => {
                        let priorityText = '';
                        if (nextStage.priority) {
                            priorityText = nextStage.priority === 100 ? 'low' : `${nextStage.priority}`
                        }
                        stageDefinitions.push(`${ruleCode}-->|"${nextStage.condition?.type} (${priorityText})"| ${nextStage.stage}([${stage.title}])`);
                    });
                }
            } else {
                stageDefinitions.push(`${stage.code}([${stage.title}])-->${endStageCode}((X))`);
            }
        });
        if (stageDefinitions.length >= 2) {
            graphDefinition = stageDefinitions.join('\n');
        }
    }
    return graphDefinition;
}
