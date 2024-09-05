import {MdError} from 'react-icons/md';

const NotFound = () => {
  return (
    <div className='container not-found'>
        <MdError/>
        <p>Page Not Found</p>
    </div>
  )
}

export default NotFound