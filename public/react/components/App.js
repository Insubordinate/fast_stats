import { get_all_rows, handleFileChange, handleUploadClick } from "./api_calls"
import React, { useState, useEffect } from 'react';
import { ProcessedList } from "./processed_list";

export const App = () => {
  // State holds the current file that is to be uploaded to the server
  const [data, setData] = useState()
  const [processedResults, setProcessedResults] = useState([])

  useEffect(() => {
      get_all_rows(setProcessedResults)
  }, [])



  return (
    <div className="top_level_container">
        <form onSubmit={(e) => handleUploadClick(e, data)} encType='multipart/form-data'>
          <input type="file" name='file' onChange={(e) => handleFileChange(e, setData)} />
          <input type='submit' value='Upload'></input>
        </form>


        <button onClick={(e) => get_all_rows(setProcessedResults)}>Refresh</button>



        <ProcessedList data={processedResults}/>


    </div>
  )


}