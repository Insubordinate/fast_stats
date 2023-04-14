import {ProcessedObj} from './processedObj'

export function ProcessedList(props){
    return (
        <>
            {props.data.map((item)=> <ProcessedObj item={item}/>)}
        </>
    )
}