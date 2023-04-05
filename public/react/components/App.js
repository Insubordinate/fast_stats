

/* to do 


  Make the on click event pass the file to Flask 
  Have flask store the file locally into the folder
  Verify the file integrity once it has been stored
  Create a reference to the file
  Pass the reference to the file to the MYSQL DB
  Check to see that database entry is accurate
  Calling a fetch to the db should return that object you uploaded
*/











/*


There should be a state on whether or not an object was fetched.
If the button is clicked, the "fetch state should be true"
*/

import React, {useState} from 'react';
import apiURL from '../api';

export const App = () => {

    const [addedValue,setAddedValue] = useState('Placeholder')

    const handleAddClick = (e) => {
        e.preventDefault()
        
        const toSend = new FormData()
        toSend.append("a",e.target[0].value)
        toSend.append("b",e.target[1].value)
        fetch('http://localhost:5000/tasks/add', {
          method: 'POST',
          body: toSend,
        })
          .then((res) => res.json())
          .then((data) => {

            const poll = () =>  {
              fetch(`http://localhost:5000/tasks/result/${data['result_id']}`)
              .then(response => response.json())
              .then(data =>{
                if(!data['ready']){
                  setTimeout(poll,500)
                }else{
                  setAddedValue(data['value'])
                }
              
              })
            }

            poll()
          })
          .catch((err) => console.error(err));
    };


    return(
          <div>
              <form onSubmit={(e)=>handleAddClick(e)} encType='multipart/form-data'>
                <input type='text'></input>
                <input type='text'></input>  
                <input type='submit' value='Submit'></input>
              </form>

              <p>{addedValue}</p>
          </div>
    )


}