import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import classNames from 'classnames'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import LoadableElement from '../global/LoadableElement'
import { UPLOAD_TRACK } from '../../actions/user'

class FileUploader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      acceptedFiles: [],
      rejectedFiles: []
    }
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    this.setState({
      acceptedFiles: acceptedFiles,
      rejectedFiles: rejectedFiles
    })
  }

  onSubmitFile = () => {
    this.props.onSubmitFile(this.state.acceptedFiles)
  }

  renderFiles = files => {
    let count = 0;
    return files.map(file => {
      return (
        <li key={ count++ }>
          <Typography
            variant='body1' 
            component='p'
          >
            { file.name }
          </Typography>
        </li>
      )
    })
  }

  render() {
    const {
      acceptedFiles,
      rejectedFiles
    } = this.state
    const isFilesReadyForUpload = !!acceptedFiles.length

    const uploadResultList = (title, files) => {
      return (
        files.length > 0 && (
          <React.Fragment>
            <Typography
              variant='h6' 
              component='p'
            >
              { title }
            </Typography>
            <ul>
              { this.renderFiles(files) }
            </ul>
          </React.Fragment>
        )
      )
    }

    return (
      <React.Fragment>
        <div className='m-dropzoneContainer'>
          <Dropzone onDrop={ this.onDrop } >
            {
              ({
                getRootProps, 
                getInputProps, 
                isDragActive
              }) => {
                return (
                  <div
                    {...getRootProps()}
                    className={classNames('dropzone', {'dropzone--isActive': isDragActive})}
                  >
                    <input {...getInputProps()} />
                    {
                      isDragActive ? (
                        <p>Drag and drop files here, or click here to select files.</p>
                      ) : (
                        <p>Click here to select files.</p>
                      )
                    }
                  </div>
                )
              }
            }
          </Dropzone>    
        </div>
        <div className='u-marginVertical'>
          { 
            uploadResultList(
              'Files to add:',
              acceptedFiles
            )
          }
          {
            uploadResultList(
              'Invalid Files:',
              rejectedFiles
            )
          }
        </div>
        { 
          isFilesReadyForUpload && (
            <div className='u-centered'>
              <LoadableElement loadIds={ [ UPLOAD_TRACK ] }>
                <Button
                  onClick={ this.onSubmitFile } 
                  variant="contained"
                  color="primary" >
                  Upload
                </Button>
              </LoadableElement>
            </div>
          )        
        }
      </React.Fragment>
    )
  }
}

export default FileUploader