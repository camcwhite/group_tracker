import React, { useEffect, useRef, useState } from "react";
import useOutsideAlerter from "../../hooks/useClickOutside";
import './SearchDropDown.css';

type DropDownStyle = {
  maxHeight?: string,
  backgroundColor?: string,
  color?: string,
  lineHeight?: string,
  fontSize?: string,
}

type SearchDropDownProps = {
  options: string[],
  value: string,
  onChange: (newValue: string) => void,
  className?: string,
  placeholder?: string,
  width?: string,
  dropDownStyle?: DropDownStyle,
}

const defaultDropDownStyle:DropDownStyle = {
  maxHeight: "200px",
  backgroundColor: "white",
  color: "black",
  lineHeight: "50px",
  fontSize: "18px",
};

const SearchDropDown = (
  { options, value, onChange, className, placeholder, dropDownStyle }:
 SearchDropDownProps) => {
  const [showing, setShowing] = useState(false);
  // const [value, setValue] = useState('');
  const [dropDownOptions, setDropDownOptions] = useState(options)

  const handleEscapeKey = (ev: KeyboardEvent) => {
    if (ev.key === 'Escape') {
      setShowing(false);
    }
  };

  const wrapperRef = useRef<HTMLDivElement>(null);
  useOutsideAlerter(wrapperRef, () => setShowing(false));


  useEffect(() => {
    document.addEventListener("keydown", handleEscapeKey, false);
  }, []);

  const handleValueChange = (newValue: string) => {
    onChange(newValue);
    const newOptions = options.filter(str => str.toLowerCase().startsWith(newValue.toLowerCase()));
    if (newOptions.length > 0 && !showing) {
      setShowing(true);
    } 
    else if (newOptions.length === 0) {
      setShowing(false);
    }
    setDropDownOptions(newOptions);
  };

  if (!dropDownStyle) {
    dropDownStyle = defaultDropDownStyle;
  }

  return (
    <div 
      ref={wrapperRef} 
      className='_search-drop-down-container'
    >
      <div className={`${className} _search-bar-row`}>
        <input
          className={className}
          type='text'
          placeholder={placeholder ? placeholder : ""}
          value={value}
          onChange={ev => handleValueChange(ev.target.value)}
        />
        <button
          onClick={() => setShowing(!showing)}
        >
          &#9660;
        </button>
      </div>
      {showing ?
        <div 
          className='_drop-down-menu'
          style={{
            maxHeight: dropDownStyle.maxHeight,
            backgroundColor: dropDownStyle.backgroundColor
          }}
        >
          {dropDownOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                handleValueChange(option);
                setShowing(false);
              }}
              style={{
                color: dropDownStyle?.color,
                height: dropDownStyle?.lineHeight,
                fontSize: dropDownStyle?.fontSize,
              }}
            >
              {option}
            </button>
          ))}
        </div>
        : null}
      {/* <datalist id='group-name-suggestions'>
        {options.map((option, index) => (
          <option value={option} key={index} />
        ))}
      </datalist> */}
    </div>
  );
};

export default SearchDropDown;