import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { getLatestUploads } from '../../api/movie';
import { useNotification } from '../../hooks';
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from 'react-icons/ai';
import { Link } from 'react-router-dom';

let count=0;
let intervalId;
let newTime=0;
let lastTime=0;

export default function HeroSlideShow() {
    const [currentSlide, setCurrentSlide] = useState({});
    const [cloneSlide,setcloneSlide]=useState({});
    const [slides,setSlides]=useState([]);
    const [visible,setVisible]=useState(true);
    const [upNext,setUpNext]=useState([]);
    const slideRef=useRef(); //we use ref to pply animation to the current image  because every time images changes
    const cloneSlideRef=useRef(); //we use ref to pply animation to the current image  because every time images changes

    const {updateNotification}=useNotification();

    const fetchLatestUploads=async()=>{
        const {error,movies}=await getLatestUploads();
        if(error) return updateNotification("error",error);
        setSlides([...movies]);
        setCurrentSlide(movies[0]);
    }
    const startSlideShow=()=>{
        intervalId = setInterval(()=>{
            newTime=Date.now()
            const delta=newTime-lastTime;
            if(delta<4000) return clearInterval(intervalId)
            handleOnNextClick()}, 3500);
    }
    const pauseSlideShow=()=>{
        clearInterval(intervalId);
    }
    const updateUpNext=(currentIndex)=>{
        if(!slides.length) return ;

        const upNextCount=currentIndex+1;
        const end=upNextCount+3;
        let newSlides=[...slides]; //can tuse const 
        newSlides = newSlides.slice(upNextCount, end);
        if(!newSlides.length){
            newSlides=[...slides].slice(0,3);
        }
        setUpNext([...newSlides]);

    }

    const handleOnNextClick=()=>{
        lastTime=Date.now();
        pauseSlideShow()
        setcloneSlide(slides[count])//previous slide 
        count=(count+1)%slides.length;//present slide
        setCurrentSlide(slides[count]);
    
        cloneSlideRef.current.classList.add('slide-out-to-left');
        slideRef.current.classList.add('slide-in-from-right');
        updateUpNext(count);
        
    }
    const handleOnPreviousClick=()=>{
        pauseSlideShow()
        setcloneSlide(slides[count])//previous slide 
        count=(count+slides.length-1)%slides.length;//present slide
        setCurrentSlide(slides[count]);
        
        cloneSlideRef.current.classList.add('slide-out-to-right');
        slideRef.current.classList.add('slide-in-from-left');
        updateUpNext(count);
        
    }
    const handleAnimationEnd=()=>{
        const classes=["slide-out-to-left","slide-in-from-right","slide-out-to-right","slide-in-from-left"]
        slideRef.current.classList.remove(...classes); //we need to remove after the aimation end otherwise it wont work
        cloneSlideRef.current.classList.remove(...classes);
        setcloneSlide({});
        startSlideShow()
    }
    const handleOnVisibilityChange=()=>{
        const visibility=document.visibilityState;
        if(visibility==='hidden')setVisible(false);
        if(visibility==='visible')setVisible(true);

    }

    useEffect(()=>{
        const ac=new AbortController()
        fetchLatestUploads(ac.signal);
        document.addEventListener('visibilitychange',handleOnVisibilityChange)
        return ()=>{
            pauseSlideShow();//cleanup function
            document.removeEventListener(
                "visibilitychange",
                handleOnVisibilityChange
              ); 
              ac.abort();
        }
    },[])

    useEffect(()=>{
        if(slides.length && visible){
             startSlideShow();
             updateUpNext(count);
        }
        else pauseSlideShow();
        },[slides.length,visible])

    return (
    <div className="w-full flex">
            {/* slide section */}
        <div className='md:w-4/5 w-full aspect-video relative overflow-hidden'>
            {/* current slide */}
            <Slide title={currentSlide.title} src={currentSlide.poster} ref={slideRef} id={currentSlide.id}  />
                {/* cloneSlide */}
                <Slide title={cloneSlide.title} src={cloneSlide.poster} ref={cloneSlideRef} onAnimationEnd={handleAnimationEnd} id={currentSlide.id} /> 
                <SlideShowController
                    onNextClick={handleOnNextClick}
                    onPrevClick={handleOnPreviousClick}
                    />
    
        </div>
            {/* up next section  */}
        <div className="w-1/5 md:block hidden space-y-3 px-3">
            <h1 className='font-semibold text-2xl text-primary dark:text-white '> Up Next</h1>
            {upNext.map(({poster,id})=>{
                return <img key={id} src={poster} alt="" className='aspect-video object-cover rounded' />
            })}
        </div>
      
    </div>
  )
}

const SlideShowController=({onNextClick,onPrevClick})=>{
    const btnClass="text-xl bg-primary text-white rounded border-2 p-2"

    return (
        <div className='absolute top-1/2 -translate-y-1/2 w-full flex justify-between'>
            <button type="button" onClick={onPrevClick} className={btnClass}>
                <AiOutlineDoubleLeft/>
            </button>
            <button type="button" onClick={onNextClick} className={btnClass}>
                <AiOutlineDoubleRight/>
            </button>
        </div>
    )

}

const Slide=forwardRef((props,ref)=>{
    const {title,id,src,className="",...rest}=props;
    return (
        <Link to={'/movie/'+id} ref={ref} className={'w-full cursor-pointer block'+className} {...rest}>
           {src ? (
        <img className="aspect-video object-cover" src={src} alt="" />
            ) : null}
            {title ? (
                <div className="absolute inset-0 flex flex-col justify-end py-3 bg-gradient-to-t from-white via-tranparent dark:from-primary dark:via-transparent">
                <h1 className="font-semibold text-4xl dark:text-highlight-dark text-highlight" >
                    {title}
                </h1>
                </div>
            ) : null}
            
            </Link>)
            });

    