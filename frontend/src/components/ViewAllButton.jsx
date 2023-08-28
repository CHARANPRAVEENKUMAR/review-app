 const ViewAllBtn=({children,onClick,visible})=>{
    if(!visible) return null;
    return (
      <button 
          onClick={onClick} 
          className='dark:text-white text-primary hover:underline transition' type="button"> {/* type button very very necessary it prevent form submit when user click enter */}
            {children}
          </button>
    )
  }
  
export default ViewAllBtn;