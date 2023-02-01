import React, {useState} from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import { get } from 'lodash'
import IconButton from '@material-ui/core/IconButton'
import { MdEdit, MdSave } from 'react-icons/lib/md'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import LoadableElement from '../../global/LoadableElement'
import InputLabel from '@material-ui/core/InputLabel';

export const TextInputComponent = props => {
  const {
    errorMsg = '',
    originalText = '',
    isInputValid = () => true,
    inputProps = {},
    loadIds = [],
    onSaveInput,
    editLabel,
    label,
    maxLength,
    minLength,
    textSize
  } = props

  const [isEditInputActive, setIsEditInputActive] = useState(false)
  const [newInput, setNewInput] = useState(originalText)
  const [isInputError, setInputError] = useState(false)

  const onClickSaveInput = () => {
    if (originalText !== newInput) {
      onSaveInput(newInput)
    }

    closeEditInput()
  }

  const onClickEditInput = () => {
    setIsEditInputActive(true)
    setNewInput(originalText)
    setInputError(false)
  }

  const onChangeInput = event => {
    const constraints = {
      minLength,
      maxLength
    }
    const newInput = get(event, 'target.value', '')
    const isValid = isInputValid(newInput, constraints)

    if (isInputError === true && isValid) {
      setInputError(false)
    } else if (isInputError === false && !isValid) {
      setInputError(true)
    }
    setNewInput(newInput)
  }

  const onClickCancel = () => {
      closeEditInput()
  }

  const closeEditInput = () => {
    setIsEditInputActive(false)
    setNewInput(originalText)
    setInputError(false)
  }

  let textVariant = 'h5'

  switch(textSize) {
    case 'small':
      textVariant = 'caption'
      break
  }

  return (
    <LoadableElement
      loadIds={ loadIds }
      centered={ true }
    >
      {
        isEditInputActive ? (
          <>
            <div className='a-input a-input--active'>
              <div>
                <div className='u-marginBottom'>
                  <InputLabel>
                    {editLabel}
                  </InputLabel>
                </div>
                <TextField
                  defaultValue={ originalText } 
                  onChange={event => onChangeInput(event)}
                  error={ isInputError }
                  inputProps={inputProps}
                />
              </div>
              <div className='a-input__buttonGroup'>
                <div className='a-input__button1'>
                  <Button 
                    startIcon={<MdSave />}
                    variant="contained"
                    color="primary"
                    size='small'
                    onClick={() => onClickSaveInput()}
                    disabled={isInputError}
                  >
                    Save
                  </Button>
                </div>
                <div className='a-input__button2'>
                  <Button 
                    variant="outlined"
                    color="secondary"
                    size='small'
                    onClick={() => onClickCancel()}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
            {
              isInputError && (
                <div className='a-input__error'>
                  <Typography
                    variant='caption' 
                    component='p'        
                  >
                    { errorMsg }
                  </Typography>
                </div>
              )
            }
          </>
        ) : (
          <div className='a-input'>
            <IconButton 
              onClick={() => onClickEditInput()}
              size='small'
            >
              <MdEdit />
            </IconButton>
            {
              label && (
                <Typography 
                  variant={textVariant}
                  component='p'
                >
                  {label}&nbsp;
                </Typography> 
              )
            }                   
            <Typography
              variant={textVariant} 
              component='h2'
            >
              { originalText }
            </Typography>
          </div>
        )
      }
    </LoadableElement>
  )
}

TextInputComponent.propTypes = {
  errorMsg: PropTypes.string,
  originalText: PropTypes.string,
  isInputValid: PropTypes.func,
  loadIds: PropTypes.array,
  inputProps: PropTypes.object,
  onSaveInput: PropTypes.func.isRequired,
  textSize: PropTypes.string
}