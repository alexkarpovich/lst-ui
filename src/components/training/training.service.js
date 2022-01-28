export const prepereSteps = (meta) => {
    if (!meta) {
        return [];
    }

    const completeStages = meta.completeCount / meta.uniqueItemCount;

    return Array.from({length: meta.stageCount}, (_, i) => ({
        progress: Math.min(Math.max(completeStages - i, 0) * 100, 100)
    }));
};

export const isComplete = ({stageCount, uniqueItemCount, completeCount}) => {
    return stageCount * uniqueItemCount === completeCount;
};