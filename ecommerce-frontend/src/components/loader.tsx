import React from 'react'
import "../styles/app.scss";

const Loader = () => {
  return (
    <div>Loading...</div>
  )
}
export default Loader


export const Skeleton = ({width="unset",length=3}:{width?:string,length?:number}) => {

  // Array.from(object,mapFn,thisReference) // object can be anything Map,Object,arr
  // this works fine even though length is not defined is considers {length} as an array obj by default (with only length prop defined the value of _ is undefined on each position)
  const skeletons =  Array.from({length},(_,idx)=> <div key={"demo-idx"+idx} className="skeleton-shape"></div> )


  return(
    <div className="skeleton-loader" style={{width}}>
      {skeletons}
    </div>
  )
}