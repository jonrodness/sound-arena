
import puppeteer from 'puppeteer'
import { resolveStage, COMPETITION_STAGE } from '../client/src/reducers/competition'
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000; // Allow page to load + wait for track completion

const signInBtnSelector = '[data-test-id="sign-in-btn"]'
const signOutBtnSelector = '[data-test-id="sign-out-btn"]'
const emailInputSelector = '[id="ui-sign-in-email-input"]'
const passwordInputSelector = '[id="ui-sign-in-password-input"]'
const competitionNavSelector = '[data-test-id="competition-nav-btn"]'
const track1PlaybackBtnSelector = '.m-track--1 .m-track__playbackBtn'
const track2PlaybackBtnSelector = '.m-track--2 .m-track__playbackBtn'
const selectWinnerBtn1Selector = '.m-track--1 [data-test-id="select-winner-btn"]'
const selectWinnerBtn2Selector = '.m-track--2 [data-test-id="select-winner-btn"]'
const winnerPlaybackBtnSelector = '[data-test-id="winner-playback-btn"]'
const startCompBtnSelector = '[data-test-id="start-competition-btn"]'

const competitionReqPath = '/api/auth/competition'

const waitForSignIn = async page => {
  await page.$(signOutBtnSelector)
}

describe('competition flow', () => {
  let browser
  let page
  let competitionStage = ''

  const getCompetitionStageFromResponse = async response => {
    const body = await response.json()
    const {
      track1,
      track2,
      winner
    } = body.competition
     const stage = resolveStage(track1, track2, winner)
     return stage
  }

  const playTrack = async selector => {
    await page.waitForSelector(selector, {
      visible: true
    })

    page.click(selector)
  }

  const playTrack1 = async () => {
    await playTrack(track1PlaybackBtnSelector)
    competitionStage = COMPETITION_STAGE.TRACK2_2
  }

  const playTrack2 = async () => {
    await playTrack(track2PlaybackBtnSelector)
    competitionStage = COMPETITION_STAGE.DECIDING_3
  }  

  const selectWinner = async () => {
    // Randomly select track 1 or 2 as winner
    const selector = Math.random() > 0.5 ? selectWinnerBtn1Selector : selectWinnerBtn2Selector
    await page.waitForSelector(selector, {
      visible: true
    })
    page.click(selector)
    competitionStage = COMPETITION_STAGE.WINNER_4
  }
  
  const playWinnerTrack = async () => {
    await playTrack(winnerPlaybackBtnSelector)
    competitionStage = COMPETITION_STAGE.COMPLETE_5
  }

  const startCompetition = async () => {
    await page.waitForSelector(startCompBtnSelector, {
      visible: true
    })
    page.click(startCompBtnSelector)
    competitionStage = COMPETITION_STAGE.TRACK1_1
  }

  const executeNextCompetitionStep = async () => {
    switch(competitionStage) {
      case COMPETITION_STAGE.TRACK1_1:
        await playTrack1()
        break
      case COMPETITION_STAGE.TRACK2_2:
        await playTrack2()
        break
      case COMPETITION_STAGE.DECIDING_3:
        await selectWinner()
        break
      case COMPETITION_STAGE.WINNER_4:
        await playWinnerTrack()
        break
      case COMPETITION_STAGE.COMPLETE_5:
        await startCompetition()
        break
    }  
  }

  beforeAll(async () => {
    browser = await puppeteer.launch({ 
      executablePath: 'chrome.exe',
      headless: false 
    })
    page = await browser.newPage();
  })

  it('logs in and completes competition', async (done) => {
    await page.goto('http://localhost:3000/');
    await page.waitForSelector(signInBtnSelector, {
      visible: true
    })
    
    page.click(signInBtnSelector)

    await page.waitForSelector(emailInputSelector, {
      visible: true
    })
    const emailInput = await page.$(emailInputSelector)
    await emailInput.type('emailInput')
    await emailInput.press('Enter')

    await page.waitForSelector(passwordInputSelector, {
      visible: true
    })
    const passwordInput = await page.$(passwordInputSelector)
    await passwordInput.type('passwordInput')
    await passwordInput.press('Enter')

    await waitForSignIn(page)
    await page.waitForSelector(competitionNavSelector, {
      visible: true
    })
    page.click(competitionNavSelector)
    const competitionStatusRes = await page.waitForResponse(
      response => response.url().endsWith(competitionReqPath)
    )

    // Execute all steps in competition twice
    competitionStage = await getCompetitionStageFromResponse(competitionStatusRes)
    for (var i = 0; i < 10; i++) {
      await executeNextCompetitionStep()
    }

    done()
  })  
})