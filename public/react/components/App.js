import { handleFormSubmit,handleFileChange} from "./api_calls"
import React, { useState } from 'react';
import apiURL from '../api';

export const App = () => {


  // State holds the value returned to the client by the server
  const [addedValue, setAddedValue] = useState('Placeholder')
  // State holds the current file that is to be uploaded to the server
  const [data,setData] = useState()









  return (
    <div>


      <div>
        <form onSubmit={(e) => handleFormSubmit(e, 'add', setAddedValue)} encType='multipart/form-data'>
          <input type='text'></input>
          <input type='text'></input>
          <input type='submit' value='Submit'></input>
        </form>

        <p>{addedValue}</p>
      </div>


      <div>
        <form onSubmit={(e) => handleFormSubmit(e,'upload',data)} encType='multipart/form-data'>
          <input type="file" name='file' onChange={(e) => handleFileChange(e,setData)} />
          <input type='submit' value='Upload'></input>
        </form>

      </div>

      <div>
        <form onSubmit={(e) => handleFormSubmit(e,'process')} encType='multipart/form-data'>
          <input type='text' placeholder="Please Submit File Name"></input>
          <input type='submit' value='Submit'></input>
        </form>

      </div>


    </div>
  )


}