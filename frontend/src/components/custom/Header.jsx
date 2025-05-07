import React from 'react'

const Header = () => {
  return (
    <div  className='shadow-sm  flex justify-between items-center px-5 p-3'>
      <img src="/logo.svg" alt="" />
      <div>
      <button>Sign in</button>
      </div>
    </div>
  )
}

export default Header
