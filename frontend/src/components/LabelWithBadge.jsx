import Label from "./Label"

const LabelWithBadge=({children,htmlFor,badge=0})=>{
    const renderBadge=()=>{
      if(!badge)return 
      return <span className="dark:bg-dark-subtle bg-light-subtle text-white absolute right-0  top-0 translate-x-2 translate-y-1 text-xs w-5 h-5 rounded-full flex justify-center items-center">
               {badge<=9?badge:"9+"}
        </span>
    }
    return(
    <div className='relative'>
    <Label htmlFor={htmlFor}>
        {children}
    </Label>
    {renderBadge()}
    </div>)
  }
  
  export default LabelWithBadge;