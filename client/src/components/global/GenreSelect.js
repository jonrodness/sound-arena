import React from 'react'
import PropTypes from 'prop-types'
import ListDialog from '../global/ListDialog'
import Button from '@material-ui/core/Button'
import { GENRES } from '../../reducers/competition'
import { GENRE_MAP } from '../../reducers/competition'
import { FaCaretDown } from 'react-icons/lib/fa'

const GenreSelect = props => {
    const { selectedGenre } = props 
    let genreOptions = GENRES.map(genre => {
            return {
                name: GENRE_MAP[genre].name,
                val: genre
            }
        }
    )

    const btnTitle = selectedGenre ? GENRE_MAP[selectedGenre].name : 'Select track genre'
    const btnColor = selectedGenre ? 'primary' : 'secondary'

    const openDialogBtn = (
        <Button
            className='a-button a-button--label a-button--lowercase'
            color={btnColor} 
            size='small'
            variant='outlined'
        >
            { btnTitle }
            { !props.disabled &&  <FaCaretDown /> }
        </Button>
    )

    return (
        <ListDialog
            disabled={ props.disabled }
            options={ genreOptions }
            onChange={ props.onSelectGenre }
            selectedItemKey={ selectedGenre }            
            title='Select track genre' 
            button={ openDialogBtn }
            shouldSelectOnMount={ true }
        />
    )
}

GenreSelect.propTypes = {
    onSelectGenre: PropTypes.func.isRequired,
    selectedGenre: PropTypes.string,
    disabled: PropTypes.bool
}

GenreSelect.defaultProps = {
    disabled: false,
}

export default GenreSelect