import React from 'react'
import Link from '@material-ui/core/Link'
import { isUrlSafe } from '../../../utils/validations'

export const SafeLink = props => {
    const {
        url,
        ...rest
    } = props

    return isUrlSafe(url) ? (
        <Link {...rest} >
            {props.children}
        </Link>
    ) : null
}