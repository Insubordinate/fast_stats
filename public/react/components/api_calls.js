




// The generic polling method that can be called by the callback functions of the individual actions
const poll = (g_data, taskType, ...dependencies) => {

    // The endpoint is going to be /tasks/result/<id> where id is the id recieved in the previous callback
    fetch(`http://localhost:5000/tasks/result/${g_data['result_id']}`)
        .then(response => response.json())
        .then(data => {
            if (!data['ready']) {
                //Call itself again in 500 ms if the data status hasn't changed to ready
                setTimeout(poll(g_data,taskType,...dependencies),500)
            } else {


                //logic on what to do with the response depending on the taskType
                if (taskType === 'add') {
                    //If it has, change the state of addedValue to reflect the message received back from the server
                    dependencies[0](data['value'])
                }
                if (taskType ==='upload'){
                    console.log('Done uploading')
                }
                if(taskType==='process'){
                    console.log(data['value'])
                    console.log('Done Processing')
                }


            }
        })
}





///Generic Form Handler that's going to be called by the Front-End
const handleFormSubmit = (e, taskType, ...dependencies) => {
    e.preventDefault()
    if (taskType === 'add') {
        // this dependency should be the "setAddValue" setter
        handleAddClick(e, dependencies[0])
    }
    if (taskType === 'upload') {
        handleUploadClick(e,dependencies[0])
    }
    if (taskType ==='process'){
        handleProcessClick(e)
    }

}





const handleProcessClick = (e) =>{
    const formData = new FormData()
    formData.append("filename",e.target[0].value)

    fetch('http://localhost:5000/tasks/process', {
        method: 'POST',
        body: formData,
    })
        .then((res) => res.json())
        .then((data) => {
            poll(data,'process')
        })
        .catch((err) => console.error(err));
}





const handleUploadClick = (e,data) => {
    if (!data) {
        return;
    }



    fetch('http://localhost:5000/tasks/upload', {
        method: 'POST',
        body: data,
    })
        .then((res) => res.json())
        .then((data) => {
            poll(data, 'upload')
        })
        .catch((err) => console.error(err));
};








//Function handles the request/response cycle when adding two numbers together
const handleAddClick = (e, setAddedValue) => {
    //Add to the form the two values passed in the by event. (e)
    const toSend = new FormData()
    toSend.append("a", e.target[0].value)
    toSend.append("b", e.target[1].value)
    //Issue a POST request to the endpoints /tasks/add
    //It will be returned the ID of the task
    fetch('http://localhost:5000/tasks/add', {
        method: 'POST',
        body: toSend,
    })

        .then((res) => res.json())
        .then((data) => {
            poll(data, 'add', setAddedValue)
        })

        .catch((err) => console.error(err));
};



















const handleFileChange = (e, setData) => {
    e.preventDefault()
    if (e.target.files) {
        const toSend = new FormData()
        toSend.append("filename", e.target.files[0].name)
        toSend.append("file", e.target.files[0])
        setData(toSend)
    }
}



module.exports = { handleFormSubmit, handleFileChange }