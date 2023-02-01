import React, { Component } from 'react';
import PropTypes from 'prop-types'

class Form extends Component {
    constructor(props) {
        super(props)
        this.onClickSubmit = this.onClickSubmit.bind(this)
    }
    
    // Finds all inputs in form and send to onSubmit handler
    onClickSubmit(e) {
        e.preventDefault()
        
        const htmlInputs = e.target.getElementsByTagName('input')
        let formData = {}
        for (let input of htmlInputs) {
            formData[input.name] = input.value 
        }
        this.props.onSubmit(formData)
    }
    
    render() {
        const renderInputs = () => {
            return this.props.inputs.map(input => {
                return (
                    <div key={input.name}>
                        <label htmlFor={input.name}>{input.label}</label><br/>
                        <input type={input.type} name={input.name}></input>  
                    </div>
                )
            })
        }  

        return (
          <div>
            <div className='u-centered'>
              <form onSubmit={ this.onClickSubmit }>
                { renderInputs() }
                <br/>
                <button
                    className='u-centered'
                    type='submit' >
                    { this.props.submitText }
                </button>
              </form>        
            </div>
          </div>
        );
      }
}

Form.propTypes = {
    inputs: PropTypes.array,
    submitText: PropTypes.string,
    onSubmit: PropTypes.func
}

export default Form