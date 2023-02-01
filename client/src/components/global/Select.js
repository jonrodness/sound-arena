import React, { Component } from 'react'

class Select extends Component {
    constructor(props) {
      super(props)
      this.selectEl = null
    }

    setSelectRef = el => {
        this.selectEl = el
    }

    onChange = e => {
        this.props.onChange(e.target.value)
    } 

    componentDidUpdate(prevProps) {
        // Update state if options change - cannot compare arrays, so stringify
        if (JSON.stringify(prevProps.options) !== JSON.stringify(this.props.options)) {
            this.props.onChange(this.selectEl.value)
        }
    }

    render() {
        let options = this.props.options.map (
            option => {
                return (
                    <option
                        key={ option.val } 
                        value={ option.val }>
                        { option.name }
                    </option>
                )
            }
        )

        return (
            <div onChange={ this.onChange }>
                <select ref={ this.setSelectRef }>
                    { options }
                </select>
            </div>
        )
    }
}

export default Select