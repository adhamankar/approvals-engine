export enum ConditionTypes {
    COMPLEX = 'COMPLEX',
    ANY = 'ANY',
    BINARY = 'BINARY',
    PARAMETER = 'PARAMETER',
    CONSTANT = 'CONSTANT'
}

export function transformTemplate(model) {
    if (model && model.stages && model.stages.length > 0) {
        model.stages.forEach(stage => {
            if (stage.next && stage.next.length > 0) {
                stage.next.forEach(nextStage => {
                    nextStage.condition = nextStage.condition || { type: 'ANY' };
                    nextStage.condition.type = nextStage.condition.type || 'ANY';
                    nextStage.expression = convertTreeToString(nextStage.condition);
                });
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
                        stageDefinitions.push(`${ruleCode}-->|${nextStage.condition.type}| ${nextStage.stage}([${stage.title}])`);
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
