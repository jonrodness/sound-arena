import { combineReducers } from 'redux'
import competition from './competition'
import notification from './notification'
import entities from './entities'
import ui from './ui'
import user from './user'
import audio from './audio'
import conf from './conf'

const app = combineReducers({
	entities,
	ui,
	user,
	competition,
	audio,
	notification,
	conf
})

export default app