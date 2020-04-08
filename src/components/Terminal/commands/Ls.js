import React from 'react'
import { FileLabel } from '../style'
export default function({ files }) {
  return files.map(file => (
    <FileLabel key={file.path} isDir={!file.content}>
      {' '}
      {file.name}{' '}
    </FileLabel>
  ))
}
