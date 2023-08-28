import React from 'react'
import ModalContainer from './ModalContainer'
import { ImSpinner3 } from 'react-icons/im'

export default function ConfirmModal({visible,busy,onConfirm,onCancel,title,subtitle}) {
   const commonClass="px-3 py-1 text-white rounded"
  return (
    <ModalContainer visible={visible} ignoreContainer>
        <div className="dark:bg-primary bg-white rounded p-5">
            <h1 className='text-red-400 font-semibold text-lg'>{title}</h1>
            <p className='text-secondary dark:text-white text-sm '>{subtitle} </p>
            <div className="flex items-center space-x-3 mt-3 ">
                {busy? (<p className='flex items-center space-x-3 text-primary dark:text-white'><ImSpinner3 className='animate-spin' /><span>Please Wait</span></p>):(
                <>
                <button type="button" className={commonClass+ " bg-red-500"} onClick={onConfirm}> Confirm </button>
                <button type="button " className={commonClass+" bg-blue-500"} onClick={onCancel}> Cancel</button>
                </>
                )}
            </div>
        </div>

    </ModalContainer>
  )
}
