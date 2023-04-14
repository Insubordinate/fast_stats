export function ProcessedObj (props){

    real_place = 'http://localhost:5000/' + props.item[3].slice(0,-4) + '.png'
    console.log(props.item[4])

    if(props.item[4]===1){
        return (
            <div className="true_container_bad">
                <div className="obj_container">
                    <img src={real_place}></img>
                </div>
            </div>
        )
    }
    else{
        return (
            <div className="true_container_good">
                <div className="obj_container">
                    <img src={real_place}></img>
                </div>
            </div>
        )
    }

}