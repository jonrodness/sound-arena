export const ScrollToElement = props => {
    const myRef = useRef(null)
    const {
        fireScrollBtn,
        scrollToElement
    } = props
 
    const executeScroll = () => myRef.current.scrollIntoView()    
 
    return (
       <> 
            <scrollToElement ref={myRef} />
            <fireScrollBtn></fireScrollBtn>
          <button onClick={executeScroll}> Click to scroll </button> 
       </>
    )
}