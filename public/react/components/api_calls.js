const handleUploadClick = (e, data) => {
    e.preventDefault()
    if (!data) {
        return;
    }
    fetch('http://localhost:5000/tasks/upload', {
        method: 'POST',
        body: data,
    })
        .then((res) => res.json())
        .then((callback) => {
            poll_for_upload(callback)
        })
        .catch((err) => console.error(err));
};


// The generic polling method that can be called by the callback functions of the individual actions
const poll_for_upload = (global_data) => {
    // The endpoint is going to be /tasks/result/<id> where id is the id recieved in the previous callback
    fetch(`http://localhost:5000/tasks/result/${global_data['result_id']}`)
        .then(response => response.json())
        .then(data => {
            if (!data['ready']) {
                //Call itself again in 500 ms if the data status hasn't changed to ready
                setTimeout(poll_for_upload(global_data,500))
            } else {
                    console.log(`Done Processing task ${global_data['result_id']}`)
            }
        })
}





const handleFileChange = (e, setData) => {
    e.preventDefault()
    if (e.target.files) {
        const toSend = new FormData()
        toSend.append("filename", e.target.files[0].name)
        toSend.append("file", e.target.files[0])
        setData(toSend)
    }
}




const get_all_rows = (setData) => {
    fetch('http://localhost:5000/tasks/info', {
        method: "GET"
      })
      .then(response => response.json())
      .then(data =>call_back_for_logging(data,setData) )
}


const call_back_for_logging = (data,setData) => {
    setData(data)
}   
module.exports = { handleUploadClick, handleFileChange ,get_all_rows}