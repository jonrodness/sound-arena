import { createSelector } from 'reselect'
import { resolveStage } from '../reducers/competition'

const track1Selector = state => state.competition.track1
const track2Selector = state => state.competition.track2
const winnerSelector = state => state.competition.winner

export const currentStageSelector = createSelector(
    track1Selector,
    track2Selector,
    winnerSelector,
    resolveStage
)