import { 
    SET_VIEW_FETCHING, SET_VIEW_DATA, ATTACH_EXPRESSION, ATTACH_TRANSLATION, DETACH_TRANSLATION, 
    DETACH_EXPRESSION, ATTACH_EXPRESSION_TRANSCRIPTION, ATTACH_TRANSLATION_TRANSCRIPTION, 
    DETACH_TRANSLATION_TRANSCRIPTION, SHOW_TRANSLATION_TRANSCRIPTIONS, SET_SUBROW_OBJECT_ID,
} from "./slices.const";


export const slicesViewReducer = (state, action) => {
    switch (action.type) {
        case SET_VIEW_FETCHING:
            return {...state, isFetching: action.payload};
        case SET_VIEW_DATA: {
            return {...state, isFetching: false, ...action.payload};
        }
        case ATTACH_EXPRESSION: {
            const expressions = [action.payload, ...state.expressions];

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
        case ATTACH_EXPRESSION_TRANSCRIPTION: {
            const {expressionId, transcription} = action.payload;
            const expressions = state.expressions.map(expr => {
                if (expr.id === expressionId) {
                    if (!expr.transcriptions) {
                        expr.transcriptions = [];
                    }

                    expr.transcriptions.push(transcription);
                }
                return expr;
            })

            console.log(expressions)
            return {...state, expressions};
        }
        case ATTACH_TRANSLATION_TRANSCRIPTION: {
            const {expressionId, translationId, transcription} = action.payload;
            const expressions = state.expressions.map(expr => {
                if (expr.id === expressionId) {
                    expr.translations.map(tr => {
                        if (tr.id === translationId) {
                            if (!tr.transcriptions) {
                                tr.transcriptions = [transcription];
                            } else {
                                tr.transcriptions.push(transcription);
                            }
                        }

                        return tr;
                    });
                }

                return expr;
            });

            return {...state, expressions};
        }

        case DETACH_TRANSLATION_TRANSCRIPTION: {
            const {expressionId, translationId, transcription} = action.payload;
            const expressions = state.expressions.map(expr => {
                if (expr.id === expressionId) {
                    expr.translations.map(tr => {
                        if (tr.id === translationId) {
                            tr.transcriptions = tr.transcriptions.filter(tsc => tsc.id !== transcription.id);
                        }

                        return tr;
                    });
                }

                return expr;
            });

            return {...state, expressions};
        }
        case SHOW_TRANSLATION_TRANSCRIPTIONS: {
            return {...state, showTranslationTranscriptions: action.payload};
        }
        case SET_SUBROW_OBJECT_ID: {
            return {...state, subrowObjectId: action.payload};
        }
        default:
            return state;
    }
};