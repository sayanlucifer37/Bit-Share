"use client"
import React, { useState, useCallback } from 'react'
import styles from '@/styles/auth.module.css'
import { useDropzone } from 'react-dropzone'


const page = () => {
  const [file, setFile] = useState<any>(null)
  const [email, setEmail] = useState('')

  const onDrop = useCallback((acceptedFiles: any) => {
    console.log(acceptedFiles)
    setFile(acceptedFiles[0])

    // Do something with the files
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const removeFile = () => {
    setFile(null)
  }
  const viewFile = () => { }

  return (
    <div className={styles.authpage}>
      <div className={styles.inputcontaner}>
        <label htmlFor="email">Receiver's email</label>
        <input type="email" name="email" id="email" value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div className={styles.inputcontaner}>
        {
          file ?
            <div className={styles.filecard}>
              <div className={styles.left}>
                <p>{file.name}</p>
                <p>{(file.size / 1024).toFixed(2)} KB</p>
              </div>

              <div className={styles.right}>

              <svg
                  onClick={removeFile}
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>

                <svg
                  onClick={viewFile}

                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>

              </div>

            </div>
            :
            <div className={styles.dropzone} {...getRootProps()}>
              <input {...getInputProps()} />
              {
                isDragActive ?
                  <p>Drop the files here ...</p> :
                  <div className={styles.droptext}>
                    <p>Drag 'n' drop some files here</p>
                    <p>or</p>
                    <p>click here to select files</p>
                  </div>
              }
            </div>
        }
      </div>
    </div>
  )
}

export default page