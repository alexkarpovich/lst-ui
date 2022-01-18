import { SET_VIEW_FETCHING, SET_VIEW_DATA, ATTACH_EXPRESSION, ATTACH_TRANSLATION, DETACH_TRANSLATION, DETACH_EXPRESSION } from "./slices.const";


export const slicesViewReducer = (state, action) => {
    switch (action.type) {
        case SET_VIEW_FETCHING:
            return {...state, isFetching: action.payload};
        case SET_VIEW_DATA: {
            return {...state, isFetching: false, ...action.payload};
        }
        case ATTACH_EXPRESSION: {
            const expressions = [action.payload, state.expressions];

            return {...state, expressions};
        }
        case DETACH_EXPRESSION: {
            const {expressionId} = action.payload;
            const expressions = state.expressions.filter(expr => expr.id !== expressionId);

            return {...state, expressions};
        }
        case ATTACH_TRANSLATION: {
            const {translation, expressionId} = action.payload;
            const expressions = state.expressions.map(expr => {
                if (expr.id === expressionId) {
                    expr.translations = expr.translations || [];

                    expr.translations.push(translation);
                }

                return expr;
            });
            return {...state, expressions};
        }
        case DETACH_TRANSLATION: {
            const {expressionId, translationId} = action.payload;
            const expressions = state.expressions.map(expr => {
                if (expr.id === expressionId) {
                    expr.translations = expr.translations.filter(trans => trans.id !== translationId);
                }

                return expr;
            });

            return {...state, expressions};
        }
        default:
            return state;
    }
};