import React, {RefObject, useEffect} from "react";

/**
 * Hook that alerts clicks outside of the passed ref
 * from: https://stackoverflow.com/questions/32553158/detect-click-outside-react-component#:~:text=/**%0A%20*%20Hook%20that%20alerts,mousedown%22%2C%20handleClickOutside)%3B%0A%20%20%20%20%20%20%20%20%7D%3B%0A%20%20%20%20%7D%2C%20%5Bref%5D)%3B%0A%7D
 */
const useOutsideAlerter = (ref:RefObject<HTMLDivElement>, callback: () => void) => {
  useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event: MouseEvent) {
          if (ref.current && 
              event.target instanceof Element && 
              !ref.current.contains(event.target)
            ) 
              {
              callback();
          }
      }

      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
          // Unbind the event listener on clean up
          document.removeEventListener("mousedown", handleClickOutside);
      };
  }, [ref]);
}

export default useOutsideAlerter;
